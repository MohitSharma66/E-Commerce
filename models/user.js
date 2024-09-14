const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String
    },
    about: {
        type: String
    },
    age: Number,
    image : {
        url: String,
        filename: String
    },
    products: [
        {
            type: Schema.Types.ObjectId,  //we need to push the campgrounds into the user where new campgrounds are being created
            ref: 'Product'
        }
    ],
    cart : [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    reviews: [
        {
            type: Schema.Types.ObjectId, // same here
            ref: 'Review'
        }
    ],
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.plugin(passportLocalMongoose); //this defines a username and password field in userSchema ans allows us to use many functions
//it adds a salt field as well to the password

module.exports = mongoose.model('User', userSchema);