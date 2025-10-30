import { Router } from "express";
import {  userLogin, createUser } from '../controllers/user.controller.js'
import { authenticateToken as authMiddleware } from '../middlewares/auth.js'
import { getAllDishes, createDish, softDeleteDish, updateDish, deleteDish } from "../controllers/menu.controller.js";
import { getAllUsers, updateUser, deleteUserPermanently, getUserById } from "../controllers/user.controller.js";
import { getDishesByType, getDishById } from "../controllers/menu.controller.js";
import { getAllEvents, getEventById, createEvent, updateEvent, softDeleteEvent } from "../controllers/events.controller.js"
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

export default router;