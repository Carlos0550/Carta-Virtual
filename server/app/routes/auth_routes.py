from flask import Blueprint, jsonify, request
from ..validations.AuthTypes import LoginRequest
from typing import cast

from ..services.auth_services import loginUser, validate_and_login
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity
from datetime import timedelta
auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods = ["POST"])
def login_router():
    data = cast(LoginRequest, request.get_json())

    if not data["user_email"]:
        return jsonify({
            "msg": "El correo es obligatorio."
        }),400
    result = loginUser(data)
    return result
    
@auth_bp.route("/validate-login", methods=["GET"])
def validate_login():
    user_email = request.args.get("user_email")
    otp_code = request.args.get("otp_code")

    if not user_email or not otp_code:
        return jsonify({"msg": "Faltan parámetros en la URL."}), 400
    
    result = validate_and_login(user_email=user_email, otp_code=otp_code)
    return result

@auth_bp.route("/restore-session", methods=["GET"])
@jwt_required()  
def restore_session():
    user_id = get_jwt_identity()
    claims = get_jwt() 

    return jsonify({
        "user_id": user_id,
        "user_name": claims.get("user_name"),
        "user_email": claims.get("user_email")
    }), 200


@auth_bp.route("/refresh-session", methods=["POST"])
@jwt_required(refresh=True) 
def refresh_session():
    user_id = get_jwt_identity() 
    claims = get_jwt()
    new_claims = {
        "user_id": claims.get("user_id"),
        "user_name": claims.get("user_name"),
        "user_email": claims.get("user_email"),
    }

    new_access_token = create_access_token(
        identity=user_id,
        additional_claims=new_claims,
        expires_delta=timedelta(minutes=10)
    )

    return jsonify({
        "access_token": new_access_token,
        "user_data": new_claims
    }), 200