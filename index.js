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
// Middleware para manejo de errores. Nos va a servir para capturar errores en TODOS los controladores o en otros middlewares.
//  Siempre teniendo en cuenta la estructura de nuestra respuesrta:
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
    // Este mensaje llega de los errores forzados de los controladores:
    // const error = new Error('Id del email no encontrado')
    // error.statusCode = 404;
    responseAPI.msg = err.message ?? "Error interno del servidor";
    res.status(500).json(responseAPI);
});

// -------------- RUTA RAIZ --------------
app.get("/", (req, res) => {
    res.setHeader("Content-type", "text/html");
    const appCorreos = `<h1>Buenvenido a mi API de correos usando MongoDB</h1>
    <a href="https://restaurante-backend-pink.vercel.app/api/v1/events">Eventos</a>`;
    res.send(appCorreos);
})

// -------------- INICIAR SERVIDOR --------------
app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${DOMAIN}:${PORT}`)
});