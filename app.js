if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config(); //don't use spaces and "" in .env file
//     //it's looking for .env file so don't change the file name keep it .env
}

const helmet = require('helmet');
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const productRoutes = require('./routes/product'); // Updated route import
const reviewRoutes = require('./routes/review');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/users');
const profileRoutes = require('./routes/profile');
const mongoSanitize = require('express-mongo-sanitize');
const { contentSecurityPolicy } = require('helmet');

const MongoStore = require('connect-mongo');  // This helps us to store our session information in the mongo database
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/e-commerce'; // Verify if this needs to be changed

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))); // The scripts directly go in the public folder

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeasecret!'
    }
});

store.on("error", function(e) {
    console.log("Session Store Error" + e);
});

const sessionConfig = {
    store,
    name: 'session',  // Instead of connect.sid as hackers will look for the default name obviously
    secret: 'thisshouldbeasecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // Is already default not required
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week in milliseconds
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig)); // app.use(session(sessionConfig)); should be before app.use(passport.session());
app.use(flash()); // Just to make the app more secure

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net"
    // Removed Maptiler
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
    // Removed Maptiler
];
const connectSrcUrls = [];
const fontSrcUrls = [];
// Look in helmet docs for this app.use
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dbgnfh8ef/",
                "https://images.unsplash.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// Lines of code to use passport
app.use(passport.initialize()); // in the docs
app.use(passport.session());
app.use(mongoSanitize());  // Just removes $ and other symbols from the query string

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    // It contains the id, username and the email of the user
    res.locals.currentUser = req.user; // This will be available in all routes as long as user is logged in
    // req.user stores information of the user passport gives us this functionality, it contains deserialized information of the user
    // session has serialized information of the user
    // if a user is not logged in it contains undefined
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'abcd@gmail.com', username: 'abcd' });
    const newUser = await User.register(user, 'chicken'); // It takes the user and then stores the hashed password in the database
    // This does not use bcrypt it uses PBKD2 as it is platform independent
    res.send(newUser);
});

app.use('/', userRoutes);
app.use('/products', productRoutes); // Updated route
app.use('/products/:id/reviews', reviewRoutes); // Updated route
app.use('/profile', profileRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => { // Will only run if anything above has not run to catch errors for a page that does not exist
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => { // ***** We don't use ExpressError here ExpressError just defines statusCode and message and nothing else *****//
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong';
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log("In Port 3000");
});
