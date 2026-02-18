from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

from app.extensions import db
from app.models.hackathon_model import Hackathon
from app.models.user_model import User
from app.services.feature_engineering_service import build_feature_dict
from app.ml.inference.predict_spam import predict_spam
from app.models.registration_model import Registration



hackathon_bp = Blueprint("hackathons", __name__, url_prefix="/api/hackathons")




@hackathon_bp.route("/", methods=["POST"])
@jwt_required()
def create_hackathon():

    user_id = int(get_jwt_identity())
    organizer = User.query.get(user_id)

    if not organizer:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()

    required_fields = ["title", "description", "prize_pool"]

    for field in required_fields:
        if field not in data:
            return jsonify({"message": f"{field} is required"}), 400

    # Build ML features
    feature_dict = build_feature_dict(data, organizer)
    print("FEATURE DICT:", feature_dict)

    # Predict spam
    ml_result = predict_spam(feature_dict)
    print("ML RESULT:", ml_result)

    # Block if high risk
    if ml_result["is_blocked"]:
        return jsonify({
            "message": "Hackathon blocked due to high spam risk",
            "risk_details": ml_result
        }), 400

    new_hackathon = Hackathon(
        title=data["title"],
        description=data["description"],
        prize_pool=data["prize_pool"],
        organizer_id=user_id,
        spam_probability=ml_result["spam_probability"],
        is_flagged=(ml_result["risk_status"] == "medium_risk"),
        created_at=datetime.utcnow()
    )

    db.session.add(new_hackathon)
    db.session.commit()

    return jsonify({
        "message": "Hackathon created successfully",
        "risk_details": ml_result
    }), 201


from datetime import datetime
from flask import request




@hackathon_bp.route("/", methods=["GET"])
def get_hackathons():

    filter_type = request.args.get("filter")
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 5, type=int)

    query = Hackathon.query

    # Spam filter
    if filter_type == "legit":
        query = query.filter(Hackathon.spam_probability < 0.6)

    elif filter_type == "medium":
        query = query.filter(
            Hackathon.spam_probability >= 0.6,
            Hackathon.spam_probability <= 0.85
        )

    elif filter_type == "high":
        query = query.filter(Hackathon.spam_probability > 0.85)

    hackathons = query.all()  # Fetch all for trending logic

    result = []

    for h in hackathons:

        participants_count = len(h.registrations)
        days_since_created = (datetime.utcnow() - h.created_at).days
        recency_boost = max(0, 30 - days_since_created)

        trending_score = (participants_count * 2) + recency_boost

        result.append({
            "id": h.id,
            "title": h.title,
            "description": h.description,
            "prize_pool": h.prize_pool,
            "participants_count": participants_count,
            "trending_score": trending_score,
            "spam_probability": round(float(h.spam_probability), 4) if h.spam_probability else 0,
            "risk_status": (
                "high_risk" if h.spam_probability > 0.85
                else "medium_risk" if h.spam_probability > 0.6
                else "legit"
            ),
            "organizer": {
                "id": h.organizer.id,
                "username": h.organizer.username
            },
            "created_at": h.created_at.isoformat()
        })

    # 🔥 GLOBAL TRENDING SORT
    result.sort(key=lambda x: x["trending_score"], reverse=True)

    total = len(result)
    total_pages = (total + limit - 1) // limit

    start = (page - 1) * limit
    end = start + limit

    paginated_result = result[start:end]

    return jsonify({
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": total_pages,
        "hackathons": paginated_result   # ✅ return sliced list
    }), 200






@hackathon_bp.route("/<int:hackathon_id>/register", methods=["POST"])
@jwt_required()
def register_for_hackathon(hackathon_id):

    user_id = get_jwt_identity()

    hackathon = Hackathon.query.get(hackathon_id)

    if not hackathon:
        return jsonify({"message": "Hackathon not found"}), 404

    # Check already registered
    existing = Registration.query.filter_by(
        user_id=user_id,
        hackathon_id=hackathon_id
    ).first()

    if existing:
        return jsonify({"message": "Already registered"}), 400

    new_registration = Registration(
        user_id=user_id,
        hackathon_id=hackathon_id
    )

    db.session.add(new_registration)
    db.session.commit()

    return jsonify({
        "message": "Registered successfully",
        "hackathon_id": hackathon_id
    }), 201



@hackathon_bp.route("/my-created", methods=["GET"])
@jwt_required()
def get_my_created_hackathons():

    user_id = get_jwt_identity()

    hackathons = Hackathon.query.filter_by(
        organizer_id=user_id
    ).order_by(Hackathon.created_at.desc()).all()

    result = []

    for h in hackathons:
        result.append({
            "id": h.id,
            "title": h.title,
            "description": h.description,
            "prize_pool": h.prize_pool,
            "participants_count": len(h.registrations),
            "spam_probability": round(float(h.spam_probability), 4) if h.spam_probability else 0,
            "risk_status": (
                "high_risk" if h.spam_probability > 0.85
                else "medium_risk" if h.spam_probability > 0.6
                else "legit"
            ),
            "created_at": h.created_at.isoformat()
        })

    return jsonify({"hackathons": result}), 200




@hackathon_bp.route("/<int:hackathon_id>", methods=["PUT"])
@jwt_required()
def update_hackathon(hackathon_id):

    user= int(get_jwt_identity())
    hackathon = Hackathon.query.get(hackathon_id)

    if not hackathon:
        return jsonify({"message":"Hacakthon nor found"}), 404
    
    if hackathon.organizer_id != user:
        return jsonify({"message":"Unauthorised"}), 403
    
    data = request.get_json()

    if 'description' in data:
        hackathon.description = data['description']

    if 'prize_pool' in data:
        hackathon.prize_pool = data['prize_pool']
    
    db.session.commit()

    return jsonify({"message":"Hackathon updated successfully"}), 200




@hackathon_bp.route('<int:hackathon_id>', methods=["DELETE"])
@jwt_required()
def delete_hackathon(hackathon_id):

    user_id = int(get_jwt_identity())

    hackathon = Hackathon.query.get(hackathon_id)

    if not hackathon:
        return jsonify({"message":"Hackathon not found"}), 404
    
    if hackathon.organizer_id != user_id:
        return jsonify({"message":"Unauthorised"}), 403
    
    db.session.delete(hackathon)
    db.session.commit()

    return jsonify({"message":"Hackathon deleted succcessfully"}), 200