import express  from "express";
import { register, login, refreshTheToken, getProfile, filterUserData, forgetPassword, changePassword, sendGoogleLoginToken } from "../../../controllers/v1/users/userController.js";
import { isAuthenticated } from "../../../middlewares/authMiddleware.js";
import passport from "passport";
import { sendTokens } from "../../../../utils/generateTokens.js";
import { isSubscribed, subAuthentication } from "../../../middlewares/subscriptionMiddleware.js";

const router = express.Router();

router.route("/register").post(register)
router.route("/login").post(login)
router.route('/refreshtoken').post(refreshTheToken)
router.route('/myprofile').get( isAuthenticated, getProfile)
router.route('/search').get( subAuthentication, isSubscribed, filterUserData)
router.route('/forgetpassword').post(forgetPassword)
router.route('/changepassword/:token').put(changePassword)

//google login path
router.route('/google/login').get(passport.authenticate("google",{scope:['profile', "email"]}))

router.route('/google/callback').get(passport.authenticate("google", {
    scope:["profile", 'email'],
    failureRedirect:`${ process.env.FRONTEND_URL}/login`,
    successRedirect: process.env.FRONTEND_URL,
}), sendGoogleLoginToken)



export default router;