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

// Fetch all users
export const getUsers = async (req, res) => {
    try {
      const users = await Users.find();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  };
  
  // Delete a user
  export const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      await Users.findByIdAndDelete(id);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Error deleting user' });
    }
  };
  
  // Update a user
  export const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedUser = await Users.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Error updating user' });
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
