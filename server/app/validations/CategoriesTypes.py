from typing import TypedDict
from werkzeug.datastructures import FileStorage

class CategoryPayload(TypedDict):
    category_name: str
    category_description:str
    category_image: FileStorage
    business_id: str