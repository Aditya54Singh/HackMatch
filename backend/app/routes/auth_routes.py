from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user_model import User
from flask_jwt_extended import create_access_token,jwt_required,get_jwt_identity
from datetime import timedelta
from flask_jwt_extended import get_jwt
from app.models.token_blocklist_model import TokenBlocklist

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Email already exists"}), 400

    user = User(
        username=data["username"],
        email=data["email"]
    )
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    user = User.query.filter_by(email=data["email"]).first()

    if not user or not user.check_password(data["password"]):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(
        identity=str(user.id),
        expires_delta=timedelta(days=1)
    )

    return jsonify({
        "access_token": access_token,
        "user_id": user.id
    })

@auth_bp.route("/update", methods=["PUT"])
@jwt_required()
def update_user():

    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    if "username" in data:
        user.username = data["username"]

    if "email" in data:
        existing_user = User.query.filter_by(email=data["email"]).first()
        if existing_user and existing_user.id != user.id:
            return jsonify({"message": "Email already exists"}), 400
        user.email = data["email"]

    db.session.commit()

    return jsonify({"message": "User updated successfully"})

@auth_bp.route("/change-password",methods=["PUT"])
@jwt_required()
def change_password():

    user_id = int(get_jwt_identity())
    user=User.query.get(user_id)

    data = request.get_json()

    if not user.check_password(data["old_password"]):
        return jsonify({"message":"old password incorrect"}), 400
    
    user.set_password(data["new_password"])
    db.session.commit()

    return jsonify({"message":"Password updated successfully"})

@auth_bp.route("/delete", methods=["DELETE"])
@jwt_required()
def delete_user():

    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    jti = get_jwt()["jti"]
    blocked_token = TokenBlocklist(jti=jti)
    db.session.add(blocked_token)

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted and token revoked"})
