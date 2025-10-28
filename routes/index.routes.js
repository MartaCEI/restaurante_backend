import { Router } from "express";
import { getAllUsers, userLogin, createUser } from '../controllers/user.controller.js'
import { authenticateToken as authMiddleware } from '../middlewares/auth.js'
import { getAllDishes, getDishById, getDishesByType, createDish, updateDishdeletedAt, updateDishField, deleteDish } from "../controllers/menu.controller.js";
const router = Router();

// Rutas de users
router.post('/register', createUser);
router.post('/login', userLogin);

// Rutas protegidas de admin
router.get('/admin/users', authMiddleware, getAllUsers);
// router.get('/admin/menu', authMiddleware, getAllUsers);

// Rutas de menu(dishes)
router.get('/dishes', getAllDishes) // getAllDishes()
router.get('/dishes/type/:type', getDishesByType); // getDishesByType(type)
router.get('/dishes/id/:id', getDishById); // getDishById(id)
router.post('/dishes', authMiddleware, createDish) // createDish(dishData)
router.patch('/dishes/deletedAt/:id', authMiddleware, updateDishdeletedAt) // updateDish(id)
router.patch('/dishes/updateField/:id', authMiddleware, updateDishField) // updateDishField(id), (key, value)
router.delete('/dishes', authMiddleware, deleteDish) // deleteDish(id)

export default router;