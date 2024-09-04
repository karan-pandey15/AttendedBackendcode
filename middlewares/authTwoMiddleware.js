// backend/middlewares/authTwoMiddleware.js
import jwt from 'jsonwebtoken'; 
import Users from '../models/userModel.js';

const JWT_SECRET = 'your_jwt_secret_key';

const authTwoMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await Users.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default authTwoMiddleware;
