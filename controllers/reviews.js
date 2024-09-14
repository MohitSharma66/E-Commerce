const Review = require('../models/review');
const User = require('../models/user');
const Product = require('../models/Product'); // Updated from Campground to Product

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const review = new Review(req.body.review);
    review.author = req.user._id;
    const product = await Product.findById(id); // Changed from Campground to Product
    product.reviews.push(review); // Push review to the product's reviews array
    review.product = id; // Associate review with product
    await review.save();
    await product.save();
    const user = await User.findById(req.user._id);
    user.reviews.push(review._id);
    await user.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/products/${id}`); // Updated redirect to /products
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove review reference from the product
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/products/${id}`); // Updated redirect to /products
}
