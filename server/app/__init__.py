from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from dotenv import load_dotenv
import os
from config import config_dict
from .routes.users_routes import users_bp
from .routes.auth_routes import auth_bp
from .connections.pg_database import db

from datetime import timedelta
from flask_jwt_extended import JWTManager
load_dotenv()

mail = Mail()
jwt = JWTManager()
def create_app():
    env = os.getenv("FLASK_ENV", "development")
    app = Flask(__name__)
    CORS(app)

    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = os.getenv("GOOGLE_MAIL_EMAIL")
    app.config['MAIL_PASSWORD'] = os.getenv("GOOGLE_MAIL_KEY")
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv("GOOGLE_MAIL_EMAIL")

    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["JWT_COOKIE_SECURE"] = False  # true para HTTPS
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=7)

    app.config.from_object(config_dict[env])

    db.init_app(app)
    mail.init_app(app)
    jwt.init_app(app)

    app.register_blueprint(users_bp, url_prefix="/users")
    app.register_blueprint(auth_bp, url_prefix="/auth")

    return app
