import { Router } from "express";
import {  userLogin, createUser } from '../controllers/user.controller.js'
import { authenticateToken as authMiddleware } from '../middlewares/auth.js'
import { getAllDishes, createDish, softDeleteDish, updateDish, deleteDish } from "../controllers/menu.controller.js";
import { getAllUsers, updateUser, deleteUserPermanently, getUserById } from "../controllers/user.controller.js";
import { getDishesByType, getDishById } from "../controllers/menu.controller.js";
import { getAllEvents, getEventById, createEvent, updateEvent, softDeleteEvent } from "../controllers/events.controller.js"
import { getAllOrders, getOrdersByUser, createOrder, updateOrder, deleteOrderPermanently} from "../controllers/orders.controller.js";
import { upload } from "../middlewares/multer.js";


const router = Router();

// Rutas especiales
router.post('/register', createUser);
router.post('/login', userLogin);

// Rutas /admin/users
router.get('/admin/users', authMiddleware, getAllUsers); // getAllUsers()
router.get('/admin/users/:id', authMiddleware, getUserById) // getUserById(id)
router.patch('/admin/users/:id', authMiddleware, updateUser); // updateUser(id)
router.delete('/admin/users/:id', authMiddleware, deleteUserPermanently); // deleteUserPermanently(id)


// Rutas /admin/dishes
router.get('/admin/dishes',authMiddleware, getAllDishes) // getAllDishes()
router.post('/admin/dishes', authMiddleware, createDish) // createDish(dishData)
router.patch('/admin/dishes/:id', authMiddleware, updateDish) // updateDish(id, dishData)
router.delete('/admin/dishes/:id', authMiddleware, deleteDish) // deleteDish(id)
router.get('/admin/dishes/:id', authMiddleware, getDishById); // getDishById(id)
router.patch('/admin/dishes/deletedAt/:id', authMiddleware, softDeleteDish) // softDeleteDish(id)

// Rutas Menu(dishes)
router.get('/dishes/type/:type', getDishesByType); // getDishesByType(type)
router.get('/dishes/id/:id', getDishById); // getDishById(id)

// Rutas /admin/events
router.get("/admin/events", authMiddleware, getAllEvents); // getAllEvents()
router.get("/admin/events/:id", authMiddleware, getEventById); // getEventById(id)
router.post("/admin/events", authMiddleware, createEvent); // createEvent(eventData)
router.patch("/admin/events/:id", authMiddleware, updateEvent); // updateEvent(id, eventData)
router.patch("/admin/events/deletedAt/:id", authMiddleware, softDeleteEvent); // softDeleteEvent(id)

// Rutas /events
router.get("/events", getAllEvents); // getEvents()

// Rutas /orders
router.post("/orders", createOrder); // createOrder()
router.get("/orders/all", getAllOrders); // getAllOrders()
router.get("/orders/:id", getOrdersByUser); // getOrdersByUser(id)
router.patch("/orders/:id", authMiddleware, updateOrder); // updateEvent(id, oderData)
router.delete("/orders/:id", authMiddleware, deleteOrderPermanently); // deleteOrderPermanently(id)

// Upload de archivos con multer
router.post('/upload', upload.single('image'), (req, res, next) => {
    try {
        res.status(200).json({
            msg: "Archivo subido correctamente",
            file: req.file,
            body: req.body,
            peso: `${Math.round(req.file.size / 1024)} Kbytes`,
            url: `${DOMAIN}${PORT}/uploads/${req.file.filename}`
        });
    } catch (e) {
        res.status(500).json({error: "Error en el servidor"})
    }
});

export default router;