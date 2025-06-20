from sqlalchemy.sql.coercions import expect
from ...models import Business
from ...connections.pg_database import db
from ...validations.BusinessType import BusinessPayload
from typing import Dict, Union
from flask import jsonify, Response
import logging
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

from .utils.GeoUtils import getGeoData
from app.utils.CloudinaryUtils import UploadImageToCloudinary, DeleteFromCloudinary

# Configurar logging
logger = logging.getLogger(__name__)

class BusinessServiceError(Exception):
    """Excepción personalizada para errores del servicio de negocios"""
    pass

def create_business(data: BusinessPayload, user_id: str) -> Union[Dict[str, str], tuple[Response, int]]:
    """
    Crea un nuevo negocio en la base de datos
    
    Args:
        data: Datos del negocio
        user_id: ID del usuario propietario
        
    Returns:
        Respuesta JSON con el negocio creado o error
        
    Raises:
        BusinessServiceError: Si hay un error en el servicio
    """
    
    try:
        sameBusiness = Business.query.filter_by(business_name=data['business_name']).first()
        if sameBusiness:
            logger.warning(f"Intento de crear negocio con nombre duplicado: {data['business_name']}")
            return jsonify({
                "msg": "Ya existe un negocio con el mismo nombre, por favor ingrese otro.",
                "error": "DUPLICATE_BUSINESS_NAME"
            }), 409
    except SQLAlchemyError as e:
        logger.error(f"Error al verificar negocio existente: {str(e)}")
        return jsonify({
            "msg": "Error interno del servidor. Inténtalo de nuevo más tarde.",
            "error": "DATABASE_ERROR"
        }), 500
    
    try:
        logger.info(f"Obteniendo datos geográficos para: {data.get('city', 'N/A')}")
        geo_response = getGeoData(data['countryCode'], int(data['regionCode']), data['city'])
        if isinstance(geo_response, tuple):  
            logger.error("Error al obtener datos geográficos")
            return geo_response
        logger.info("Datos geográficos obtenidos exitosamente")
    except Exception as e:
        logger.error(f"Error inesperado al obtener datos geográficos: {str(e)}")
        return jsonify({
            "msg": "Error al procesar la ubicación del negocio.",
            "error": "GEO_ERROR"
        }), 500
    

    image_url = ""
    try:
        if data.get("business_image"):
            logger.info(f"Subiendo imagen para negocio: {data['business_name']}")
            image_url = UploadImageToCloudinary(data["business_image"], folder="businesses")
            logger.info(f"Imagen subida exitosamente: {image_url}")
    except Exception as e:
        logger.error(f"Error al subir imagen para negocio {data.get('business_name', 'N/A')}: {str(e)}")
        return jsonify({
            "msg": "Error al procesar la imagen. Verifica que el archivo sea válido.",
            "error": "IMAGE_UPLOAD_ERROR"
        }), 500
    
    try:
        newBusiness = Business(
            business_name=data['business_name'],
            business_geodata={
                "address1": data['business_address1'],
                "country": {
                    "code": data['countryCode'],
                    "label": geo_response['country']
                },
                "region": {
                    "code": data['regionCode'],
                    "label": geo_response['region']
                },
                "city": {
                    "code": data['city'],
                    "label": geo_response['city']
                }
            },
            business_phone=data['business_phone'],
            business_email=data['business_email'],
            business_description=data.get('business_description', None),
            business_user_id=user_id,
            business_banner=image_url
        )
        
        logger.info(f"Creando negocio: {data['business_name']} para usuario: {user_id}")
        
        db.session.add(newBusiness)
        db.session.commit()
        
        logger.info(f"Negocio creado exitosamente: {newBusiness.business_name}")
        
        return jsonify({
            "msg": "Negocio creado exitosamente",
            "newBusinessData": newBusiness.serialize()
        }), 201
        
    except IntegrityError as e:
        db.session.rollback()
        logger.error(f"Error de integridad al crear negocio: {str(e)}")
        
        # Limpiar imagen si se subió
        if image_url:
            try:
                DeleteFromCloudinary(image_url)
                logger.info(f"Imagen eliminada de Cloudinary después de error: {image_url}")
            except Exception as cleanup_error:
                logger.error(f"Error al limpiar imagen de Cloudinary: {str(cleanup_error)}")
        
        # Determinar el tipo específico de error de integridad
        if "unique" in str(e).lower():
            return jsonify({
                "msg": "Ya existe un negocio con este nombre",
                "error": "DUPLICATE_BUSINESS"
            }), 409
        elif "foreign key" in str(e).lower():
            return jsonify({
                "msg": "El usuario especificado no existe",
                "error": "INVALID_USER"
            }), 400
        else:
            return jsonify({
                "msg": "Error de validación en los datos del negocio",
                "error": "VALIDATION_ERROR"
            }), 400
            
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Error de base de datos al crear negocio: {str(e)}")
        
        # Limpiar imagen si se subió
        if image_url:
            try:
                DeleteFromCloudinary(image_url)
                logger.info(f"Imagen eliminada de Cloudinary después de error de BD: {image_url}")
            except Exception as cleanup_error:
                logger.error(f"Error al limpiar imagen de Cloudinary: {str(cleanup_error)}")
        
        return jsonify({
            "msg": "Error interno del servidor. Inténtalo de nuevo más tarde.",
            "error": "DATABASE_ERROR"
        }), 500
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error inesperado al crear negocio: {str(e)}")
        
        # Limpiar imagen si se subió
        if image_url:
            try:
                DeleteFromCloudinary(image_url)
                logger.info(f"Imagen eliminada de Cloudinary después de error inesperado: {image_url}")
            except Exception as cleanup_error:
                logger.error(f"Error al limpiar imagen de Cloudinary: {str(cleanup_error)}")
        
        return jsonify({
            "msg": "Error inesperado. Contacta al soporte técnico.",
            "error": "UNEXPECTED_ERROR"
        }), 500


def get_business_by_user(user_id: str):
    """
    Obtiene el negocio asociado a un usuario
    
    Args:
        user_id: ID del usuario
        
    Returns:
        Respuesta JSON con el negocio encontrado o error
    """
    
    # Validar datos de entrada
    if not user_id:
        logger.error("Intento de buscar negocio sin user_id")
        return jsonify({
            "msg": "ID de usuario es obligatorio",
            "error": "MISSING_USER_ID"
        }), 400
    
    try:
        logger.info(f"Buscando negocio para usuario: {user_id}")
        business = Business.query.filter_by(business_user_id=user_id).first()
        
        if not business:
            logger.warning(f"No se encontró negocio para usuario: {user_id}")
            return jsonify({
                "msg": "No se encontró ningún negocio para este usuario",
                "error": "BUSINESS_NOT_FOUND"
            }), 404
            
        logger.info(f"Negocio encontrado para usuario: {user_id}")
        return jsonify({
            "msg": "Negocio encontrado",
            "business": business.serialize()
        }), 200
        
    except SQLAlchemyError as e:
        logger.error(f"Error de base de datos al buscar negocio: {str(e)}")
        return jsonify({
            "msg": "Error interno del servidor. Inténtalo de nuevo más tarde.",
            "error": "DATABASE_ERROR"
        }), 500
        
    except Exception as e:
        logger.error(f"Error inesperado al buscar negocio: {str(e)}")
        return jsonify({
            "msg": "Error inesperado. Contacta al soporte técnico.",
            "error": "UNEXPECTED_ERROR"
        }), 500

    
def update_business_info(data: BusinessPayload, user_id: str) -> Union[Dict[str, str], tuple[Response, int]]:
    try:
        business = Business.query.filter_by(business_id=data['business_id'], business_user_id=user_id).first()
        if not business:
            return jsonify({
                "msg": "No tienes permisos para editar este negocio o no existe.",
                "error": "BUSINESS_NOT_FOUND"
            }), 404

        if business.business_name != data['business_name']:
            existing = Business.query.filter_by(business_name=data['business_name']).first()
            if existing:
                return jsonify({
                    "msg": "Ya existe un negocio con ese nombre.",
                    "error": "DUPLICATE_BUSINESS_NAME"
                }), 409

        image_url = business.business_banner
        new_url = UploadImageToCloudinary(data["business_image"], folder="businesses")
        if not new_url:
            return jsonify({
                "msg": "Error al subir la nueva imagen. La información no fue modificada.",
                "error": "IMAGE_UPLOAD_ERROR"
            }), 500
        delete_result = DeleteFromCloudinary(image_url)
        if delete_result != "ok":
            DeleteFromCloudinary(new_url)
            return jsonify({
                "msg": "No se pudo eliminar la imagen anterior.",
                "error": "IMAGE_DELETE_ERROR"
            }), 500
                
        image_url = new_url
        geo_response = getGeoData(data['countryCode'], int(data['regionCode']), data['city'])

        if isinstance(geo_response, tuple):  
            logger.error("Error al obtener datos geográficos")
            return geo_response
        business.business_name = data['business_name']
        business.business_geodata = {
            "address1": data['business_address1'],
            "country": {
                    "code": data['countryCode'],
                    "label": geo_response['country']
                },
                "region": {
                    "code": data['regionCode'],
                    "label": geo_response['region']
                },
                "city": {
                    "code": data['city'],
                    "label": geo_response['city']
                }
        }
        business.business_phone = data['business_phone']
        business.business_email = data['business_email']
        business.business_description = data.get('business_description', None)
        business.business_banner = image_url

        db.session.commit()

        return jsonify({
            "msg": "Negocio actualizado exitosamente",
            "business": business.serialize()
        }), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Error al actualizar negocio: {str(e)}")
        return jsonify({
            "msg": "Error interno del servidor. Inténtalo de nuevo más tarde.",
            "error": "DATABASE_ERROR"
        }), 500
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error inesperado al actualizar negocio: {str(e)}")
        return jsonify({
            "msg": "Error inesperado. Contacta al soporte técnico.",
            "error": "UNEXPECTED_ERROR"
        }), 500
