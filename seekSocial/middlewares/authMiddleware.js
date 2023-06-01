import { User } from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { responseCommon } from '../../utils/resComm.js';

export const isAuthenticated = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;

  if(!authToken) return responseCommon(res, 401,undefined, null, false)

    const accessToken = authToken.split(' ')[1];

  if(!accessToken) return responseCommon(res, 401, undefined, null, false)


  const decode = jwt.verify(accessToken, process.env.ACCESS_SECRET)

  if(!decode) return responseCommon(res, 401, undefined, null, false )

    req.user = await User.findById(decode.id)
    next()
  } catch (error) {
    const errorMessage = error.message
    if(errorMessage === "jwt expired") {
      return responseCommon(res, 403, undefined, null, false)
    } else if (errorMessage === "invalid signature") {
      return responseCommon(res, 401, undefined, null, false)
    }

    console.error(error.message)
    responseCommon(res, 500, "Internal Server Error", null, false)
  }
}

