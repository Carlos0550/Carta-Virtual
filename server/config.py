import os
from dotenv import load_dotenv

load_dotenv()

class BaseConfig:
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = os.getenv("PG_CONN_STRING")
    DEBUG = True

class ProductionConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = os.getenv("PG_CONN_STRING")
    DEBUG = False

config_dict = {
    "development": DevelopmentConfig,
    "production": ProductionConfig
}