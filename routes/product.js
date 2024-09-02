 
import express from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'; // Correct import for Cloudinary v2
import { CloudinaryStorage } from 'multer-storage-cloudinary'; // Correct import for CloudinaryStorage
import { Product } from "../models/user.model.js";
 

const router = express.Router(); 

let CLOUDINARY_CLOUD_NAME='dkornixrz'

let CLOUDINARY_API_KEY='182927986386847'
let CLOUDINARY_API_SECRET='ErO4dtqR8iKRPHR_Xxi_wnawWEQ'


// Cloudinary configuration
cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,

 
});

// Multer setup for Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'product_images',
        format: async (req, file) => 'jpeg', // supports promises as well
        public_id: (req, file) => Date.now() + '-' + file.originalname,
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB file size limit
});

 
const checkImageCount = (req, res, next) => {
    if (req.files.length > 5) {
        return res.status(400).json({ error: 'You can upload a maximum of 5 images at a time.' });
    }
    next();
};

// Create a product
router.post('/', upload.array('images', 5), checkImageCount, async (req, res) => {
    const { name, description, price, category } = req.body;
    const images = req.files.map(file => file.path);

    try {
        const newProduct = new Product({
            name,
            description,
            price,
            category,
            images  
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// // Fetch all products
// router.get('/', async (req, res) => {
//     try {
//         const products = await Product.find();
//         res.status(200).json(products);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// Fetch all products or products by category
router.get('/', async (req, res) => {
    const category = req.query.category;
    try {
        let products;
        if (category) {
            products = await Product.find({ category });
        } else {
            products = await Product.find();
        }
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Fetch a single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// delete a product with id 

// Delete a product by ID
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

