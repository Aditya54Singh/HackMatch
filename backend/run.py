from app import create_app

app = create_app()


@app.route("/")
def home():
    return "Hackthon Backend Running"


@app.route("/test-feature")
def test_feature():
    from app.models.user_model import User
    from app.services.feature_engineering_service import build_feature_dict

    organizer = User.query.first()

    if organizer is None:
        return {"error": "No user found in database. Create a user first."}

    sample_data = {
        "title": "AI Hackathon 2026",
        "description": "Join now! Limited offer! Visit http://example.com",
        "prize_pool": 50000
    }

    features = build_feature_dict(sample_data, organizer)

    return features


@app.route("/create-test-user")
def create_test_user():
    from app.extensions import db
    from app.models.user_model import User

    user = User(
        username="admin",
        email="admin@test.com"
    )
    user.set_password("123456")

    db.session.add(user)
    db.session.commit()

    return {"message": "Test user created"}
  

if __name__ == "__main__":
    app.run(debug=True)
