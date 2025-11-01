import { Event } from "../data/mongobd.js";
import connectDB from "../data/mongobd.js";

// Conexión a la BBDD
connectDB();

const responseAPI = {
    data: null,
    msg: "",
    count: 0,
    status: "ok"
};

// getAllEvents()  Obtiene todos los eventos
export const getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find();
        if (events.length === 0) {
            responseAPI.msg = "No se han encontrado eventos";
            responseAPI.count = 0;
            responseAPI.status = "error";
            responseAPI.data = null;
            return res.status(404).json(responseAPI);
        }
        responseAPI.msg = "Eventos obtenidos con éxito";
        responseAPI.count = events.length;
        responseAPI.data = events;
        responseAPI.status = "ok";
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// getEventById(id) Obtiene un evento por su id
export const getEventById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        if (!event) {
            responseAPI.msg = "Evento no encontrado";
            responseAPI.count = 0;
            responseAPI.status = "error";
            responseAPI.data = null;
            return res.status(404).json(responseAPI);
        }
        responseAPI.msg = "Evento encontrado con éxito";
        responseAPI.count = 1;
        responseAPI.data = event;
        responseAPI.status = "ok";
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// createEvent(eventData) Crea un nuevo evento
export const createEvent = async (req, res, next) => {
    try {
        const { title, description, date, time } = req.body;
        const newEvent = new Event({
            title,
            description,
            date,
            time,
            imagen: "https://img.freepik.com/vector-gratis/concepto-feliz-cumpleanos_23-2148484501.jpg"
        });
        await newEvent.save();

        responseAPI.msg = "Evento creado correctamente";
        responseAPI.count = 1;
        responseAPI.data = newEvent;
        responseAPI.status = "ok";
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// softDeleteEvent(id) Marca un evento como eliminado (soft delete)
export const softDeleteEvent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const date = new Date();
        const deletedEvent = await Event.findByIdAndUpdate(
            id,
            { deletedAt: date },
            { new: true }
        );

        if (!deletedEvent) {
            responseAPI.msg = `Evento con id ${id} no encontrado`;
            responseAPI.count = 0;
            responseAPI.status = "error";
            responseAPI.data = null;
            return res.status(404).json(responseAPI);
        }

        responseAPI.msg = `Evento con id ${id} marcado como eliminado`;
        responseAPI.count = 1;
        responseAPI.data = deletedEvent;
        responseAPI.status = "ok";
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// updateEvent(id) Actualiza un evento existente
export const updateEvent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, date, time, img } = req.body;

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { title, description, date, time, img },
            { new: true }
        );

        if (!updatedEvent) {
            responseAPI.msg = `Evento con id ${id} no encontrado`;
            responseAPI.status = "error";
            return res.status(404).json(responseAPI);
        }

        responseAPI.msg = "Evento actualizado con éxito";
        responseAPI.status = "ok";
        responseAPI.data = updatedEvent;
        responseAPI.count = 1;
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};
