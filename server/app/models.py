from .connections.pg_database import db
from sqlalchemy.dialects.postgresql import UUID, JSONB, BIGINT, TEXT, NUMERIC
from sqlalchemy.schema import Column, ForeignKey

from uuid import uuid4
import enum

class UserStatesEnum(enum.Enum):
    pending = "pending"
    checked = "checked"

class Users(db.Model):
    __tablename__ = "users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_name = Column(TEXT, nullable=False)
    user_email = Column(TEXT, nullable=False)
    user_state = Column(db.Enum(UserStatesEnum), nullable=False)

class Business(db.Model):
    __tablename__ = "business"
    business_id = Column(UUID, primary_key=True, server_default=db.text("gen_random_uuid()"))
    business_name = Column(TEXT, unique=True, nullable=False)
    business_geodata = Column(JSONB, nullable=False)
    business_phone = Column(TEXT, nullable=True)
    business_email = Column(TEXT, nullable=True)
    business_description = Column(TEXT, nullable=True)
    business_user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'), nullable=False)
    business_banner = Column(TEXT, nullable=True)
    def serialize(self, include=None):
        data = {
            "business_id": self.business_id,
            "business_name": self.business_name,
            "business_geodata": self.business_geodata,
            "business_phone": self.business_phone,
            "business_email": self.business_email,
            "business_description": self.business_description,
            "business_banner": self.business_banner
        }
        if include:
            data = {k: v for k, v in data.items() if k in include}
        return data


class Categories(db.Model):
    __tablename__ = "categories"

    category_name = Column(BIGINT, primary_key=True)
    category_description = Column(TEXT, nullable=True)
    category_image = Column(TEXT, nullable=False)
    category_products_count = Column(NUMERIC, nullable=False)
    business_category_id = Column(UUID, ForeignKey("business.business_id"))

    def to_dict(self):
        return {
            "category_name": self.category_name,
            "category_description": self.category_description,
            "category_image": self.category_image,
            "category_products_count": self.category_products_count,
            "business_category_id": self.business_category_id
        }
    
