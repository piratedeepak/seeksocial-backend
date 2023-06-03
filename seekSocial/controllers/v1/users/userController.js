import getElasticClient from "../../../../config/elasticsearch.js";
import { sendTokens } from "../../../../utils/generateTokens.js";
import { userService } from "../../../services/v1/users/userService.js"
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import passport from 'passport';
import { responseCommon } from "../../../../utils/resComm.js";


export const login = async (req, res, next) => {
  try {
    const user = await userService.login(req.body);
    sendTokens(user, res);

    return res.status(200).json({
      success:true,
      message:"Login Successfully",
      data: user,
    });
  } catch (error) {
    console.log(error)
    return res.status(400).json({ 
      success:false,
      message: error.message });
  }
};

export const register = async (req, res, next) => {
  try {
    const user = await userService.register(req.body);
    sendTokens(user, res)

    return res.status(200).json({
      success:true,
      message: "Register Successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({ 
      success:false,
      message: error.message });
  }
};

export const refreshTheToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies["refreshToken"];

    const accessToken = await userService.refreshTheToken(refreshToken);

    const options = {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    };

    res.cookie("accessToken", accessToken, options);
    res.status(200).json({
      message: "Access token has been refreshed",
      success:true
    });
  } catch (error) {
    return res.status(401).json({
      success:false,
       message: error.message 
      });
  }
};

export const logout = async (req, res, next) => {
  try {
    const options = { maxAge: 0 };

    res.cookie("accessToken", null, options);
    res.cookie("refreshToken", null, options);

    res.status(200).json({
      success: true,
      message:"Logout Successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    });
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user._id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(400).json({ 
      success:false,
      message: error.message });
  }
};
export const filterUserData = async (req, res) => {
  try {
    const data = req.body;
    const client = await getElasticClient();
    const response = await userService.filterService(client, data);
    res.status(200).json({
      success:true,
      data:response.hits
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success:false,
      message:error.message
     });
  }
};

export const googleLogout = (req, res, next) => {

  const options = { maxAge: 0 };

  res.cookie("accessToken", null, options);
  res.cookie("refreshToken", null, options);

  req.session.destroy((err)=>{
      if(err) return next(err)

      res.clearCookie('connect.sid')
      res.status(200).redirect(process.env.FRONTEND_URL)
  })
}

export const forgetPassword = async(req, res, next) => {
  try {

    const response = await userService.forgetPassword(req.body)
    
    res.status(200).json({
      success:true,
      message:"Email has been sent successfully",
      response
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({error: error.message})
  }
}

export const changePassword = async (req, res, next) => {
  console.log("enter here")
  try {
    const {token} = req.params
    const {password} = req.body

    const response = await userService.changePassword(token, password)

    res.status(200).json({
      success: true,
      message: "Password Updated"
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
  
}


export const sendGoogleLoginToken = async (req, res) => {

  const tokens = req.user
  // console.log(tokens)
 try{
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return responseCommon(res, 200, "Login Successfully", tokens, true)
    
  } catch (error) {
    return responseCommon(res, 500, error.message, null, false)
  }
}
