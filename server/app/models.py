from .connections.pg_database import db
from sqlalchemy.dialects.postgresql import UUID, JSONB
from uuid import uuid4
import enum

class UserStatesEnum(enum.Enum):
    pending = "pending"
    checked = "checked"

class Users(db.Model):
    __tablename__ = "users"

    user_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_name = db.Column(db.String, nullable=False)
    user_email = db.Column(db.String, nullable=False)
    user_state = db.Column(db.Enum(UserStatesEnum), nullable=False)

class Business(db.Model):
    __tablename__ = "business"
    business_id = db.Column(UUID, primary_key=True, server_default=db.text("gen_random_uuid()"))
    business_name = db.Column(db.String, unique=True, nullable=False)
    business_geodata = db.Column(JSONB, nullable=False)
    business_phone = db.Column(db.String, nullable=False)
    business_email = db.Column(db.String, nullable=False)
    business_description = db.Column(db.String, nullable=True)
    business_user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.user_id'), nullable=False)
    business_banner = db.Column(db.String, nullable=True)
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
