const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

// Load User model 

const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password,done) => {
            // Match USer 
            User.findOne({email: email})
                .then(user => {
                    if(!user){
                        return done(null, false,{message: 'That email is not registered! Please try again!'});
                    } 
                    //Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;

                        if(isMatch) {
                            return done(null, user);
                        }else {
                            return done(null, false, { message: 'Incorrect Password! Please try again!' });
                        }
                    });
                })
                .catch(error => console.log(error));
        })
    );
        // Code from passport npm serial and deserial 
    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
       
      passport.deserializeUser((id, done) => {
        User.findById(id,(err, user) => {
          done(err, user);
        });
      });
}