//if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config(); //don't use spaces and "" in .env file
    //it's looking for .env file so don't change the file name keep it .env
//}
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
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/review');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/users');
const profileRoutes = require('./routes/profile');
const mongoSanitize = require('express-mongo-sanitize');
const { contentSecurityPolicy } = require('helmet');

const MongoStore = require('connect-mongo');  //This helps us to store our session information in the mongo database
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
//contentSecurityPolicy this allows us to specify like only images from unsplash will be allowed to work it lets us define which resources are to be
//used for our web-application like we are only allowed to use fonts from google fonts, etc.,

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
app.use(express.static(path.join(__dirname, 'public'))); //the scripts directly go in the public folder

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeasecret!'
    }
});

store.on("error", function(e) {
    console.log("Session Store Error" + e);
})
const sessionConfig = {
    store,
    name: 'session',  //instead of connect.sid as hackers will look for the default name obviously
    secret: 'thisshouldbeasecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, //is already default not required
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //1 week in milliseconds
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig)); //app.use(session(sessionConfig)); should be before app.use(passport.session());
app.use(flash()); //just to make app more secure

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/"    //We define all this
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/"
];
const connectSrcUrls = [
    "https://api.maptiler.com/"
];
const fontSrcUrls = [];
//look in helmet docs for this app.use
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
                "https://images.unsplash.com/",
                "https://api.maptiler.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

//lines of code to use passport
app.use(passport.initialize()); //in the docs
app.use(passport.session());
app.use(mongoSanitize());  //just removes $ and other symbols from the query string
//In the query string that a user enters we can pass a script tag which will alter the website and run the script which could be used to exploit
//information out of my site
//for example <script>alert("Hello, world!");</script> in the query string runs an alert which user should not be capable of
//mainly if we enter h1 or something it won't run because ejs syntax <%= escapes Html but script tags still run
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    //It contains the id, username and the email of the user
    res.locals.currentUser = req.user; //this will be available in all routes as long as user is logged in
    //req.user stores information of the user passport gives us this functionality, it contains deserialized information of the user
    //session has serialized information of the user
    //if a user is not logged in it contains undefined
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'abcd@gmail.com', username: 'abcd' });
    const newUser = await User.register(user, 'chicken'); //it takes the user and then stores the hashed password in the database
    //this does not use bcrypt it uses PBKD2 as it is platform independent
    res.send(newUser);
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/profile', profileRoutes);

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => { //will only run if anything above has not run to catch errors for a page that does not exist
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => { //***** We don't use ExpressError here ExpressError just defines statuscode and message and nothing else *****//
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong'
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log("In Port 3000")
})