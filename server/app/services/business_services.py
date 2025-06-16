from ..models import Business
from ..connections.pg_database import db
from ..validations.BusinessType import BusinessPayload
from typing import Dict
from .geo_services import _load_countries_data
from flask import jsonify

def getGeoData(countryCode: str, regionCode: int, city: str) -> Dict[str, str]:
    try:
        geodata = _load_countries_data()

        selected_country = [
            c for c in geodata if c["iso2"].lower() == countryCode.lower()
        ]
        if not selected_country:
            return {"msg": "País no encontrado"}, 404
    
        selected_region = [
            s for s in selected_country[0].get("states", [])
            if str(s.get("id")) == str(regionCode)
        ]

        if not selected_region:
            return {"msg": "Provincia no encontrada"}, 404

        selected_city = [
            c for c in selected_region[0].get("cities", [])
            if c.get("name", "").lower() == city.lower()
        ]
        if not selected_city:
            return {"msg": "Ciudad no encontrada"}, 404

        return {
            "country": selected_country[0]['name'],
            "region": selected_region[0]['name'],
            "city": selected_city[0]['name']
        }

    except Exception as e:
        print(f"Error al obtener datos geográficos: {e}")
        return {"msg": "Error interno al obtener datos geográficos"}, 500


def create_business(data: BusinessPayload, user_id: str) -> Dict[str, str]:
    sameBusiness = Business.query.filter_by(business_name=data['business_name']).first()
    if sameBusiness:
        return {"msg": "Ya existe un negocio con el mismo nombre, por favor ingrese otro."}, 400

    geo_response = getGeoData(data['countryCode'], data['regionCode'], data['city'])
    if isinstance(geo_response, tuple):  
        return geo_response
    
    newBusiness = Business(
        business_name=data['business_name'],
        business_geodata={
            "address1": data['business_address1'],
            "country": {
                "code": data['countryCode'],
                "label": geo_response['country']
            },
            "region": {
                "code": data['regionCode'],
                "label": geo_response['region']
            },
            "city": {
                "code": data['city'],
                "label": geo_response['city']
            }
        },
        business_phone=data['business_phone'],
        business_email=data['business_email'],
        business_description=data.get('business_description', None),
        business_user_id=user_id
    )

    try:
        db.session.add(newBusiness)
        db.session.commit()
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"msg": "Error al crear el negocio: " + str(e)}), 500

    return jsonify({
        "msg": "Negocio creado exitosamente",
        "newBusinessData": newBusiness.serialize()
    }), 201
