from flask import Blueprint, request, jsonify
from app.services.Business.business_services import create_business, get_business_by_user, update_business_info

from flask_jwt_extended import jwt_required, get_jwt_identity
from app.validations.BusinessType import BusinessPayload

business_routes = Blueprint('business_routes', __name__)

@business_routes.route('/save', methods=['POST'])
@jwt_required()
def create_business_route():
    user_id = get_jwt_identity()

    try:
        required_fields = {
            "business_name": request.form.get("business_name"),
            "business_description": request.form.get("business_description"),
            "business_address1": request.form.get("business_address1"),
            "countryCode": request.form.get("countryCode"),
            "regionCode": request.form.get("regionCode"),
            "city": request.form.get("city"),
            "business_phone": request.form.get("business_phone"),
            "business_email": request.form.get("business_email"),
            "business_image": request.files.get("business_image")
        }
        
        for field_name, field_value in required_fields.items():
            if field_value is None:
                return jsonify({"msg": f"Campo requerido faltante: {field_name}"}), 400
        
        business_data: BusinessPayload = required_fields #type: ignore
    except Exception as e:
        return jsonify({"msg": f"Error al procesar los datos del formulario: {str(e)}"}), 400

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


@business_routes.route("/update", methods=["PUT"])
@jwt_required()
def update_business_route():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({
            "msg": "El servidor no recibió el ID de usuario."
        }),400
    try:
        required_fields = {
            "business_name": request.form.get("business_name"),
            "business_description": request.form.get("business_description"),
            "business_address1": request.form.get("business_address1"),
            "countryCode": request.form.get("countryCode"),
            "regionCode": request.form.get("regionCode"),
            "city": request.form.get("city"),
            "business_phone": request.form.get("business_phone"),
            "business_email": request.form.get("business_email"),
            "business_id": request.args.get("business_id"),
            "business_image": request.files.get("business_image")
        }
        print( request.form.get("business_name"))
        for field_name, field_value in required_fields.items():
            if field_value is None:
                return jsonify({"msg": f"Campo requerido faltante: {field_name}"}), 400
        business_data: BusinessPayload = required_fields  # type: ignore
        response = update_business_info(business_data, user_id)
        return response
    except Exception as e:
        return jsonify({"msg": f"Error al procesar los datos del formulario: {str(e)}"}), 400


