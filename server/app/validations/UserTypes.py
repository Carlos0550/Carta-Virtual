from typing import TypedDict
class UserPayload(TypedDict):
    user_id: str
    user_name: str
    user_email: str

class OtpValidation(TypedDict, UserPayload):
    otp_code: str