from flask import Blueprint, request, jsonify
from app.services.Business.business_services import create_business, get_business_by_user

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
        }
        
        for field_name, field_value in required_fields.items():
            if field_value is None:
                return jsonify({"message": f"Campo requerido faltante: {field_name}"}), 400
        
        business_data: BusinessPayload = {
            "business_name": required_fields["business_name"],  # type: ignore
            "business_description": required_fields["business_description"],  
            "business_address1": required_fields["business_address1"],  
            "countryCode": required_fields["countryCode"],  
            "regionCode": required_fields["regionCode"],  
            "city": required_fields["city"],  
            "business_phone": required_fields["business_phone"],  
            "business_email": required_fields["business_email"],  
            "business_image": request.files.get("business_image")
        }
    except Exception as e:
        return jsonify({"message": f"Error al procesar los datos del formulario: {str(e)}"}), 400

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
