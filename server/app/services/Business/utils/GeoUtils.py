from typing import Dict

from app.services.Geographic.geo_services import _load_countries_data

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