import dotenv from 'dotenv';
dotenv.config();
// Path
import path from 'path';
export const __dirname = path.resolve();
// Puerto y dominio
export const PORT = process.env.PORT || 5000;
export const DOMAIN = process.env.DOMAIN || "http://localhost"
// configuracion de mongoDB
export const mongodbUri = process.env.MONGODB_URI;
// JWT Secret Key
export const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"