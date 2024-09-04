// // middlewares/authMiddleware.js
// import jwt from 'jsonwebtoken'; 
// import Rider from '../models/RiderModel.js';

// const JWT_SECRET = '123456789KARANPANDEY'; // Make sure this is the same secret key used for signing

// const authMiddleware = async (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//         return res.status(401).json({ message: 'No token provided' });
//     }

//     try {
//         const decoded = jwt.verify(token, JWT_SECRET);
//         const user = await Rider.findById(decoded.userId).select('-password'); // Exclude password from user data
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         console.error('Token verification failed:', error.message);
//         res.status(401).json({ message: 'Invalid token' });
//     }
// };

// export default authMiddleware;


// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken'; 
import Rider from '../models/RiderModel.js';

const JWT_SECRET = '123456789KARANPANDEY'; // Make sure this is the same secret key used for signing

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await Rider.findById(decoded.userId).select('-password'); // Exclude password from user data
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;