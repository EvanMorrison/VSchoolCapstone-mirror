var passport = require('passport');
// load the user model
var User = require('../models/userSchema');

// load the auth variables
var config = require('../config');


var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function () {

    passport.use(new GoogleStrategy({
            clientID: config.googleAuth.clientID,
            clientSecret: config.googleAuth.clientSecret,
            callbackURL: config.googleAuth.callbackURL,
            passReqToCallback: true,
        },
        function (req, accessToken, refreshToken, profile, done) {
            var user = {}


            console.log('now in google strategy ')
            console.log('google profile ', profile);
            console.log('accessToken ', accessToken);

            user.email = profile.emails[0].value;
            user.username = profile.emails[0].value;
            user.firstName = profile.name.givenName;
            user.lastName = profile.name.familyName;
            user.googleId = profile.id;
            User.findOne({
                googleId: profile.id
            }, function (err, existingUser) {
                if (err) {
                      return done(err);
                }
                else { 
                    if (!existingUser) {
                    console.log('saving new user ')
                    // if no user found with the facebook id, create one
                    var newUser = new User(user);
                    newUser.save(function (err, savedUser) {
                        if (err) {
                            throw err;
                        } else {
                            console.log('new user saved to mongo')
                            req._passport.instance._userProperty = savedUser
                            req.user = savedUser;
                            return done(null, req);
                        }
                    });
                } else {
                    
                    console.log('user already exists', existingUser);
                    // add the user to req
                    req._passport.instance._userProperty = existingUser;
                    req.user = existingUser;
                     return done(null, req);
                }
            }
        })

    }))
}