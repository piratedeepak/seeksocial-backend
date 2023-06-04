import getElasticClient from "../../../../config/elasticsearch.js";
import { sendTokens } from "../../../../utils/generateTokens.js";
import { userService } from "../../../services/v1/users/userService.js"
import { responseCommon } from "../../../../utils/resComm.js";

export const login = async (req, res, next) => {
  try {
    const user = await userService.login(req.body);
    const tokens = sendTokens(user);

    return responseCommon(res, 200, "Login Successfully", tokens, true)

  } catch (error) {
    // console.log(error)
    return responseCommon(res, 400, error.message, null, false)
  }
};

export const register = async (req, res, next) => {
  try {
    const user = await userService.register(req.body);
    const tokens = sendTokens(user)

    return responseCommon(res, 200, "Registered Successfully", tokens, false)

  } catch (error) {
    return responseCommon(res, 400, error.message, null, false)
  }
};

export const refreshTheToken = async (req, res, next) => {
  try {
    const refreshToken = req.headers['x-refresh-token'];

    const accessToken = await userService.refreshTheToken(refreshToken);

    const options = {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    };

    return responseCommon(res, 200, "Access token has been refreshed", accessToken, true)

  } catch (error) {
    return responseCommon(res, 400, error.message, null, false)

  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user._id);

    return responseCommon(res, 200, "User Data Found", user, true)

  } catch (error) {
    return responseCommon(res, 400, error.message, null, false)
  }
};
export const filterUserData = async (req, res) => {
  try {
    const data = req.body;
    const client = await getElasticClient();
    const response = await userService.filterService(client, data);

    return responseCommon(res, 200, null, response.hits, true)
  } catch (error) {
    return responseCommon(res, 500, error.message, null, false)
  }
}

export const forgetPassword = async(req, res, next) => {
  try {

    const response = await userService.forgetPassword(req.body)
    
    return responseCommon(res, 200, "Email has been sent successfully", response, true)

  } catch (error) {
    return responseCommon(res, 500, error.message, null, false)
  }
}

export const changePassword = async (req, res, next) => {
  try {
    const { token } = req.params
    const { password } = req.body

    const response = await userService.changePassword(token, password)

    return responseCommon(res, 200, "Password Updated Successfully", response, true)

  } catch (error) {
    console.error(error)
    return responseCommon(res, 500, error.message, null, false)
  }
  
}


export const sendGoogleLoginToken = async (req, res) => {

  const tokens = req.user
  
 try{
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return responseCommon(res, 200, "Login Successfully", tokens, true)
    
  } catch (error) {
    return responseCommon(res, 500, error.message, null, false)
  }
}
