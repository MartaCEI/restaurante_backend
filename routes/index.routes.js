import { Router } from "express";
import { getAllUsers, userLogin, createUser } from '../controllers/user.controller.js'
import { authenticateToken as authMiddleware } from '../middlewares/auth.js'
const router = Router();

// Rutas de users
router.post('/register', createUser);
router.post('/login', userLogin);

// Rutas protegidas de admin
router.get('/admin/users', authMiddleware, getAllUsers);
// router.get('/admin/menu', authMiddleware, getAllUsers);

export default router;