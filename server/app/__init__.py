import os
import requests
from datetime import timedelta

from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from dotenv import load_dotenv
from config import config_dict

from flask_jwt_extended import JWTManager

from .routes.users_routes import users_bp
from .routes.auth_routes import auth_bp
from .routes.geo_routes import geo_bp
from .routes.business_routes import business_routes

from .connections.pg_database import db
load_dotenv()

mail = Mail()
jwt = JWTManager()

import os
import requests
from tqdm import tqdm

def download_geo_data():
    """
    Descarga el archivo de geodatos mostrando una barra de progreso.
    """
    BASE_DIR = os.path.dirname(__file__)
    TARGET_DIR = os.path.normpath(
        os.path.join(BASE_DIR, "services", "utils", "geoDB")
    )
    os.makedirs(TARGET_DIR, exist_ok=True)

    TARGET_FILE = "countries+states+cities.json"
    FILE_PATH = os.path.join(TARGET_DIR, TARGET_FILE)

    if os.path.isfile(FILE_PATH):
        print(f"[download_geo_data] Archivo ya existe: {FILE_PATH}")
        return FILE_PATH

    url = os.getenv("GEO_DATA_URL")
    if not url:
        raise RuntimeError("La variable de entorno GEO_DATA_URL no está definida")

    resp = requests.get(url, stream=True)
    resp.raise_for_status()

    total_size = int(resp.headers.get('Content-Length', 0))

    with open(FILE_PATH, "wb") as f, tqdm(
        total=total_size, unit='B', unit_scale=True, desc="Descargando geoDB"
    ) as bar:
        for chunk in resp.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)
                bar.update(len(chunk))

    print(f"[download_geo_data] Geo data descargado en: {FILE_PATH}")
    return FILE_PATH


def create_app():
    env = os.getenv("FLASK_ENV", "development")
    app = Flask(__name__)
    CORS(app, supports_credentials=True)

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
    app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False

    app.config.from_object(config_dict[env])

    db.init_app(app)
    mail.init_app(app)
    jwt.init_app(app)

    app.register_blueprint(users_bp, url_prefix="/users")
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(geo_bp, url_prefix="/geodata")
    app.register_blueprint(business_routes, url_prefix="/business")
    
    download_geo_data()
    return app
