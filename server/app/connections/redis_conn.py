import redis
import os

env_dict = {
    "production": {
        "host": os.getenv("REDIS_HOST", "prod.redis.example.com"),
        "port": int(os.getenv("REDIS_PORT", 6379)),
        "db": int(os.getenv("REDIS_DB", 0)),
        "password": os.getenv("REDIS_PASSWORD", None)
    },
    "development":{
        "host": "172.21.239.139",
        "port": 6379,
        "db": 0,
        "password": None
    }
}
env = os.getenv("FLASK_ENV", "development")
config = env_dict[env]
r = redis.Redis(
    host=config["host"],
    port=config["port"],
    db=config["db"],
    password=config["password"]
)