// backend/routes/userTwoRoutes.js
import express from 'express'; 
import authTwoMiddleware from '../middlewares/authTwoMiddleware.js';
import { getUser, loginUser, registerUser } from '../controllers/userControllers.js';

const router = express.Router();

router.post('/registeruser', registerUser);
router.post('/loginuser', loginUser);
router.get('/userdata', authTwoMiddleware, getUser);


export default router;
