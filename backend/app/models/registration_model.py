from datetime import datetime
from app.extensions import db


class Registration(db.Model):
    __tablename__ = "registrations"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    hackathon_id = db.Column(
        db.Integer,
        db.ForeignKey("hackathons.id", ondelete="CASCADE"),
        nullable=False
    )

    registered_at = db.Column(db.DateTime, default=datetime.utcnow)

    status = db.Column(db.String(20), default="registered")  

    def __repr__(self):
        return f"<Registration User {self.user_id} Hackathon {self.hackathon_id}>"
