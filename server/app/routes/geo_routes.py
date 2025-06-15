from ..services.geo_services import get_countries
from flask_jwt_extended import jwt_required
from flask import Blueprint, jsonify, request

geo_bp = Blueprint("geo", __name__)

@geo_bp.route("/countries", methods=["GET"])
@jwt_required()
def list_countries():
    name_prefix = request.args.get("namePrefix", "")
    countries = get_countries(name_prefix)
    return jsonify({
        "countries": countries,
        "msg": f"{len(countries)} país(es) encontrados"  
    }), 200



