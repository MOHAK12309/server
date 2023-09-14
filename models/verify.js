const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const crypto = require("crypto");

// const usercontrolleer = require("./controllerUser");

const ver_schema = new mongoose.Schema({
   
    email2: {
        type: String,

        // unique: true,
        lowercase: true,
    },
 


  

    OTP2: {
        type: Object,
    },
    
});


// ver_schema.methods.SendOtp=async function(){
//   const otp=`${Math.floor(1000+Math.random()*9000)}`
//         console.log(otp)
//         const saltRound=10
//        const hashedOtp= await bcrypt.hash(otp,saltRound)
//        const newOtpVerification=await new otp({

//       otp:hashedOtp,
//       createdAt:Date.now,
//       expiresAt:Date.now+3600000

// })}
const verify = mongoose.model("verify", ver_schema);
module.exports = verify;

