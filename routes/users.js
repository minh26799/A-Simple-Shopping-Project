const express = require('express');
//const { route } = require('.');
const bcrypt = require('bcrypt');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
// Login Page
router.get('/login', (req,res) => res.render('login'));

// Register Page
router.get('/register', (req,res) => res.render('register'));

//Register Handle

router.post('/register',(req, res) => {
    const { name , email, password, password2 } = req.body;
    let errors = [];
    if(!name || !email || ! password || !password2){
        errors.push({msg: 'Please fill in all fields '});
    }
    if(password !== password2){
        errors.push({msg: 'Password Confirm do not match!'});
    }
    if(password.length < 6){
        errors.push({msg: 'Password should be at least 6 characters!' })
    }
    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }else {
        // Validation passed
        User.findOne({name: name},{ email: email})
            .then(user=>{
                if(user) {
                    // USer Exit
                    errors.push({msg: 'Email has already used!'});
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else{
                    const newUser = new User({
                        name,
                        email,
                        password 
                    });
                    //Hash password
                    bcrypt.genSalt(10, (error,salt) => 
                        bcrypt.hash(newUser.password, salt, (error, hash) => {
                            if(error) throw error;

                            //Set password to hashed
                            newUser.password = hash;
                            //Save User
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in');
                                    res.redirect('/user/login');
                                })
                                .catch(error => console.log(error));
                    } ) )
                }
            });
    }
});
// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });

//Logout Handle
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});
module.exports = router;