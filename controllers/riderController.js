 
// import Rider from '../models/RiderModel.js';
// import multer from 'multer';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

// // Setup multer storage
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Secret key for JWT
// const JWT_SECRET = '123456789KARANPANDEY';

// // Register user function
// const registerRider = async (req, res) => {
//   try {
//     const user = new Rider({
//       ...req.body,
//       marksheet: req.files['marksheet'] ? req.files['marksheet'][0].buffer : null,
//       image: req.files['image'] ? req.files['image'][0].buffer : null,
//       checkBook: req.files['checkBook'] ? req.files['checkBook'][0].buffer : null,
//     });

//     await user.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error('Error registering user:', error);
//     res.status(500).json({ message: 'Error registering user' });
//   }
// };

// // Login user function
 
// // Login user function
// const loginRider = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//       const user = await Rider.findOne({ email });
//       if (!user) {
//           return res.status(400).json({ message: 'Invalid email or password' });
//       }

//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//           return res.status(400).json({ message: 'Invalid email or password' });
//       }

//       // Create JWT token
//       const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
//       res.status(200).json({ token, user: { name: user.name, email: user.email, phone: user.phone } });
//   } catch (error) {
//       console.error('Error logging in user:', error);
//       res.status(500).json({ message: 'Error logging in user' });
//   }
// };


// export { registerRider, loginRider, upload };


 
import Rider from '../models/RiderModel.js';
import multer from 'multer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Setup multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Secret key for JWT
const JWT_SECRET = '123456789KARANPANDEY';

// Register user function
const registerRider = async (req, res) => {
  try {
    const user = new Rider({
      ...req.body,
      marksheet: req.files['marksheet'] ? req.files['marksheet'][0].buffer : null,
      image: req.files['image'] ? req.files['image'][0].buffer : null,
      checkBook: req.files['checkBook'] ? req.files['checkBook'][0].buffer : null,
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Login user function
 
// Login user function
const loginRider = async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await Rider.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Create JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token, user: { name: user.name, email: user.email, phone: user.phone } });
  } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ message: 'Error logging in user' });
  }
};

export { registerRider, loginRider, upload };