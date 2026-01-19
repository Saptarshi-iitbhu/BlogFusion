const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blog_images',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
    },
});

const upload = multer({ storage: storage });

// Upload Endpoint
router.post('/', upload.single('file'), (req, res) => {
    try {
        // req.file.path contains the URL of the uploaded image on Cloudinary
        res.status(200).json(req.file.path);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router;
