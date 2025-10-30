import { Menu } from "../data/mongobd.js";
import connectDB from "../data/mongobd.js";
// Conexión a la BBDD
connectDB();

const responseAPI = {
    data: null,
    msg: "",
    count: 0,
    status: "ok"
};

// getAllDishes()  Obtiene todos los platos del menuSchema
export const getAllDishes = async (req, res, next) => {
    try {
        const dishes = await Menu.find();
        if (dishes.length === 0) {
            responseAPI.msg = "No se han encontrado platos en el Menú";
            responseAPI.count = 0;
            responseAPI.status = "error";
            responseAPI.data = null;
            res.status(404).json(responseAPI);
        }
        responseAPI.msg = "Platos del menú recibidos con éxito";
        responseAPI.count = dishes.length;
        responseAPI.data = dishes;
        responseAPI.status = "ok"
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// getDishById(id) Obtiene el plato que se manda desde el body con el id. 
export const getDishById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const dish = await Menu.findById(id);
        if (!dish) {
            responseAPI.msg = "Plato no encontrado";
            responseAPI.count = 0;
            responseAPI.status = "error";
            responseAPI.data = null;
            res.status(404).json(responseAPI);
        }
        responseAPI.msg = "Plato encontrado con éxito";
        responseAPI.count = 1;
        responseAPI.data = dish;
        responseAPI.status = "ok"
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// getDishesByType(type) Obtiene todos los platos segun el tipo. 
// Esta funcion es perfecta para filtrar por tipo de plato. 
export const getDishesByType = async (req, res, next) => {
    try {
        const { type } = req.params;
        const dishes = await Menu.find({
            type: { $regex: type, $options: "i" }
        });

        if (dishes.length === 0) {
            responseAPI.msg = `No hay nungun plato de tipo ${type}`;
            responseAPI.count = 0;
            responseAPI.status = "error";
            responseAPI.data = null;
            res.status(404).json(responseAPI);
        }
        responseAPI.msg = "Plato encontrado con éxito";
        responseAPI.count = 1;
        responseAPI.data = dishes;
        responseAPI.status = "ok"
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// createDish(dishData) Crea un nuevo plato. 
export const createDish = async (req, res, next) => {
    try {
        const { type, name, description, price, imageUrl } = req.body;
        const newDish = new Menu({
            type,
            name,
            description,
            price,
            imageUrl
        })
        await newDish.save();
        responseAPI.msg = "Plato creado correctamente";
        responseAPI.count = 1;
        responseAPI.data = newDish;
        responseAPI.status = "ok"
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// updateDish(id) Este va a ser un soft delete 
export const softDeleteDish = async (req, res, next) => {
    try {
        const { id } = req.params;
        const date = new Date();
        const deletedDish = await Menu.findByIdAndUpdate(
            id,           // id del correo que queremos update
            { deletedAt: date },    // las variables que queremos cambiar
            { new: true }         // Devuelve el documento modificado
        );
        if (!deletedDish) {
            responseAPI.msg = `Plato con id ${id} no encontrado`;
            responseAPI.count = 0;
            responseAPI.status = "error";
            responseAPI.data = null;
            res.status(404).json(responseAPI);
        }
        responseAPI.msg = `Plato con id ${id} soft deleted`;
        responseAPI.count = 1;
        responseAPI.data = deletedDish;
        responseAPI.status = "ok"
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const updateDish = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, price, description, type, imageUrl } = req.body;

        // Actualiza todos los campos mandados por el front
        const updatedDish = await Menu.findByIdAndUpdate(
            id,
            { name:name, price:price, description:description, type:type, imageUrl:imageUrl },
            { new: true }
        );

        if (!updatedDish) {
            responseAPI.msg = `Plato con id ${id} no encontrado`;
            responseAPI.status = "error";
            return res.status(404).json(responseAPI);
        }
        responseAPI.msg = "Plato actualizado con éxito";
        responseAPI.status = "ok"
        responseAPI.data = updatedDish;
        responseAPI.count = 1;
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// deleteDish(id). No se recomendable pero es parte del CRUD. 
// Elimina un documento entero de la BBDD.
export const deleteDish = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedDish = await Menu.findByIdAndDelete(id)
        if (!deletedDish) {
            responseAPI.msg = `Plato con id ${id} no encontrado`;
            responseAPI.count = 0;
            responseAPI.data = null;
            return res.status(404).json(responseAPI);
        }
        responseAPI.msg = "PLato eliminado correctamente";
        responseAPI.count = 1;
        responseAPI.status = "ok"
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};





