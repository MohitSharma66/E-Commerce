const { productSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Product = require('./models/Product'); // Updated to Product
const { reviewSchema } = require('./schemas');
const Review = require('./models/review');

// Store the returnTo URL in the locals for redirecting after login
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

// Check if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You Must Be Signed In!');
        return res.redirect('/login');
    }
    next();
}

// Validate the product data
module.exports.validateProduct = (req, res, next) => { 
    const { error } = productSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
}

// Check if the user is the author of the product
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        req.flash('error', 'Product not found!');
        return res.redirect('/products'); // Updated to products
    }
    if (!product.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/products/${id}`); // Updated to products
    }
    next();
}

// Validate review data
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
}

// Check if the user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/products/${id}`); // Updated to products
    }
    next();
}
