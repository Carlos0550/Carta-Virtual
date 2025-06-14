from .connections.pg_database import db
from sqlalchemy.dialects.postgresql import UUID
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
    
    business_name = db.Column(db.String, primary_key=True, unique=True, nullable=False)
    business_address1 = db.Column(db.String, nullable=False)
    business_address2 = db.Column(db.String, nullable=True)
    business_phone = db.Column(db.String, nullable=False)
    business_user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.user_id'), nullable=False)
