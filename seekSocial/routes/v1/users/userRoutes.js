import express  from "express";
import { register, login, refreshTheToken, logout, getProfile, googleLogout, filterUserData, forgetPassword, changePassword } from "../../../controllers/v1/users/userController.js";
import { isAuthenticated } from "../../../middlewares/authMiddleware.js";
import passport from "passport";


const router = express.Router();

router.route("/register").post(register)
router.route("/login").post(login)
router.route('/refreshtoken').post(refreshTheToken)
router.route('/logout').post(logout)
router.route('/myprofile').get( isAuthenticated, getProfile)
router.route('/search').get(filterUserData)
router.route('/forgetpassword').post(forgetPassword)
router.route('/changepassword/:token').put(changePassword)



//google login path
router.route('/google/login').get(passport.authenticate("google",{scope:['profile', "email"]}))

router.route('/google/callback').get(passport.authenticate("google", {
    scope:["profile", 'email'],
    successRedirect: process.env.FRONTEND_URL,
    successMessage:"hello"
}))
router.route('/logout').get(googleLogout)



export default router;