import { Order } from "../data/mongobd.js";
import connectDB from "../data/mongobd.js";

// Conexión a BBDD
connectDB();

const responseAPI = {
    data: null,
    msg: "",
    count: 0,
    status: "ok"
};

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate("userId", "name username")
            .populate("items.menuId", "name price");

        responseAPI.msg = "Pedidos obtenidos con éxito";
        responseAPI.count = orders.length;
        responseAPI.data = orders;
        responseAPI.status = "ok";
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};


// Obtener todos los pedidos de un usuario
export const getOrdersByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId }).populate('items.menuId').populate('userId');

        if (orders.length === 0) {
            responseAPI.msg = "No se han encontrado pedidos";
            responseAPI.count = 0;
            responseAPI.status = "error";
            responseAPI.data = null;
            return res.status(404).json(responseAPI);
        }

        responseAPI.msg = "Pedidos obtenidos con éxito";
        responseAPI.count = orders.length;
        responseAPI.data = orders;
        responseAPI.status = "ok";
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Crear un pedido
export const createOrder = async (req, res, next) => {
    try {
        const { userId, items, totalPrice } = req.body;
        const newOrder = new Order({ userId, items, totalPrice });
        await newOrder.save();

        responseAPI.msg = "Pedido creado correctamente";
        responseAPI.count = 1;
        responseAPI.data = newOrder;
        responseAPI.status = "ok";
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Actualizar un pedido
export const updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { items, totalPrice, orderStatus } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { items, totalPrice, orderStatus },
            { new: true }
        );

        if (!updatedOrder) {
            responseAPI.msg = `Pedido con id ${id} no encontrado`;
            responseAPI.status = "error";
            responseAPI.count = 0;
            responseAPI.data = null;
            return res.status(404).json(responseAPI);
        }

        responseAPI.msg = "Pedido actualizado con éxito";
        responseAPI.status = "ok";
        responseAPI.data = updatedOrder;
        responseAPI.count = 1;
        res.status(200).json(responseAPI);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Soft delete de un pedido
export const deleteOrderPermanently = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(id)
        if (!deletedOrder) {
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