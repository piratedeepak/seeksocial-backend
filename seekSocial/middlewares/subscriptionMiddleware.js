import { Subscription } from "../models/SubscriptionModel.js";
import { responseCommon } from "../../utils/resComm.js";
import { isAuthenticated } from "./authMiddleware.js";


export const isSubscribed = async (req, res, next) => {

   try {
    let profile_count = 0;
    let search_count = 0;

    // console.log(user)

    if(!req.user){
        profile_count = 5
        search_count = 10

        req.limit = {search_count, profile_count}
        req.data = {...req.data, limit: 5}
        next()
        return
    }

    const subscription = await Subscription.find({user_id: req.user._id})

    if(!subscription.length > 0) {
        profile_count = 500;
        search_count =  10

        req.limit = {search_count, profile_count}
        next()
        return
    }

    if(subscription[0].plan_amount/100 === 4.99){
        profile_count=5000;
        search_count = 100;

        req.limit = {search_count, profile_count}
        next()
        return  
    }
    if(subscription[0].plan_amount/100 === 9.99){
        profile_count = 10000;
        search_count = 250;

        req.limit = {search_count, profile_count}
        next()
        return
    }
    if(subscription[0].plan_amount/100 ===14.99){
        profile_count = 50000;
        search_count = 2000

        req.limit = {search_count, profile_count}
        next()
        return
    }
   } catch (error) {
   console.log(error.message)
   }

}



export const subAuthentication = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    if(!authToken || authToken === '' || authToken === 'null'){
        req.user = undefined
        next()
        return
    }
    const refreshToken = req.headers['x-refresh-token'];
    const accessToken = authToken.split(' ')[1];
    if (accessToken=='null' && !refreshToken) {
      req.user = undefined
      next()
    }else{
        isAuthenticated(req, res, next)
    }
}catch(err){
    console.log(err.message)
}
};

