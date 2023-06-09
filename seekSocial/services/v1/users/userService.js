import { sendEmail } from "../../../../utils/sendMail.js";
import { User } from "../../../models/userModel.js";
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { isSubscribed } from "../../../middlewares/subscriptionMiddleware.js";


const login = async (params) => {
  try {
    const { email, password } = params;

    if (!email || !password) throw Error("Please enter all fields");

    const user = await User.findOne({ email }).select("+password");

    if (!user) throw Error ("User doesn't exist");

    const isMatch = await user.comparePassword(password);

    if (!isMatch) throw Error("Incorrect Email or Password");

    return {name:user.name, email:user.email, _id:user._id};
  } catch (error) {
    throw error;
  }
};

const register = async (params) => {
  try {
    const { name, email, password } = params;

    if (!name || !email || !password) throw Error("Please enter all fields");

    let user = await User.findOne({ email: { $regex: email, $options: "i" } });

    if (user) throw Error("User Already Exist");

    user = await User.create({ name, email, password })

    return {name:user.name, email:user.email, _id:user._id};
  } catch (error) {
    throw error;
  }
};

const refreshTheToken = async (refreshToken) => {
  try {
    const decode = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    if (!decode) throw Error("Unauthorize");

    const accessToken = jwt.sign(
      {
        id: decode.id,
      },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    return accessToken;
  } catch (error) {
    throw error;
  }
};

const logout = async (req, res, next) => {
  const options = { maxAge: 0 };

  res.cookie("accessToken", null, options);
  res.cookie("refreshToken", null, options);

  res.status(200).json({
    message: "Logout Successfully",
  });
};

const getProfile = async (id) => {
  try {
    // const user = await User.findById(id);

    let user = await User.aggregate([{ "$match": {_id:id} }, { "$lookup": { "from": "subscriptions", "localField": "_id", "foreignField": "user_id", "as": "subscription" } }]);
    user = user[0]
    return {name:user.name, email:user.email, google_id:user.googleId, search_count:user.searchCount, subscription:user.subscription};
  } catch (error) {
    throw error;
  }
};

const filterService = async (client, data, user) => {
  try {

    const limit = await isSubscribed(user)

    if(!limit) return Error("Internal Server Error")

    if (data.limit > limit.profile_count || (data.page || 0) * (data.limit || 50) > limit.profile_count) {
      return res.status(400).json({ error: "search limit exceeded" });
    }

    const mustQueries = [];

    for (const field of [
      "follower_count",
      "following_count",
      "aweme_count",
      "favoriting_count",
      "total_favorited",
    ]) {
      if (field in data) {
        mustQueries.push({ range: { [field]: data[field] } });
      }
    }

    if (data.create_time) {
      const gte = new Date(data.create_time.gte).getTime() / 1000;
      const lte = new Date(data.create_time.lte).getTime() / 1000;
      mustQueries.push({ range: { create_time: { gte, lte } } });
    }

    if (data.region && data.region.length > 0) {
      mustQueries.push({ terms: { "region.keyword": data.region } });
    }

    if (data.signature) {
      for (const word of data.signature) {
        mustQueries.push({ match_phrase: { signature: word } });
      }
    }

    const body = {
      from: (data.page || 0) * (data.limit || 50),
      size: data.limit || 50,
      query: { bool: { must: mustQueries } },
      track_total_hits: true,
    };
    const response = await client.search({
      index: process.env.ELASTICSEARCH_INDEX,
      body,
    });

    if(!user) return response

    const result = await User.findById(user._id)

    if(result.searchCount > limit.search_count){
      throw Error("You have Exceed the Search Limit")
    }else{
      console.log(result)
      result.searchCount+=1;
      await result.save()
      return response;
    }

  } catch (error) {
    console.error(error);
    throw error;
  }
};

const forgetPassword = async (params) => {

  try {
    const { email } = params;

    if (!email) throw Error("Please Fill all the fields")

    const user = await User.findOne({ email: { $regex: email, $options: "i" } })

    if (!user) throw Error("User not Registered")

    const resetToken = await user.getResetToken()

    await user.save();


    const dynamicTemplateData = {
      "name": user.name,
      "reset_link": `${process.env.FRONTEND_URL}/resetpassword?token=${resetToken}`
    }
   
   await sendEmail(user.email, "Reset Password", process.env.RESET_TEMPLATE_ID,dynamicTemplateData)

  return true

} catch (error) {
  throw error
}
}

const changePassword = async (token, password) => {
  try {
    if (!token) throw Error("Token is not available")

    const resetPasswordToken = crypto.createHash("sha256").update(`${token}`).digest("hex")

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: {
        $gt: Date.now()
      },
    })
    if (!user) throw Error("Token is Invalid or has been expired")

    if (!password) throw Error("Please enter the password")

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    user.save()

    return true

  } catch (error) {
    throw error
  }
}


export const userService = {
  login,
  register,
  refreshTheToken,
  getProfile,
  logout,
  filterService,
  forgetPassword,
  changePassword
};
