import { JWT_SECRET } from "../config/config.js";
import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => {
    // Leer si el usuario mandó la llave en el headers
    const authHeader= req.headers['authorization'];
    // authHeader = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZS..."
    // Si existe, conpruebo el token. 
    // El split coge el string de arriba. Lo convierte en un array por cada separación ' ' 
    // y luego agarra el [1], es decir, el token(eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZS...)
    const token = authHeader && authHeader.split(' ')[1];
    // Si el token no existe, no da autorización
    if(!token) return res.sendStatus(401);  //unauthorized

    // Si recibo el token, verifico que está bien con jwt
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)   // Forbidden (no coinciden)
        req.user = user;
        // SI la llave es correcta hacemos un next(), middleware en info.js
        next();
    })
}