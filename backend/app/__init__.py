from flask import Flask
from .config import Config
from .extensions import db, migrate, jwt
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    from app.models import (
        user_model,
        hackathon_model,
        registration_model,
        token_blocklist_model,
        user_connection_model
    )
    from app.routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp)
    from app.routes.hackathon_routes import hackathon_bp
    app.register_blueprint(hackathon_bp)
    from app.routes.user_routes import user_bp
    app.register_blueprint(user_bp)



    from app.models.token_blocklist_model import TokenBlocklist

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        token = TokenBlocklist.query.filter_by(jti=jti).first()
        return token is not None

    return app
