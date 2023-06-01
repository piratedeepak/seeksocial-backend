import passport from "passport"
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { User } from "../seekSocial/models/userModel.js";
import { sendTokens } from "./generateTokens.js";

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
        const tokens = sendTokens(user)
        console.log(tokens, "new user")
        return done(null, tokens)
      }else{
        const tokens = sendTokens(user)
        console.log(tokens, "found user")
        return done(null, tokens)
      }
    }
    ))

    passport.serializeUser((tokens, done) =>{
      return done(null, tokens.accessToken)
    })

    passport.deserializeUser(async(token, done)=>{
      return done(null, token)
    })
}
