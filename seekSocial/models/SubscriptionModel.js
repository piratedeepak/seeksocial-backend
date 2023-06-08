import mongoose from 'mongoose'




const schema = new mongoose.Schema({
    strip_id: {type:String, required:true},
    user_id:{type:mongoose.Schema.Types.ObjectId},
    plan_amount: {type:Number},
    currency:{type:String},
    stripe_email:{type:String},
    stripe_name:{type:String},
    subscription_id:{type:String},
    subscription_date:{type:Date, default:Date.now()},
    subscription_end_date:{type:Date},
    invoice_id:{type:String}
})

export const Subscription = mongoose.model("Subscription", schema)