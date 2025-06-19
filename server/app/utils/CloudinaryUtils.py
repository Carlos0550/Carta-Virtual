from werkzeug.datastructures import FileStorage
from urllib.parse import urlparse

from app.connections.cloudinary_conn import cloudinary

def UploadImageToCloudinary(image:FileStorage, folder:str)-> str:
    try:
        upload_result = cloudinary.uploader.upload(image, folder=folder)
        return upload_result.get("secure_url", "")
    except Exception as e:
        print(e)
        return ""
    
def DeleteFromCloudinary(image_url:str)-> str:
    try:
        path = urlparse(image_url).path

        public_id_with_ext = path.split("/")[-2:]
        public_id = "/".join(public_id_with_ext).rsplit(".",1)[0]
        print("Public ID:", public_id)
        delete_result = cloudinary.uploader.destroy(public_id)
        print("Resultado Cloudinary:", delete_result)
        return delete_result.get("result", "error")
    except Exception as e:
        print("Error al eliminar imagen en Cloudinary:", e)
        return "error"