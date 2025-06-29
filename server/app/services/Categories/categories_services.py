from app.models import Categories
from app.connections.pg_database import db
from app.validations.CategoriesTypes import CategoryPayload
from app.utils.CloudinaryUtils import UploadImageToCloudinary, DeleteFromCloudinary
from typing import Union, Dict
from flask import jsonify, Response
import logging
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from werkzeug.exceptions import BadRequest

# Configurar logging
logger = logging.getLogger(__name__)

class CategoryServiceError(Exception):
    """Excepción personalizada para errores del servicio de categorías"""
    pass

def save_category(data: CategoryPayload, business_id: str) -> Union[Dict[str, str], tuple[Response, int]]:
    """
    Guarda una nueva categoría en la base de datos
    
    Args:
        data: Datos de la categoría
        business_id: ID del negocio
        
    Returns:
        Respuesta JSON con la categoría creada o error
        
    Raises:
        CategoryServiceError: Si hay un error en el servicio
    """
    image_url = ""
    
    if not data.get('category_name'):
        logger.error("Intento de crear categoría sin nombre")
        return jsonify({"msg": "El nombre de la categoría es obligatorio"}), 400
    
    if not business_id:
        logger.error("Intento de crear categoría sin business_id")
        return jsonify({"msg": "ID de negocio es obligatorio"}), 400
    
    try:
        if data.get("category_image"):
            logger.info(f"Subiendo imagen para categoría: {data['category_name']}")
            image_url = UploadImageToCloudinary(data["category_image"], folder="categories")
            logger.info(f"Imagen subida exitosamente: {image_url}")
    except Exception as e:
        logger.error(f"Error al subir imagen para categoría {data.get('category_name', 'N/A')}: {str(e)}")
        return jsonify({
            "msg": "Error al procesar la imagen. Verifica que el archivo sea válido.",
            "error": str(e)
        }), 500
    
    try:
        new_category = Categories(
            category_name=data['category_name'], # type: ignore
            category_description=data.get('category_description', None), # type: ignore
            category_image=image_url, # type: ignore
            category_products_count=0, # type: ignore
            business_category_id=business_id # type: ignore
        )
        
        logger.info(f"Creando categoría: {data['category_name']} para negocio: {business_id}")
        
        db.session.add(new_category)
        db.session.commit()
        
        logger.info(f"Categoría creada exitosamente: {new_category.category_name}")
        
        return jsonify({
            "msg": "Categoría creada exitosamente",
            "category": {
                "category_id": new_category.category_id,
                "category_name": new_category.category_name,
                "category_description": new_category.category_description,
                "category_image": new_category.category_image,
                "category_products_count": new_category.category_products_count,
                "business_category_id": new_category.business_category_id
            }
        }), 201
        
    except IntegrityError as e:
        db.session.rollback()
        logger.error(f"Error de integridad al crear categoría: {str(e)}")
        
        if image_url:
            try:
                DeleteFromCloudinary(image_url)
                logger.info(f"Imagen eliminada de Cloudinary después de error: {image_url}")
            except Exception as cleanup_error:
                logger.error(f"Error al limpiar imagen de Cloudinary: {str(cleanup_error)}")
        
        if "unique" in str(e).lower():
            return jsonify({
                "msg": "Ya existe una categoría con este nombre en tu negocio",
                "error": "DUPLICATE_CATEGORY"
            }), 409
        elif "foreign key" in str(e).lower():
            return jsonify({
                "msg": "El negocio especificado no existe",
                "error": "INVALID_BUSINESS"
            }), 400
        else:
            return jsonify({
                "msg": "Error de validación en los datos de la categoría",
                "error": "VALIDATION_ERROR"
            }), 400
            
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Error de base de datos al crear categoría: {str(e)}")
        
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
        logger.error(f"Error inesperado al crear categoría: {str(e)}")
        
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

def get_categories(business_id:str):
    """
    Obtiene las categorías de un negocio
    
    Args:
        business_id: ID del negocio
        
    Returns:
        Respuesta JSON con las categorías o error
    """
    try:
        categories = Categories.query.filter_by(business_category_id=business_id).all()
        return jsonify({
            "msg": "Categorías obtenidas exitosamente",
            "categories": [cat.to_dict() for cat in categories]
        }), 200
    except Exception as e:
        logger.error(f"Error al obtener categorías: {str(e)}")
        return jsonify({
            "msg": "Error al obtener categorías",
            "error": str(e)
        }), 500


def update_category(data: CategoryPayload, category_id: str, business_id: str):
    """Actualiza una categoría existente"""
    try:
        category = Categories.query.filter_by(category_id=category_id, business_category_id=business_id).first()
        if not category:
            return jsonify({
                "msg": "Categoría no encontrada",
                "error": "CATEGORY_NOT_FOUND"
            }), 404

        if category.category_name != data['category_name']:
            existing = Categories.query.filter_by(category_name=data['category_name'], business_category_id=business_id).first()
            if existing:
                return jsonify({
                    "msg": "Ya existe una categoría con ese nombre",
                    "error": "DUPLICATE_CATEGORY"
                }), 409

        image_url = category.category_image
        print(image_url)
        if data.get("category_image"):
            new_url = UploadImageToCloudinary(data["category_image"], folder="categories")
            if not new_url:
                return jsonify({
                    "msg": "Error al subir la nueva imagen",
                    "error": "IMAGE_UPLOAD_ERROR"
                }), 500
            delete_result = DeleteFromCloudinary(image_url)
            print(delete_result)
            if delete_result != "ok" and delete_result != "not found":
                DeleteFromCloudinary(new_url)
                return jsonify({
                    "msg": "No se pudo eliminar la imagen anterior",
                    "error": "IMAGE_DELETE_ERROR"
                }), 500
            image_url = new_url

        category.category_name = data['category_name']
        category.category_description = data.get('category_description', None)
        category.category_image = image_url

        db.session.commit()

        return jsonify({
            "msg": "Categoría actualizada exitosamente",
            "category": category.to_dict()
        }), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Error al actualizar categoría: {str(e)}")
        return jsonify({
            "msg": "Error interno del servidor. Inténtalo de nuevo más tarde.",
            "error": "DATABASE_ERROR"
        }), 500
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error inesperado al actualizar categoría: {str(e)}")
        return jsonify({
            "msg": "Error inesperado. Contacta al soporte técnico.",
            "error": "UNEXPECTED_ERROR"
        }), 500


def delete_category(category_id: str, business_id: str):
    """Elimina una categoría"""
    try:
        category = Categories.query.filter_by(category_id=category_id, business_category_id=business_id).first()
        if not category:
            return jsonify({
                "msg": "Categoría no encontrada",
                "error": "CATEGORY_NOT_FOUND"
            }), 404

        image_url = category.category_image

        db.session.delete(category)
        db.session.commit()

        if image_url:
            try:
                DeleteFromCloudinary(image_url)
            except Exception as e:
                logger.error(f"Error al eliminar imagen de Cloudinary: {str(e)}")

        return jsonify({
            "msg": "Categoría eliminada exitosamente"
        }), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Error de base de datos al eliminar categoría: {str(e)}")
        return jsonify({
            "msg": "Error interno del servidor. Inténtalo de nuevo más tarde.",
            "error": "DATABASE_ERROR"
        }), 500
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error inesperado al eliminar categoría: {str(e)}")
        return jsonify({
            "msg": "Error inesperado. Contacta al soporte técnico.",
            "error": "UNEXPECTED_ERROR"
        }), 500
