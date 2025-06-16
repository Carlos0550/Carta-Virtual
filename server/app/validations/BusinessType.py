from typing import TypedDict

class BusinessPayload(TypedDict):
    business_name: str
    business_description: str
    business_address1: str
    countryCode: str
    regionCode: str
    city: str
    business_phone: str
    business_email: str