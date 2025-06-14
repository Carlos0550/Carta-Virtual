from flask import jsonify, make_response
from ..models import Users
from ..validations.UserTypes import UserPayload, OtpValidation
from ..connections.redis_conn import r
from ..connections.pg_database import db
from ..emails.UserValidationMail import send_validation_email

from flask_jwt_extended import create_access_token, create_refresh_token, set_refresh_cookies
from datetime import timedelta
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

def create_user(data: UserPayload):
    if validate_pending_validation(data["user_email"]):
        if generate_and_send_otp(data["user_name"], data["user_email"]):
            return jsonify({"msg": "Código reenviado."}), 200
        return jsonify({"msg": "Error al reenviar el código."}), 400

    if verify_user_already_exists(data["user_email"]):
        return jsonify({"msg": "El correo ingresado ya existe."}), 400

    new_user = Users(
        user_name=data["user_name"].capitalize(),
        user_email=data["user_email"],
        user_state="pending"
    )

    try:
        db.session.add(new_user)
        db.session.commit()

        if new_user.user_id and generate_and_send_otp(new_user.user_name, new_user.user_email):
            return jsonify({"msg": "Usuario creado correctamente."}), 201

        return jsonify({"msg": "No se pudo enviar el código de verificación."}), 400

    except Exception as e:
        db.session.rollback()
        print("ERROR EN CREATE_USER:", e)
        return jsonify({"msg": "Error al crear el usuario.", "error": str(e)}), 500

def validate_opt(data: OtpValidation):
    redis_key = f"user_validation:{data['user_email']}"
    redis_result = r.hgetall(redis_key)

    if not redis_result:
        if generate_and_send_otp(data.get("user_name", ""), data["user_email"]):
            return jsonify({"msg": "Código expirado. Enviamos uno nuevo."}), 404
        return jsonify({"msg": "No se pudo verificar su cuenta."}), 404

    stored_code = redis_result.get(b"otp_code")
    if not stored_code or stored_code.decode() != data["otp_code"]:
        return jsonify({"msg": "El código introducido no es válido"}), 400

    try:
        db.session.query(Users).filter_by(user_email=data["user_email"]).update({
            "user_state": "checked"
        })
        db.session.commit()
        founded_user: Users = db.session.query(Users).filter_by(
            user_email=data["user_email"]
        ).first()
        r.delete(redis_key)

        #Hacemos este paso para que el cliente no tenga que logearse despues de registrarse, ya que 
        #se encontró con que el front no tiene los datos del usuario luego de terminar el registro
        user_identity = str(founded_user.user_id) 
        claims = {
            "user_id": founded_user.user_id,
            "user_name": founded_user.user_name,    
            "user_email": founded_user.user_email
        }

        access_token = create_access_token(
            identity=user_identity,
            additional_claims=claims,
            expires_delta=timedelta(minutes=10)  
        )

        refresh_token = create_refresh_token(
            identity=user_identity,
            expires_delta=timedelta(days=7)      
        )

        response = make_response(jsonify({
            "msg": "Inicio de sesión exitoso.",
            "access_token": access_token,
            "user_data": claims
        }), 200)

        set_refresh_cookies(response, refresh_token)

        return response
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"msg": "Error al verificar la cuenta.", "error": str(e)}), 500

def restart_user_validation(data: UserPayload):
    if generate_and_send_otp(data["user_name"], data["user_email"]):
        return jsonify({"msg": "Código de autenticación reenviado."}), 200
    return jsonify({"msg": "No fue posible reenviar el código."}), 400
