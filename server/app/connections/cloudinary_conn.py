import cloudinary
import os

import cloudinary.uploader

cloudinary.config(
  cloud_name = "dyeu6veur",
  api_key = "568541368718788",
  api_secret = os.getenv("CLOUDINARY_API_SECRET")
);

def uploadSinglemage(data):
    cloudinary.uploader.upload()