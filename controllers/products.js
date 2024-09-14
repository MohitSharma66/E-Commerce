const Product = require('../models/Product');
const User = require('../models/user');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const products = await Product.find({});
    res.render('products/index', { products });
}

module.exports.renderNewForm = (req, res) => {
    res.render('products/new');
}

module.exports.createProduct = async (req, res) => {
    const product = new Product(req.body.product);
    product.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    product.author = req.user._id;
    await product.save();
    const user = await User.findById(req.user._id);
    user.products.push(product._id);
    await user.save();
    req.flash('success', 'Successfully added a new product!');
    res.redirect(`/products/${product._id}`);
}

module.exports.showProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!product) {
        req.flash('error', 'Product not found!');
        return res.redirect('/products');
    }
    res.render('products/show', { product });
}

module.exports.addToCart = async (req, res) => {
    const { id } = req.params; // Product ID
    const user = await User.findById(req.user._id); // Fetch the user

    if (!user) {
        req.flash('error', 'User not found!');
        return res.redirect('/products');
    }

    // Add product to user's cart if not already there
    if (!user.cart.includes(id)) {
        user.cart.push(id);
        await user.save();
        req.flash('success', 'Product added to cart!');
    } else {
        req.flash('info', 'Product is already in your cart.');
    }

    res.redirect(`/products/${id}`);
}

module.exports.showCart = async (req, res) => {
    const user = await User.findById(req.user._id).populate('cart'); // Populate cart with product data

    if (!user) {
        req.flash('error', 'User not found!');
        return res.redirect('/');
    }
    res.render('cart/show', { products: user.cart });
}


module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        req.flash('error', 'Product not found!');
        return res.redirect('/products');
    }
    res.render('products/edit', { product });
}

module.exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product }, { new: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    product.images.push(...imgs);
    await product.save();

    if (req.body.deleteImages && req.body.deleteImages.length > 0) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename); 
        }
        await product.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }

    req.flash('success', 'Successfully updated product!');
    res.redirect(`/products/${product._id}`);
}

module.exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted product!');
    res.redirect('/products');
}
