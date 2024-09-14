const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users');

router.use(express.urlencoded({ extended: true }));

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(storeReturnTo, users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

//passport gives us a middleware function to be passed
//storeReturnTo must be called before passport.authenticate to store the req.session.returnTo to res.locals
//middleware runs between req and res and after response the session is cleared thus we store it in res.locals and then 
//res.locals.returnTo is overwritten every time a new value is stored

router.get('/cart', users.showCart);

router.get('/logout', users.logout);

module.exports = router;