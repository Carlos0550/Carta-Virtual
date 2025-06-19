from app.connections.pg_database import db
from app.connections.redis_conn import r
from app.models import Users
from app.emails.UserValidationMail import send_validation_email


def generate_and_send_otp(user_name: str, user_email: str):
    try:
        if not user_name:
            user = db.session.query(Users).filter_by(user_email=user_email).first()
            if not user:
                return False
            user_name = user.user_name

        otp_code = send_validation_email(user_name, user_email)

        redis_key = f"user_validation:{user_email}"
        r.hset(redis_key, mapping={
            "user_email": user_email,
            "otp_code": otp_code
        })
        r.expire(redis_key, 5 * 60)
        return True
    except Exception as e:
        print("ERROR OTP:", e)
        return False

def validate_pending_validation(user_email: str):
    redis_key = f"user_validation:{user_email}"
    redis_result = r.hgetall(redis_key)

    if redis_result:
        r.delete(redis_key)
        return True
    return False

def verify_user_already_exists(user_email: str):
    user = db.session.query(Users).filter_by(user_email=user_email).first()
    if user:
        return True
    return False