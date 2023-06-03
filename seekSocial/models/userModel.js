import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from "validator";
import crypto from "crypto"



const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        validate: validator.isEmail,
    },
    password: {
        type: String,
        minLength: [6],
        select: false, // when we get user through api we didn't get the password field
    },
    googleId:{
        type:String,
    },
    resetPasswordToken:String,
    resetPasswordExpire:String,
},
    {
        timestamps: true
    }
)

//hash the password before saving in the schema
schema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    const hashedPassword = await bcrypt.hash(this.password,10)
    this.password = hashedPassword
    next()
})

//compare the saved password and requested password
schema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

schema.methods.getResetToken = async function(){
    const resetToken = crypto.randomBytes(20).toString("hex")

   this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

   this.resetPasswordExpire = Date.now()+15*60*1000;

    return resetToken;
}

export const User = mongoose.model("User", schema)