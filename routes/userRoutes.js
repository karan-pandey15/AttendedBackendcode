// backend/routes/userTwoRoutes.js
import express from 'express'; 
import authTwoMiddleware from '../middlewares/authTwoMiddleware.js';
import { deleteUser, getUser, getUsers, loginUser, registerUser, updateUser } from '../controllers/userControllers.js';

const router = express.Router();

router.post('/registeruser', registerUser);
router.post('/loginuser', loginUser);
router.get('/userdata', authTwoMiddleware, getUser); 
router.get('/userdatas', getUsers);
router.delete('/userdatas/:id', deleteUser);
router.put('/userdatas/:id', updateUser);

export default router;
