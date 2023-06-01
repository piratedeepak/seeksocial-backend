import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { responseCommon } from "../../utils/resComm.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const refreshToken = req.headers['x-refresh-token'];

    if (!authToken && !refreshToken) {
      return responseCommon(res, 401, 'Unauthorized', null, false);
    }

    const accessToken = authToken.split(' ')[1];

    if (!accessToken) {
      return responseCommon(res, 401, 'Unauthorized', null, false);
    }

    try {
      const decode = jwt.verify(accessToken, process.env.ACCESS_SECRET);
      req.user = await User.findById(decode.id);
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return responseCommon(res, 403, 'Access token expired', null, false);
      } else if (error instanceof jwt.JsonWebTokenError) {
        return responseCommon(res, 401, 'Invalid access token', null, false);
      }

      console.error(error.message);
      responseCommon(res, 500, 'Internal Server Error', null, false);
    }
  } catch (error) {
    console.error(error.message);
    responseCommon(res, 500, 'Internal Server Error', null, false);
  }
};

