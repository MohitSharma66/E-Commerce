const User = require('../models/user');
const { cloudinary } = require('../cloudinary');

module.exports.showProfile = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id)
        .populate({
            path: 'products', // Changed from 'campgrounds' to 'products'
            populate: {
                path: 'author'
            }
        })
        .populate({
            path: 'reviews',
            populate: {
                path: 'product', // Changed from 'campground' to 'product'
                model: 'Product'
            }
        });
    res.render('profile/show', { user });
}

module.exports.editProfile = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render('profile/edit', { user });
}

module.exports.updateProfile = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, { new: true }); // `req.body` instead of `req.body.user`
    if (req.file) {
        if (user.image && user.image.filename) {
            await cloudinary.uploader.destroy(user.image.filename); // Delete the existing profile image if updating
        }
        user.image = { url: req.file.path, filename: req.file.filename }; // Update the profile image
    }
    if(user.deleteImage && user.deleteImage.filename) {
        await cloudinary.uploader.destroy(user.deleteImage.filename);
        user.deleteImage = undefined; // Remove the deleteImage field
        await user.updateOne({image: null});
    }
    await user.save();
    req.flash('success', 'Data saved successfully');
    res.redirect(`/profile/${id}`);
}
