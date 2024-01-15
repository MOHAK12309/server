const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const crypto = require("crypto");

// const usercontrolleer = require("./controllerUser");

const user_schema = new mongoose.Schema({
    name: {
        type: String,

    },
    Description:{
        type:String

    },
    lastname: {
        type: String
    },
    email: {
        type: String,

        // unique: true,
        lowercase: true,
    },
    yourCoin:{
        type:Number,
        default:5000
    },
    country: {
        type: String

    },
    phoneNumber: {
        type: String
    },
    testBuy:{
        type:Boolean,
        default:false
    },
    DOB:{
        type:Date

    },



    password: {
        type: String,
        // required: true,
        minlength: 8,
        select: false,
    },
    confirm_password: {
        type: String,
        // required: true,
        minlength: 8,
        validate: {
            validator: function (el) {
                return el == this.password;
            },
        },
    },
    Passwordchanged: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    OTP: {
        type: Object,
    },
    verified: {
        type: Boolean,
        default: false
    },
    gender:{
        type:String
    },
    country:{
        type:String
    },
    photo: {
        type : String
            },
});
user_schema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.confirm_password = undefined;
    next();
});
user_schema.methods.correctPassword = async function (
    candidatePassword,
    userPassword


) 

{
    console.log('Candidate Password:', candidatePassword);
    console.log('User Password:', userPassword);
    return await bcrypt.compare(candidatePassword, userPassword);
};
user_schema.methods.changePasswordAfter = function (JWTTimestamp) {
    if (this.Passwordchanged) {
        const changedTimestamp = parseInt(
            this.Passwordchanged.getTime() / 1000,
            
        );
        console.log(this.Passwordchanged, JWTTimestamp);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

user_schema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 3600000;

    return resetToken;
};

// user_schema.methods.SendOtp=async function(){
//   const otp=`${Math.floor(1000+Math.random()*9000)}`
//         console.log(otp)
//         const saltRound=10
//        const hashedOtp= await bcrypt.hash(otp,saltRound)
//        const newOtpVerification=await new otp({

//       otp:hashedOtp,
//       createdAt:Date.now,
//       expiresAt:Date.now+3600000

// })}
const user = mongoose.model("user", user_schema);
module.exports = user;

