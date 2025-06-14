from flask import render_template, current_app
from flask_mail import Message

from flask import current_app
import secrets

def generate_opt_code():
    return str(secrets.randbelow(1000000)).zfill(6)

def send_validation_email(nombre: str, email: str):
    opt_code = generate_opt_code()

    html = render_template("user_validation.html", nombre=nombre, opt_code=opt_code, año_actual=2025)

    msg = Message(
        subject="Validación de cuenta - GastroLink",
        recipients=[email],
        html=html
    )

    with current_app.app_context():
        current_app.extensions['mail'].send(msg)

    return opt_code
