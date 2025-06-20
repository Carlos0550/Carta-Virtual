from flask import Blueprint, request, jsonify
from app.services.Categories.categories_services import (
    save_category,
    get_categories,
    update_category,
    delete_category
)
from app.validations.CategoriesTypes import CategoryPayload
categories_routes = Blueprint("categories_routes", __name__)

@categories_routes.route("/create", methods=["POST"])
def create_category():
    try:
        business_id = request.args.get("business_id")
        if not business_id:
            return jsonify({"message": "business_id es requerido en query params"}), 400
        
        required_fields = {
            "category_name": request.form.get("category_name"),
            "category_description": request.form.get("category_description"),
            "category_image": request.files.get("category_image")
        }

        for field_name, field_value in required_fields.items():
            if field_value is None:
                return jsonify({"message": f"Campo requerido faltante: {field_name}"}), 400
        
        category_data: CategoryPayload = {
            "category_name": required_fields["category_name"],
            "category_description": required_fields["category_description"],
            "business_id": business_id,
            "category_image": required_fields["category_image"]
        }
    except Exception as e:
        return jsonify({"message": f"Error al procesar los datos del formulario: {str(e)}"}), 400

    result = save_category(category_data, business_id)
    
    if isinstance(result, tuple):
        return result
    
    return result

@categories_routes.route("/retrieve-data", methods=["GET"])
def get_categories_route():
    business_id = request.args.get("business_id")
    if not business_id:
        return jsonify({"message": "business_id es requerido en query params"}), 400
    
    result = get_categories(business_id)

    return result


@categories_routes.route("/update", methods=["PUT"])
def update_category_route():
    business_id = request.args.get("business_id")
    category_id = request.args.get("category_id")
    if not business_id or not category_id:
        return jsonify({"message": "business_id y category_id son requeridos"}), 400

    try:
        required_fields = {
            "category_name": request.form.get("category_name"),
            "category_description": request.form.get("category_description"),
            "category_image": request.files.get("category_image")
        }

        for fname, fvalue in required_fields.items():
            if fvalue is None:
                return jsonify({"message": f"Campo requerido faltante: {fname}"}), 400

        category_data: CategoryPayload = {
            "category_name": required_fields["category_name"],
            "category_description": required_fields["category_description"],
            "business_id": business_id,
            "category_image": required_fields["category_image"]
        }
    except Exception as e:
        return jsonify({"message": f"Error al procesar los datos del formulario: {str(e)}"}), 400

    result = update_category(category_data, category_id, business_id)
    return result


@categories_routes.route("/delete", methods=["DELETE"])
def delete_category_route():
    business_id = request.args.get("business_id")
    category_id = request.args.get("category_id")
    if not business_id or not category_id:
        return jsonify({"message": "business_id y category_id son requeridos"}), 400

    result = delete_category(category_id, business_id)
    return result
