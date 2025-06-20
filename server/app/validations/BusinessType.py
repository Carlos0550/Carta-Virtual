from typing import TypedDict, Optional
from werkzeug.datastructures import FileStorage

class BusinessPayload(TypedDict):
    business_name: str
    business_description: str
    business_address1: str
    countryCode: str
    regionCode: str
    city: str
    business_phone: str
    business_email: str
    business_image: Optional[FileStorage]
    business_id: Optional[str]