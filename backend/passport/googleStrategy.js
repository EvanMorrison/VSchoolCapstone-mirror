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


            console.log('google profile ', profile);
            console.log('accessToken ', accessToken);
            
            user.email = profile.emails[0].value;
            // user.image = profile._json.image.url;
            user.firstName = profile.name.givenName;
            user.lastName = profile.name.familyName;
            user.username = profile.name.givenName.slice(0,2) + profile.name.familyName.slice(0,3);
            user.google.accessToken = accessToken;
            user.googleId = profile.id;
            console.log('now in google strategy ')
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
                            req._passport.instance._userProperty = savedUser
                            return done(null, savedUser);
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