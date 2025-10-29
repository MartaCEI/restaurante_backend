import { Router } from "express";
import { getAllUsers, userLogin, createUser } from '../controllers/user.controller.js'
import { authenticateToken as authMiddleware } from '../middlewares/auth.js'
import { getAllDishes, getDishById, getDishesByType, createDish, updateDishdeletedAt, updateDishField, deleteDish } from "../controllers/menu.controller.js";
const router = Router();

// Rutas especiales
router.post('/register', createUser);
router.post('/login', userLogin);

// Rutas users
router.get('/admin/users', authMiddleware, getAllUsers); // getAllUsers()


// Rutas de menu(dishes)
router.get('/admin/dishes',authMiddleware, getAllDishes) // getAllDishes()
router.get('/dishes/type/:type', getDishesByType); // getDishesByType(type)
router.get('/dishes/id/:id', getDishById); // getDishById(id)
router.post('admin/dishes', authMiddleware, createDish) // createDish(dishData)
router.patch('/dishes/deletedAt/:id', authMiddleware, updateDishdeletedAt) // updateDish(id)
router.patch('/dishes/updateField/:id', authMiddleware, updateDishField) // updateDishField(id), (key, value)
router.delete('/dishes', authMiddleware, deleteDish) // deleteDish(id)

export default router;