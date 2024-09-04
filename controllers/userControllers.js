// backend/controllers/userTwoController.js
import Users from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = 'your_jwt_secret_key';

// Register user
const registerUser = async (req, res) => {
    try {
        const { name, email, phone, address, city, pin, password } = req.body;
        const user = new Users({ name, email, phone, address, city, pin, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user: { name: user.name, email: user.email, phone: user.phone, address: user.address, city: user.city, pin: user.pin } });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Error logging in user' });
    }
};

// Get user info
const getUser = async (req, res) => {
    res.status(200).json(req.user);
};

export { registerUser, loginUser, getUser };
