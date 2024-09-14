const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product: { //not an array a particulart review can only be associated with one campground
        type: Schema.Types.ObjectId, //Please make sure to push campground after creating a review
        ref: 'Product'
    }
})

module.exports = mongoose.model('Review', reviewSchema);