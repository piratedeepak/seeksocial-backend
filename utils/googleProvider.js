import passport from "passport"
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { User } from "../seekSocial/models/userModel.js";

export const connectPassport = () => {
  console.log(process.env.GOOGLE_CLIENT_ID)
  passport.use(
    new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true
    }, 
    async (req, accessToken, refreshToken, profile, done) => {
      const user = await User.findOne({googleId:profile.id})

      if(!user){
        const newUser = await User.create({
          name:profile.displayName,
          googleId:profile.id,
          email:profile.email
        })
        console.log(newUser)
        return done(null, newUser)
      }else{
        const tokens = sendTokens(user)
        return done(null, tokens)
      }
    }
    ))

    passport.serializeUser((user, done) =>{
      done(null, user.id)
    })

    passport.deserializeUser(async(id, done)=>{
      const user = await User.findById(id)
      done(null, user)
    })
}
