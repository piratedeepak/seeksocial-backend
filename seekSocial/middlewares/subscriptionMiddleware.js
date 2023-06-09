import { Subscription } from "../models/SubscriptionModel.js";


export const isSubscribed = async (user) => {

    let profile_count = 0;
    let search_count = 0;

    console.log(user)

    if(!user){
        profile_count = 5
        search_count = 10

        return {search_count, profile_count}

    }

    const subscription = await Subscription.find({user_id:user._id})

    console.log(subscription, "iii")

    if(!subscription.length > 0) {
        profile_count = 500;
        search_count =  10

        return {search_count, profile_count}

    }

    if(subscription.plan_amount/100 === 4.99){
        profile_count=5000;
        search_count = 10;

        return {search_count, profile_count}
    }
    if(subscription.plan_amount/100 === 9.99){
        profile_count = 10000;
        search_count = 250;

        return {search_count, profile_count}
    }
    if(subscription.plan_amount/100 ===14.99){
        profile_count = 50000;
        search_count = 2000

        return {search_count, profile_count}
    }

}