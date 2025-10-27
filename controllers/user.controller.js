import bcrypt from 'bcrypt'; // Importar bcrypt para hashear contraseñas
import jwt from 'jsonwebtoken'; // Importar jsonwebtoken para crear tokens JWT
import { User } from '../data/mongobd.js' // Importar el modelo User y la conexión
import connectDB from '../data/mongobd.js';
import { JWT_SECRET } from '../config/config.js';  // Importar la variable de entorno JWT_SECRET
// Conectamos la BBDD
connectDB();

const responseAPI = {
    data: null,
    msg: "",
    count: 0,
    status: "ok"
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        if(users.length === 0) {
            responseAPI.msg = "No se han encontrado usuarios en la BBDD."
            responseAPI.count = 0;
            responseAPI.status = "error"
            responseAPI.data = null
            return res.status(404).json(responseAPI);
        }
        responseAPI.msg = "Usuarios encontrados correctamente"
        responseAPI.count = users.length;
        responseAPI.data = users;
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const userLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Buscar usuario por username
        const user = await User.findOne({ username });
        // Si no existe el user manda error 404.
        if (!user) {
            responseAPI.msg = "Usuario no encontrado.";
            responseAPI.count = 0;
            responseAPI.status = "error";
            responseAPI.data = null;
            return res.status(404).json(responseAPI);
        }

        // Comparar contraseña en texto plano con el hash almacenado
        const isPasswordValid = await bcrypt.compare(password, user.password);
        // Si las contraseñas no coinciden
        if (!isPasswordValid) {
            responseAPI.msg = "Contraseña incorrecta.";
            responseAPI.count = 0;
            responseAPI.status = "error";
            responseAPI.data = null;
            return res.status(401).json(responseAPI);
        }
        // Crear JWT token. Justo despues de compara contraseñas y antes de enviar los datos. 
        // Recibe 3 datos: jwt.sign({datosRelevantes}, LaContraseñaJWTdel.env, expiración );
        const token = jwt.sign({username:username}, JWT_SECRET, {expiresIn: "24h"});
        responseAPI.msg = "Login exitoso.";
        responseAPI.count = 1;
        responseAPI.data = { name: user.name, username: user.username, token};
        res.status(200).json(responseAPI);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const createUser = async (req, res ,next) => {
    try {
        const { name, username, password, street, city, cp } = req.body;
        // Antes de crear el nuevo usuario Hashear con bcrypt
        // HashedPass = await bcrypt.hash("contraseñaParaHashear", rondasAlgoritmoAEjecutar)
        // NUNCA se debe guardar la contraseña del usuario en la base de datos. 
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({name, 
                                    username, 
                                    password:hashedPassword, 
                                    street, city, cp});
        await newUser.save();
        responseAPI.msg = "Usuario registrado correctamente"
        responseAPI.count = 1;
        responseAPI.data = newUser;
        // *** PRUEBAS SOLO ***
        // Esto es solo para pruebas, quitarlo a la hora de que todas las pruebas funcionen bien. 
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};