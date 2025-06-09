
import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as dotenv from 'dotenv';
import { Express } from 'express';

dotenv.config(); // Carga el .env

// Configura Cloudinary con variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage para multer con Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async(req, file) =>{
    return{
      folder: 'Recetas', 
      format: file.mimetype.split('/')[1],
      resource_type: 'image',
    };
  },
});

@Controller('upload')
export class UploadController {
  /**
   * Sube una imagen a Cloudinary y devuelve la URL pública
   * El campo del formulario debe llamarse 'file'
   */
  @Post('receta')
  @UseInterceptors(FileInterceptor('file', { storage }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // file.path es la URL pública
    // file.filename es el public_id en Cloudinary
    return { url: file.path, public_id: file.filename };
  }
}
