const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateProduct } = require('../middleware'); // Changed to validateProduct
const products = require('../controllers/products'); // Updated to products controller
const multer = require('multer');
const { storage } = require('../cloudinary'); // Storage configuration for image uploads
const upload = multer({ storage });

// Route for listing all products and creating a new product
router.route('/')
    .get(catchAsync(products.index)) // List all products
    .post(isLoggedIn, upload.array('image'), validateProduct, catchAsync(products.createProduct)); // Create a new product

// Route for rendering the new product form
router.get('/new', isLoggedIn, products.renderNewForm); // Display form to create a new product

// Routes for individual product operations (show, edit, update, delete)
router.route('/:id')
    .get(catchAsync(products.showProduct)) // Show details of a single product
    .put(isLoggedIn, isAuthor, upload.array('image'), validateProduct, catchAsync(products.updateProduct)) // Update product details
    .delete(isLoggedIn, isAuthor, catchAsync(products.deleteProduct)); // Delete a product

router.post('/:id/addToCart', isLoggedIn, products.addToCart);

// Route for rendering the edit product form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(products.renderEditForm));

module.exports = router;
