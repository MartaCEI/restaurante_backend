# 1ª Fase del Backend del Proyecto Restaurante
En esta primera fase del backend crearemos la estructura básica del servidor con Express y MongoDB. Implementaremos la funcionalidad de autenticación de usuarios del modelo 'User' utilizando Bcrypt para el hash de contraseñas y JsonWebToken para la generación de tokens JWT. Además, estableceremos rutas protegidas mediante un middleware de autenticación.

## Lista de tareas backend
Nuestro Back tendrá una API Rest con rutas para Auth y Usuarios. También poseerá un middleware para proteger rutas privadas.

- [x] Crear Back con Express y dependencias (cors, nodemon, dotenv, mongoose)
- [x] Instalar dependencias de Auth y upload (bcrypt, jsonwebtoken, multer)
- [x] Cambiar package.json (type module, scripts start y dev)
- [x] Crear la estructura de carpetas (controllers, routes, models, middlewares, .env)
- [x] Crear variables de entorno
- [x] Configurar .gitignore
- [x] Configurar la conexión a MongoDB en data/mongodb.js y su modelo User.
- [x] Archivo de config.js
- [x] Crear el archivo index.js
- [x] Página de inicio del backend
- [x] Crear archivo de rutas index.routes.js (rutas más ordenadas)
- [x] Crear controladores para las rutas (usuarios.controller.js)
- [x] Hash con Bcrypt y JWT con JsonWebToken en el Auth
- [x] Crear middleware auth.js para proteger rutas privadas
- [x] Crear una ruta protegida (/admin)
- [x] Testing con thunderclient
- [x] Update del frontend para usar el token JWT en zonas privadas.
- [x] Upload de Archivos (Multer)

1. Crear Back con Express y dependencias.
```bash
npm init -y
npm i express mongoose dotenv cors
npm i nodemon -D
npm i bcrypt jsonwebtoken multer
```

2. Cambiar el package.json
```json
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
    },
```

3. Crear estructura de carpetas
```
/restaurante_backend
    /config
        config.js
    /controllers
        userController.js
        (2ª Fase)
    /data
        mockData.js  // Copia archivos de bd.
        mongodb.js
    /routes
        index.routes.js
    /utils
        utils.js
    /middlewares
        auth.js
        /multer.js
    index.js
    .env
    .env.example
    .env.production
    .gitignore
    package.json
    README.md
```

4. Configurar el .env 
En atlas cogemos del driver de mongoose la cadena de conexión y la pegamos en el .env (como está en el .gitignore, no se subirá a github). Ponemos un ejemplo de nuestra varibles de entorno en el archivo .env.example.

```js .env.example
// Puerto y dominio del backend
PORT=3000
DOMAIN="http://localhost"
// Datos de MongoDB
MONGODB_URI="mongodb+srv://USER:PASS@CLUSTER.mongodb.net/DB_NAME/?retryWrites=true&w=majority"
// JWT Secret Key
JWT_SECRET="your_jwt_secret_key"
```

5. Configurar el .gitignore
```js
// local env files y node_modules
node_modules
.env
.env.production
```

6. Configurar el config.js
```js config/config.js
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
```

7. Configurara la BBDD en data/mongodb.js y su modelo User.
NOTA: Al hacer los modelos, mongoose va a generarlos en la BBDD automaticamente. Si yo le pongo User, me la va crear como users (plural y en minusculas) si no existen. 
User -> users
Menu -> menus
```js data/mongodb.js
import mongoose from 'mongoose'
import { mongodbUri } from '../config/config'

// Crear una conexion con un try catch. 
const connectDB = async () => {
    try {
        await mongoose.connect(mongodbUri);
        console.log("Conectado a la base de datos de MongoDB");
    } catch (error) {
        console.log("Error conectando a MongoDB", error.message);
        process.exit(1);
    }
}

// Crear nuestro `SQUEMAS` llamado variableSchema = new mongoose.Schema({...})
// Ejemplo de nestedSchema: 
const addressSchema = new mongoose.Schema({
    calle: String,
    numero: String,
    piso: String,
    ciudad: String,
    codigoPostal: String
})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    // address: addressSchema,
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    deletedAt: {
        type: String,
        default: null
    }
}, 
{
    timestamps: true,   // createdAt, updatedAt
    strict: false,      // Permite guardar campos no definidos en el esquema
    versionKey: false   // Desactiva el campo __v
})

// Exportar el modelo
export const User = mongoose.model('User', userSchema);
export default connectDB;
```

8. Configurar el index.js
```js index.js
import express from 'express'
import cors from 'cors'
import { PORT, DOMAIN } from './config/config.js'
import indexRoutes from './routes/index.routes.js'
import path from 'path'
import { __dirname } from './config/config.js';

// -------------- Servidor express --------------
const app = express();

// -------------- Middlewares --------------
app.use(cors());
// Leer datos json del body
app.use(express.json());
// Leer formularios del body
app.use(express.urlencoded({ extended: true }));
// Leer archivo public
app.use(express.static(path.join(__dirname, "public")));

// -------------- Rutas API --------------
app.use("/api/v1/", indexRoutes);

// -------------- MANEJO DE ERRORES --------------
// Middleware para manejo de errores. Nos va a servir para capturar errores en TODOS los controladores o en otros middlewares. Siempre teniendo en cuenta la estructura de nuestra respuesrta:
const responseAPI = {
    data: null,
    msg:"",
    count: 0,
    status: "ok"
}

// Este middleware va a controlar siempre los errores del controlador o de otros middlewares en el catch(next) de cada controlador.
app.use((err, req, res, next) => {
    console.error(err.stack);
    responseAPI.status = "error";
    // Aqui se recibe un mesaje ya enviado por el controlador, sino, escribira el de por defecto. 
    // Este mensaje llega de los errores forzados de los controladores:
    responseAPI.msg = err.message ?? "Error interno del servidor";
    res.status(500).json(responseAPI);
});

// -------------- RUTA RAIZ --------------
app.get("/", (req, res) => {
    res.setHeader("Content-type", "text/html");
    const appCorreos = `<h1>Buenvenido a mi API de correos usando MongoDB</h1>
    <a href="http://localhost:3000/api/v1/emails">Correos</a>`;
    res.send(appCorreos);
})

// -------------- INICIAR SERVIDOR --------------
app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${DOMAIN}:${PORT}`)
});
```

9. Configurar las rutas en index.routes.js
```js routes/index.routes.js
import { Router } from "express";
import { getAllUsers, userLogin, createUser } from '../controllers/user.controller.js'
const router = Router();

// Rutas de users
router.post('/register', createUser);
router.post('/login', userLogin);

// Rutas protegidas de admin
import { authenticateToken as authMiddleware } from '../middlewares/auth.js'
router.get('/admin/users', authMiddleware, getAllUsers);

export default router;
```

10. Crear controladores para las rutas (usuarios.controller.js)
```js controllers/user.controller.js
import {connectDB, User } from '../data/mongodb.js'
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
        const {username, password} = req.body;
        const userLogged = await User.findOne({ username });
        if (!userLogged) {
            responseAPI.msg = "Usuario no encontrado."
            responseAPI.count = 0;
            responseAPI.status = "error";
            responseAPI.data = null;
            res.status(404).json(responseAPI)
        }
        responseAPI.msg = "Usuario encontrado. El username y password coinciden."
        responseAPI.count = 1;
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const createUser = async (req, res ,next) => {
    try {
        const { name, username, password, email } = req.body;
        const newUser = new User({name, username, password, email});
        await newUser.save();
        responseAPI.msg = "Usuario registrado correctamente"
        responseAPI.count = 1;
        responseAPI.data = newUser;
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};
```

10. Hash con Bcrypt y JWT en userLogin y createUser.
```js controllers/user.controller.js
import bcrypt from 'bcrypt' // Importar bcrypt para hashear contraseñas
import jwt from 'jsonwebtoken' // Importar jsonwebtoken para crear tokens JWT
import {connectDB, User } from '../data/mongodb.js' // Importar el modelo User y la conexión
import { JWT_SECRET } from '../config/config.js';  // Importar la variable de entorno JWT_SECRET
// Conectamos la BBDD
connectDB();

const responseAPI = {
    data: null,
    msg: "",
    count: 0,
    status: "ok"
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
        responseAPI.status = "success";
        responseAPI.data = { username: user.username, email: user.email, isAdmin: user.isAdmin, token};
        res.status(200).json(responseAPI);

    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const createUser = async (req, res ,next) => {
    try {
        const { name, username, password, email } = req.body;
        // Antes de crear el nuevo usuario Hashear con bcrypt
        // HashedPass = await bcrypt.hash("contraseñaParaHashear", rondasAlgoritmoAEjecutar)
        // NUNCA se debe guardar la contraseña del usuario en la base de datos. 
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({name, 
                                    username, 
                                    password:hashedPassword, 
                                    email});
        await newUser.save();
        responseAPI.msg = "Usuario registrado correctamente"
        responseAPI.count = 1;
        responseAPI.data = newUser;
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};
```

11. Crear middleware auth.js que devuelve true siempre
```js middlewares/auth.js
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
        // SI la llave es correcta hacemos un next()
        next();
    })
}
```

12. Crear una ruta protegida (/admin) EJEMPLO:
```js routes/index.routes.js
import { authenticateToken } from '../middlewares/auth.js'
 // 
router.get('/admin', authenticateToken, admin);
```
```js controllers/user.controller.js
export const admin = (req, res) => {
    res.json({msg: "Bienvenido a la ruta privada de admin"})
};
```

13. Comprobar con ThunderClient las rutas protegidas.
- Hacer login y copiar el token JWT que devuelve.
- Hacer una petición GET a /admin sin token. Debería devolver 401 Unauthorized. 
- Hacer click en auth y luego en Bearer y pegar el token copiado.
- Si la llave es incorrecta debería devolver 403 Forbidden.
- Si la llave es correcta debería devolver el mensaje de bienvenida.

14. 