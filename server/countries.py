import json
import pandas as pd

# Definí la lista de países de LATAM que querés incluir
LATAM = [
    "Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Costa Rica",
    "Cuba", "Dominican Republic", "Ecuador", "El Salvador", "Guatemala",
    "Honduras", "Mexico", "Nicaragua", "Panama", "Paraguay", "Peru",
    "Uruguay", "Venezuela"
]

# 1. Carga el JSON completo
with open("countries+states+cities.json", encoding="utf-8") as f:
    data = json.load(f)

# 2. Filtra solo los países que están en LATAM
latam = [c for c in data if c.get("name") in LATAM]

# 3. Si querés un DataFrame (opcional, para inspección rápida con pandas)
if latam:
    df = pd.DataFrame(latam)
    print(df[["name", "iso2", "subregion"]])  # por ejemplo, para revisar

# 4. Guarda el resultado en un nuevo JSON
with open("latam_countries.json", "w", encoding="utf-8") as f:
    json.dump(latam, f, ensure_ascii=False, indent=2)
