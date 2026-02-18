from datetime import datetime
from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    password_hash = db.Column(db.String(255), nullable=False)

    role = db.Column(db.String(20), default="student")  
    is_verified = db.Column(db.Boolean, default=False)

    reputation_score = db.Column(db.Float, default=0.0)

    account_created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)

    registrations = db.relationship(
        "Registration",
        backref="user",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    hackathons = db.relationship(
        "Hackathon",
        back_populates="organizer",
        cascade="all, delete-orphan"
    )


    
    followers = db.relationship(
        "UserConnection",
        foreign_keys="UserConnection.followed_id",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    following = db.relationship(
        "UserConnection",
        foreign_keys="UserConnection.follower_id",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.username}>"
