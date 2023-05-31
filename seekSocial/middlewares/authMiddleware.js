import ErrorHandler from "../../utils/errorHandler.js"
import { User } from '../models/userModel.js'
import  jwt  from 'jsonwebtoken'

export const isAuthenticated = async(req, res, next) => {
  try {
    const accessToken = req.cookies['accessToken']

  if(!accessToken) return res.status(401).json({
    success:false,
    message: "Unauthorized"
  })

  const decode = jwt.verify(accessToken, process.env.ACCESS_SECRET)

  req.user = await User.findById(decode.id)
  next()
  } catch (error) {
    res.status(500).json({
      success:false,
      message:error.message
    })
  }
}

