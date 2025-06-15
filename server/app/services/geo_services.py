import json
from functools import lru_cache
from typing import List

@lru_cache(maxsize=1)
def _load_countries_data()-> List[dict]:
    with open("utils/geoDB/latam_countries.json", encoding="utf-8") as f:
        return json.load(f)

def get_countries(namePrefix: str = "") -> List[str]:
    data = _load_countries_data()
    names = [c["name"] for c in data]
    
    if not namePrefix:
        return names
    
    q = namePrefix.strip().lower()

    return [n for n in names if q in n.lower()]

