from ..emails.UserLoginMail import sendUserOTPLogin
from ..connections.redis_conn import r

from ..connections.pg_database import db
from ..validations.AuthTypes import LoginRequest
from ..models import Users

from flask import jsonify, make_response
from datetime import timedelta, time, datetime
from flask_jwt_extended import create_access_token, create_refresh_token, set_refresh_cookies

from ..services.users_services import generate_and_send_otp

def loginUser(data: LoginRequest):
    try:
        founded_user: Users = db.session.query(Users).filter_by(
            user_email=data["user_email"]
        ).first()

        if not founded_user:
            return jsonify({
                "msg": "No se encontró un usuario con el correo ingresado."
            }), 404
        if founded_user.user_state == "pending":
            generate_and_send_otp(founded_user.user_name, founded_user.user_email)
            return jsonify({
                "msg": "Su cuenta aún no ha sido verificada, un nuevo código fué enviado a su correo."
            }),401
        
        

        code = sendUserOTPLogin(
            user_name=founded_user.user_name,
            user_email=founded_user.user_email
        )

        if not code:
            return jsonify({
                "msg": "No pudimos enviarle su código de verificación, espere unos segundos e intente nuevamente"
            }),500
        
        redis_key = str(f"login_code:{founded_user.user_email}")

        r.hset(redis_key, mapping={
            "otp_code": str(code)
        })
        r.expire(redis_key, 5*60)

        return jsonify({
            "msg": "Un código de acceso fué enviado a su correo."
        }),200
        
    except Exception as e:
        print(e)
        return jsonify({
            "msg": "Error interno del servidor, intente iniciar sesión más tarde."
        }), 500
        

def validate_and_login(user_email:str, otp_code:str):
    redis_key = str(f"login_code:{user_email}")

    try:
        redis_result = r.hgetall(redis_key)

        if not redis_result:
            return jsonify({
                "msg": "El código ingresado es inválido o incorrecto"
            }), 400
        stored_code = redis_result.get(b"otp_code")
        if not stored_code or stored_code.decode() != otp_code:
            return jsonify({"msg": "El código introducido no es válido"}), 400
        founded_user: Users = db.session.query(Users).filter_by(
            user_email=user_email
        ).first()


        user_identity = str(founded_user.user_id) 
        claims = {
            "user_id": founded_user.user_id,
            "user_name": founded_user.user_name,    
            "user_email": founded_user.user_email
        }

        now = datetime.now()

        tomorrow_midnight = datetime.combine(now.date() + timedelta(days=1), time.min)

        expires_delta = tomorrow_midnight - now

        access_token = create_access_token(
            identity=user_identity,
            additional_claims=claims,
            expires_delta= timedelta(minutes=1) 
        )

        refresh_token = create_refresh_token(
            identity=user_identity,
            additional_claims=claims,
            expires_delta=(timedelta(days=7))
        )

        response = make_response(jsonify({
            "msg": "Inicio de sesión exitoso.",
            "access_token": access_token,
            "user_data": claims
        }), 200)

        set_refresh_cookies(response, refresh_token)
        r.delete(redis_key)

        return response
    
    except Exception as e:
        print(e)
        return jsonify({
            "msg": "Error interno del servidor, intente iniciar sesión más tarde."
        }), 500

