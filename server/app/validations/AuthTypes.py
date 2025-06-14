from typing import TypedDict

class LoginRequest(TypedDict):
    user_email: str

class UserData(TypedDict):
    user_email: str
    user_name: str
    user_id: str
    user_state: str
