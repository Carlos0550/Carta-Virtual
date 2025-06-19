from app.services.Geographic.geo_services import get_countries, get_regions, get_cities
from flask_jwt_extended import jwt_required
from flask import Blueprint, jsonify, request

geo_bp = Blueprint("geo", __name__)

# Obtener países
@geo_bp.route("/countries", methods=["GET"])
@jwt_required()
def list_countries():
    name_prefix = request.args.get("namePrefix", "")
    countries = get_countries(name_prefix)
    return jsonify({
        "countries": countries,
        "msg": f"{len(countries)} país(es) encontrados"  
    }), 200

# Obtener regiones por país ISO
@geo_bp.route("/regions", methods=["GET"])
@jwt_required()
def list_regions():
    country_iso = request.args.get("country_iso", "")
    if not country_iso:
        return jsonify({"regions": [], "msg": "Falta el parámetro country_iso"}), 400

    regions = get_regions(country_iso)
    return jsonify({
        "regions": regions,
        "msg": f"{len(regions)} región(es) encontradas"
    }), 200

# Obtener ciudades por país ISO y región ID
@geo_bp.route("/cities", methods=["GET"])
@jwt_required()
def list_cities():
    country_iso = request.args.get("country_iso", "")
    region_id = request.args.get("region_id", "")

    if not country_iso or not region_id:
        return jsonify({"cities": [], "msg": "Faltan parámetros country_iso o region_id"}), 400

    try:
        region_id = int(region_id)
    except ValueError:
        return jsonify({"cities": [], "msg": "region_id debe ser un número válido"}), 400

    cities = get_cities(country_iso, region_id)
    return jsonify({
        "cities": cities,
        "msg": f"{len(cities)} ciudad(es) encontradas"
    }), 200
