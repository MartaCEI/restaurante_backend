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
        responseAPI.status = "ok"
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
        responseAPI.status = "ok"
        responseAPI.data = { name: user.name, username: user.username, admin: user.isAdmin || false, token};
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
        responseAPI.status = "ok"
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, username, street, city, cp, isAdmin } = req.body;

        // Actualiza todos los campos mandados por el front
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name:name, username:username, street:street, city:city, cp:cp, isAdmin:isAdmin },
            { new: true }
        );

        if (!updatedUser) {
            responseAPI.msg = `Plato con id ${id} no encontrado`;
            responseAPI.status = "error";
            return res.status(404).json(responseAPI);
        }
        responseAPI.msg = "Plato actualizado con éxito";
        responseAPI.status = "ok"
        responseAPI.data = updatedUser;
        responseAPI.count = 1;
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// updateUserdeletedAt(id) Este va a ser un soft delete 
export const updateUserdeletedAt = async (req, res, next) => {
    try {
        const { id } = req.params;
        const date = new Date();
        const deletedUser = await User.findByIdAndUpdate(
            id,           // id del correo que queremos update
            { deletedAt: date },    // las variables que queremos cambiar
            { new: true }         // Devuelve el documento modificado
        );
        if (!deletedUser) {
            responseAPI.msg = `Plato con id ${id} no encontrado`;
            responseAPI.count = 0;
            responseAPI.status = "error";
            responseAPI.data = null;
            res.status(404).json(responseAPI);
        }
        responseAPI.msg = `Plato con id ${id} soft deleted`;
        responseAPI.count = 1;
        responseAPI.data = deletedUser;
        responseAPI.status = "ok"
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

// deleteUserPermanently(id). No se recomendable pero es parte del CRUD. 
// Elimina un documento entero de la BBDD.
export const deleteUserPermanently = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id)
        if (!deletedUser) {
            responseAPI.msg = `Plato con id ${id} no encontrado`;
            responseAPI.count = 0;
            responseAPI.data = null;
            return res.status(404).json(responseAPI);
        }
        responseAPI.msg = "Plato eliminado correctamente";
        responseAPI.count = 1;
        responseAPI.status = "ok"
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// getUserById(id) Obtiene el plato que se manda desde el body con el id. 
export const getUserById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        if (!user) {
            responseAPI.msg = "Plato no encontrado";
            responseAPI.count = 0;
            responseAPI.status = "error";
            responseAPI.data = null;
            res.status(404).json(responseAPI);
        }
        responseAPI.msg = "Plato encontrado con éxito";
        responseAPI.count = 1;
        responseAPI.data = user;
        responseAPI.status = "ok"
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};