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

// https://picsum.photos/200

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
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// getDishById(id) Obtiene el plato que se manda desde el body con el id. 
export const getDishById = async (req, res, next) => {
    try {
        const id = req.params.id;
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
        const type = req.params.type;
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
        responseAPI.data = dish;
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
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// updateDish(id) Este va a ser un soft delete 
export const updateDishdeletedAt = async (req, res, next) => {
    try {
        const { id } = req.params.id;
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
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

// updateDishField (id, campo, valor) Cambia todos los valores del plato segun su id.
// Recibe del front el campo (type, name, description...) y el nuevo valor. 
// key: value
export const updateDishField = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { key, value } = req.body;

        // Validación básica
        if (!id || !key || value === undefined) {
            responseAPI.msg = "Faltan datos para actualizar el plato";
            responseAPI.status = "error";
            return res.status(400).json(responseAPI);
        }

        // Crear objeto dinámico para actualizar
        // [campo] = valor crea un objeto donde la clave es el valor de la variable campo, no la palabra "campo".
        // Esto permite actualizar cualquier campo que venga desde req.body.
        // Actualización en la base de datos
        const updatedDish = await Menu.findByIdAndUpdate(
            id,
            { [key]: value },
            { new: true }
        );

        if (!updatedDish) {
            responseAPI.msg = `Plato con id ${id} no encontrado`;
            responseAPI.status = "error";
            return res.status(404).json(responseAPI);
        }
        responseAPI.msg = "Plato actualizado con éxito";
        responseAPI.status = "success";
        responseAPI.data = updatedDish;
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
        const { id } = req.params.id;
        const deletedDish = await Menu.findByIdAndDelete(id)
        if (!deletedDish) {
            responseAPI.msg = `Plato con id ${id} no encontrado`;
            responseAPI.count = 0;
            responseAPI.data = null;
            return res.status(404).json(responseAPI);
        }
        responseAPI.msg = "PLato eliminado correctamente";
        responseAPI.count = 1;
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};





