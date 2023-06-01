import { User } from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { responseCommon } from '../../utils/resComm.js';

export const isAuthenticated = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;

    if (!authToken) return responseCommon(res, 401, "User Not Logged In", null, false)

    const accessToken = authToken.split(' ')[1];

    if (!accessToken) return responseCommon(res, 401, "Unauthorized", null, false)


    const decode = jwt.verify(accessToken, process.env.ACCESS_SECRET)

    req.user = await User.findById(decode.id)
    next()
  } catch (error) {
    responseCommon(res, 500, "Internal Server Error", null, false)
  }
}

