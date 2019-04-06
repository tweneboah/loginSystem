const express         = require('express');
const ejs             = require('ejs');
const mongoose        = require('mongoose')
const bodyParser      = require('body-parser');
const passport        = require('passport');
const LocalStrategy   = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const User                  = require('./models/user');

//CONNECTING TO DB
mongoose.connect('mongodb://127.0.0.1:27017/LoginSystem-DB', {
    useNewUrlParser: true, 
    useCreateIndex: true,//help us to quickly access our database
    useFindAndModify: false
  });


const app = express();

app.use(require('express-session')({
    secret: 'my name is emmanuel',
    resave: false,
    saveUninitialized: false
}))
//DECODING AND ENCODING USING PASSPORT
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//----------------------------
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(passport.initialize());
app.use(passport.session());

//============
//ROUTES
//==========

//Auth ROUTE

//Show register form
app.get('/register', (req, res) => {
    res.render('register')
})

//handling user sign up

app.post('/register', (req, res) => {
   req.body.username
   req.body.password

   User.register(new User({username: req.body.username}), req.body.password, (error, user) => {
       if(error){
           console.log(error);
           return res.render('/register')
       }
       passport.authenticate('local')(req, res, ()=> {
           res.redirect('/secret')
       })
   })
})

//HOME ROUTE
app.get('/', (req, res) => {
    res.render('home')
})

//LOGOUT
app.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/')
})


//LOGOUT MIDDLEWARE FUNCTION
let isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}


app.get('/secret', isLoggedIn, (req, res) => {
    res.render('secret')
})

//LOGIN ROUTES
//GET LOGIN FORM
app.get('/login', (req, res)=> {
    res.render('login');
});

//PROCESS THE LOGIN FORM //loigin logic
app.post('/login', passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
}) ,(req, res)=> {
    
})




app.listen(3000, (req, res) => {
    console.log('Server is up and running')
})