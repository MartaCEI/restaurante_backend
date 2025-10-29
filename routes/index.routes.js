import { Router } from "express";
import { getAllUsers, userLogin, createUser } from '../controllers/user.controller.js'
import { authenticateToken as authMiddleware } from '../middlewares/auth.js'
import { getAllDishes, getDishById, getDishesByType, createDish, updateDishdeletedAt, updateDish, deleteDish } from "../controllers/menu.controller.js";
const router = Router();

// Rutas especiales
router.post('/register', createUser);
router.post('/login', userLogin);

// Rutas users
router.get('/admin/users', authMiddleware, getAllUsers); // getAllUsers()


// Rutas de menu(dishes)
router.get('/admin/dishes',authMiddleware, getAllDishes) // getAllDishes()
router.post('/admin/dishes', authMiddleware, createDish) // createDish(dishData)
router.patch('/admin/dishes/:id', authMiddleware, updateDish) // updateDish(id, dishData)
router.delete('/admin/dishes/:id', authMiddleware, deleteDish) // deleteDish(id)
router.get('/admin/dishes/:id', authMiddleware, getDishById); // getDishById(id)
router.patch('/admin/dishes/deletedAt/:id', authMiddleware, updateDishdeletedAt) // updateDish(id)

router.get('/dishes/type/:type', getDishesByType); // getDishesByType(type)
router.get('/dishes/id/:id', getDishById); // getDishById(id)

export default router;