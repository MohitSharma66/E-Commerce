const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema; // to just shorten the code

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200'); //this will only work for images uploaded to cloudinary not the random images
})

//virtual function adds a method not directly on Schema like that is not stored in the database and Statics are used to define a method on Schema
//which is even used on Database
//We created a new ImageSchema to apply virtual on it
//we do this because we don't want to store a new modified url in the database again, we don't request them again from Cloudinary
//this defines a property known as thumbnail on images can be accesses by campground.images.thumbnail

const ProductSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } }); //we pass this toJSON true to include the virtual functions in the campground Schema
//like the location field thing we want to include properties like that

// findByIdAndDelete calls this findOneAndDelete Middleware so we use this again refer to mongoose docs
//This is a query middleware which passes doc if it finds it refer to mongoose docs
ProductSchema.post('findOneAndDelete', async function (doc) { 
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews // doc.reviews is reviews prop of campground
            }
        });
    }
});

module.exports = mongoose.model('Product', ProductSchema);
