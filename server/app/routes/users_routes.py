from flask import Blueprint, jsonify, request
from app.services.Users.users_services import create_user, validate_opt, restart_user_validation
from typing import cast
from ..validations.UserTypes import UserPayload, OtpValidation

users_bp = Blueprint("users", __name__)

@users_bp.route("/create", methods=["POST"])
def create_user_router():
    data = cast(UserPayload, request.get_json())
    
    if not data or not data.get("user_email") or not data.get("user_name"):
        return jsonify({
            "msg": "Faltan datos obligatorios: nombre o correo electrónico."
        }), 400

    return create_user(data)

@users_bp.route("/validate", methods=["POST"])
def validate_user_router():
    data = cast(OtpValidation ,request.get_json())

    if not data or not data.get("otp_code") or not data.get("user_email"):
        return jsonify({
            "msg": "Faltan el código OTP o el correo electrónico."
        }), 400

    return validate_opt(data)

@users_bp.route("/restart-validation", methods=["POST"])
def restart_validation_router():
    data = cast(UserPayload, request.get_json())
    
    if not data or not data.get("user_name") or not data.get("user_email"):
        return jsonify({
            "msg": "Faltan datos para reiniciar la validación."
        }), 400

    return restart_user_validation(data)
