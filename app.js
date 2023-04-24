const express = require ('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session  = require('express-session')
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const userRoutes = require('./routes/users')
const paperRoutes = require('./routes/paper');
const seminarRoutes = require('./routes/seminar');
const webinarRoutes = require('./routes/webinar');
const suggestionRoutes = require('./routes/suggestion');
const Grid = require('gridfs-stream')
const Paper = require('./models/paper');

const MongoStore = require('connect-mongo');
const app = express();

const dbUrl = 'mongodb://localhost:27017/free';
mongoose.set('strictQuery', false);
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

var conn = mongoose.connection;
let gfs;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', ()=>{
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('upload')
    console.log("Database Connected");
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'))
 
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
    replaceWith: '_',
}))

const secret = process.env.SECRET || 'thisisasecret';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
    crypto: {
        secret,
    },
});

store.on('error', function(e){
    console.log("Session Store Error ", e);
})

const sessionConfig = {
    store,
    name: 'newSession',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
} 
app.use(session(sessionConfig))
app.use(flash());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dv5vm4sqh/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dgdbxbo79/"
];
const connectSrcUrls = [
    "https://res.cloudinary.com/dgdbxbo79/"
];
const fontSrcUrls = [ "https://res.cloudinary.com/dgdbxbo79/" ];
 
app.use(
    helmet({
        contentSecurityPolicy: {
            directives : {
                defaultSrc : [],
                connectSrc : [ "'self'", ...connectSrcUrls ],
                scriptSrc  : [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
                styleSrc   : [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
                workerSrc  : [ "'self'", "blob:" ],
                objectSrc  : [],
                imgSrc     : [
                    "'self'",
                    "blob:",
                    "data:",
                    "https://res.cloudinary.com/dgdbxbo79/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                    "https://images.unsplash.com/"
                ],
                fontSrc    : [ "'self'", ...fontSrcUrls ],
                mediaSrc   : [ "https://res.cloudinary.com/dgdbxbo79/" ],
                childSrc   : [ "blob:" ]
            }
        },
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: false,
        crossOriginResourcePolicy: false
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/papers' , paperRoutes)
app.use('/seminars' , seminarRoutes)
app.use('/webinars' , webinarRoutes)
app.use('/papers/:id/suggestion', suggestionRoutes);

app.get('/papers/:id', async(req,res)=>{
    const { id } = req.params;
    const paper = await Paper.findById(id).populate({
        path: 'suggestions',
        populate: {
            path: 'author'
        }
        }).populate('author');
    if(!paper){
        req.flash('error', 'Paper does not exist!!')
        return res.redirect('/papers');
    }
    gfs.files.findOne({filename: paper.link}, (err,file) =>{
        if(!file){
            return new ExpressError("No file",404);
        }

        const data = {paper, file}
        res.render('papers/show', { data});
        // res.send(file)
    })
})

app.get('/upload/:id', (req,res)=>{
    const { id } = req.params;
    gfs.files.findOne({filename: id}, (err,file) =>{
        if(!file){
            return new ExpressError("No file",404);
        }

        var readstream = gfs.createReadStream(id);
        // readstream.pipe(res);
        res.send(file)
    })
})

app.get('/', (req,res)=>{
    res.render('home')
})

// app.all('*', (req,res,next)=>{
//     next(new ExpressError('Page Not Found', 404))
// })

// app.use((err,req,res,next)=>{
//     const { statusCode = 500} = err;
//     if(!err.message) err.message = 'Something went wrong!!';
//     res.status(statusCode).render('error', {err});
// })

const port = process.env.PORT || 3000;
app.listen(3000, ()=>{
    console.log(`SERVING ON ${port}`);
})