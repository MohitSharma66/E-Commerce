const User = require('../models/user');
const Product = require('../models/Product'); // Make sure you have this import

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = await new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => { // Passport method to log in the user after registration
            if (err) return next(err);
            req.flash('success', 'Welcome to the Product Review System!');
            res.redirect('/products'); // Updated redirect path
        })
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = res.locals.returnTo || '/products'; // Updated redirect path
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/products'); // Updated redirect path
    })
}

module.exports.showCart = async (req, res) => {
    const user = await User.findById(req.user._id).populate('cart'); // Populate cart with product data

    if (!user) {
        req.flash('error', 'User not found!');
        return res.redirect('/');
    }
    res.render('cart/show', { products: user.cart });
}
