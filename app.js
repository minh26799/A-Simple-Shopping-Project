const express = require('express');  //Express library
const expressLayouts = require('express-ejs-layouts'); //ejs layouts for helping interface
const mongoose = require('mongoose'); //Mongodb library for accessing to database [User accounts]
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();


// Passport config

require('./config/passport')(passport);
//DB config
const db = require('./config/keys').MongoURI;

// connect to mongodb
mongoose.connect(db, { 
        useUnifiedTopology: true, 
        useNewUrlParser: true,
})
.then(() => console.log('Mongodb connected!'))
.catch(err => console.log(err));
//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
//Body Parser
app.use(express.urlencoded({extended: false})); 

//Express Session
app.use(session({
        secret: 'keyboard',
        resave: true,
        saveUninitialized: true,
      }));


//Passport middleware 
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        next();
});
// Routes
app.use('/', require('./routes/index'))

app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Sever starts on port: ${PORT}`));