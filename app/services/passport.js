const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const LocalStrategy = require("passport-local");
const GooglePlusTokenStrategy = require("passport-google-plus-token");
const FacebookTokenStrategy = require("passport-facebook-token");
const bcrypt = require("bcryptjs");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const GoogleStrategy1 = require("passport-google-token").Strategy;
const { APIResponse } = require("../utils");
const models = require("../models");
const jwt = require("jsonwebtoken");

passport.use(
  "googleToken1",
  new GoogleStrategy1(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        // Check if user existing in google's account
        let user = await models._user.findOne({
          email: profile.emails[0].value,
        });
        // console.log(user)
        if (!user) {
          user = await new models._user({
            username: profile.displayName,
            email: profile.emails[0].value,
            photo: profile._json.picture,
            enabled: true,
            role: "student",
          }).save();
        }
        req.authenticatedUser = user;
        // console.log(user)
        return done(null, user);
      } catch (err) {
        done(err, false, err.message);
      }
    }
  )
);

/*
{ provider: 'google',
  id: '113329839736232589114',
  displayName: 'kareem arafa',
  name: { familyName: 'arafa', givenName: 'kareem' },
  emails: [ { value: 'kareem.arafa1515@gmail.com' } ],
  _raw: '{\n  "id": "113329839736232589114",\n  "email": "kareem.arafa1515@gmail.com",\n  "verified_email": true,\n  "name": "kareem arafa",\n  "given_name": "kareem",\n  "family_name": "arafa",\n  "picture": "https://lh4.googleusercontent.com/-4vVAHxSu6qA/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclTmeFF6gnR9PpBzogQlOdorR5pWQ/photo.jpg",\n  "locale": "ar"\n}\n',
  _json:
   { id: '113329839736232589114',
     email: 'kareem.arafa1515@gmail.com',
     verified_email: true,
     name: 'kareem arafa',
     given_name: 'kareem',
     family_name: 'arafa',
     picture: 'https://lh4.googleusercontent.com/-4vVAHxSu6qA/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclTmeFF6gnR9PpBzogQlOdorR5pWQ/photo.jpg',
     locale: 'ar' } }
*/
