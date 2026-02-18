from datetime import datetime
from app.extensions import db

class Hackathon(db.Model):
    __tablename__ = "hackathons"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
   
    organizer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    organizer = db.relationship("User", back_populates="hackathons")

    mode = db.Column(db.String(20)) 
    registration_fee = db.Column(db.Float, default=0.0)
    prize_pool = db.Column(db.Float, default=0.0)

    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    spam_probability = db.Column(db.Float, default=0.0)
    is_flagged = db.Column(db.Boolean, default=False)
    is_approved = db.Column(db.Boolean, default=True)

    registrations = db.relationship(
    "Registration",
    backref="hackathon",
    cascade="all, delete-orphan",
    passive_deletes=True
)


    def __repr__(self):
        return f"<Hackathon {self.title}>"
