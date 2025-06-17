from flask import Blueprint, request, jsonify
from app.services.business_services import create_business, get_business_by_user

from flask_jwt_extended import jwt_required, get_jwt_identity
from app.validations.BusinessType import BusinessPayload
business_routes = Blueprint('business_routes', __name__)

@business_routes.route('/save', methods=['POST'])
@jwt_required()
def create_business_route():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data:
        return jsonify({"message": "No data provided"}), 400

    try:
        business_data = BusinessPayload(**data)
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    response = create_business(business_data, user_id)

    if isinstance(response, tuple):
        return response

    return jsonify(response), 201

@business_routes.route("/retrieve-data", methods=["GET"])
@jwt_required()
def get_business_route():
    user_id = get_jwt_identity()
    result = get_business_by_user(user_id)

    return result
