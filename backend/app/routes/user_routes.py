from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.user_similarity_service import get_similar_users
from app.models.registration_model import Registration
from app.models.user_model import User
from app.models.user_connection_model import UserConnection
from app.extensions import db

user_bp = Blueprint("users", __name__, url_prefix="/api/users")


@user_bp.route("/history", methods=["GET"])
@jwt_required()
def get_user_history():

    user_id = int(get_jwt_identity())

    registrations = (
        Registration.query
        .filter_by(user_id=user_id)
        .order_by(Registration.registered_at.desc())
        .all()
    )

    result = []

    for reg in registrations:
        h = reg.hackathon

        result.append({
            "registration_id": reg.id,
            "registered_at": reg.registered_at.isoformat(),

            "hackathon": {
                "id": h.id,
                "title": h.title,
                "description": h.description,
                "prize_pool": h.prize_pool,
                "spam_probability": round(float(h.spam_probability), 4) if h.spam_probability else 0,
                "risk_status": (
                    "high_risk" if h.spam_probability > 0.80
                    else "medium_risk" if h.spam_probability > 0.6
                    else "legit"
                ),
                "organizer": {
                    "id": h.organizer.id,
                    "username": h.organizer.username
                }
            }
        })

    return jsonify({
        "total_joined": len(result),
        "history": result
    }), 200


@user_bp.route("/connect", methods=["GET"])
@jwt_required()
def connect_users():

    user_id = int(get_jwt_identity())

    similar_users = get_similar_users(user_id)

    return {
        "similar_users": similar_users
    }, 200

@user_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    joined_count = len(user.registrations)
    created_count = len(user.hackathons)

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "joined_count": joined_count,
        "created_count": created_count
    })


@user_bp.route("/<int:user_id>", methods=["GET"])
def public_profile(user_id):

    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    created_hackathons = [
        {
            "id": h.id,
            "title": h.title,
            "participants_count": len(h.registrations),
            "spam_probability": float(h.spam_probability)
        }
        for h in user.hackathons
    ]

    return jsonify({
        "id": user.id,
        "username": user.username,
        "created_count": len(user.hackathons),
        "joined_count": len(user.registrations),
        "created_hackathons": created_hackathons
    })


@user_bp.route("/connect/<int:target_id>",methods=["POST"])
@jwt_required()
def connect_user(target_id):

    current_user_id = int(get_jwt_identity())

    if current_user_id == target_id:
        return jsonify({"message":"Connot connect to yourself"}), 400
    
    existing = UserConnection.query.filter_by(
        follower_id = current_user_id,
        followed_id = target_id
    ).first()

    if existing:
        db.session.delete(existing)
        db.session.commit()
        return jsonify({"message":"Connection removed"}), 200
    
    new_connection = UserConnection(
        follower_id = current_user_id,
        followed_id = target_id
    )

    db.session.add(new_connection)
    db.session.commit()

    return jsonify({"message":"Connected to user "}), 201


@user_bp.route("/connections", methods=["GET"])
@jwt_required()
def get_connections():

    current_user_id = int(get_jwt_identity())

    connections = UserConnection.query.filter_by(
        follower_id=current_user_id
    ).all()

    result = []

    for conn in connections:
        user = User.query.get(conn.followed_id)

        joined_hackathons = [
            {
                "id": r.hackathon.id,
                "title": r.hackathon.title,
                "spam_probability": float(r.hackathon.spam_probability)
            }
            for r in user.registrations
        ]

        result.append({
            "id": user.id,
            "username": user.username,
            "joined_hackathons": joined_hackathons
        })

    return jsonify({
        "connections": result
    }), 200
