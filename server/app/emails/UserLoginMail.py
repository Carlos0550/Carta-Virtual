from flask import render_template, current_app
from flask_mail import Message

from flask import current_app
import secrets
from datetime import datetime

def generate_opt_code():
    return str(secrets.randbelow(1000000)).zfill(6)

def sendUserOTPLogin(
    user_name: str,
    user_email: str
):
    opt_code = generate_opt_code()

    html = render_template("user_login.html", usuario_nombre=user_name, codigo_otp=opt_code, ano_actual=str(datetime.now().year))

    msg = Message(
        subject="Ingresá a tu cuenta - GastroLink",
        recipients=[user_email],
        html=html
    )

    with current_app.app_context():
        current_app.extensions['mail'].send(msg)

    return opt_code