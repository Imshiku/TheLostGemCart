


// claude code 

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/user'); // Your existing user model

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google Profile:', profile);
        
        // Check if user already exists with Google ID
        let existingUser = await User.findOne({ googleId: profile.id });
        
        if (existingUser) {
            console.log('Existing Google user found');
            return done(null, existingUser);
        }

        // Check if user exists with same email
        let userWithEmail = await User.findOne({ email: profile.emails[0].value });
        
        if (userWithEmail) {
            // Link Google account to existing email
            console.log('Linking Google to existing email user');
            userWithEmail.googleId = profile.id;
            userWithEmail.profilePicture = profile.photos[0]?.value || '';
            await userWithEmail.save();
            return done(null, userWithEmail);
        }

        // Create new user for Google login
        console.log('Creating new Google user');
        const newUser = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0]?.value || '',
            cart: [], // Your existing cart structure
            // No passwordHash for Google users
        });

        await newUser.save();
        console.log('New Google user created');
        done(null, newUser);
    } catch (error) {
        console.error('Google OAuth error:', error);
        done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
