import json
import os
from typing import List, Dict
from functools import lru_cache

@lru_cache(maxsize=1)
def _load_countries_data() -> List[dict]:
    BASE_DIR = os.path.dirname(__file__)
    DATA_PATH = os.path.normpath(
        os.path.join(BASE_DIR, "utils", "geoDB", "countries+states+cities.json")
    )
    with open(DATA_PATH, encoding="utf-8") as f:
        return json.load(f)

def get_countries(namePrefix: str = "") -> List[Dict[str, str]]:
    data = _load_countries_data()

    all_countries = [
        {"value": c["iso2"], "label": c["name"]}
        for c in data
    ]

    if not namePrefix:
        return all_countries[:15]

    q = namePrefix.strip().lower()

    filtered = [
        c for c in all_countries if q in c["label"].lower()
    ]
    return filtered[:15]

def get_regions(country_iso: str) -> List[Dict[str, str]]:
    data = _load_countries_data()
    country = next((c for c in data if c["iso2"].lower() == country_iso.lower()), None)

    if not country or "states" not in country:
        return []

    return [
        {
            "value": str(state["id"]),
            "label": state["name"]
        }
        for state in country["states"]
        if state.get("id") and state.get("name")
    ]

def get_cities(country_iso: str, region_id: int) -> List[Dict[str, str]]:
    data = _load_countries_data()
    country = next((c for c in data if c["iso2"].lower() == country_iso.lower()), None)

    if not country:
        return []

    state = next((s for s in country.get("states", []) if s.get("id") == region_id), None)

    if not state or "cities" not in state:
        return []

    return [
        {
            "value": city["name"],
            "label": city["name"]
        }
        for city in state["cities"]
        if city.get("name")
    ]
