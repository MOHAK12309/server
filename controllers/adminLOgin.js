const Admin = require("../models/admin");
const { promisify } = require("util");
const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const _ = require("lodash");
const axios = require("axios");
const otpGenerator = require("otp-generator");
const { upload } = require("../utils/s3");
const { result, slice } = require("lodash");
const Mailgen = require("mailgen");
const admin = require("firebase-admin");

const singnup = (id) => {
    return jwt.sign({ id }, "this-is-my-super-longer-secret", {
      expiresIn: "90d",
    });
  };
  
  const createAndSendToken = (admin, statusCode, res) => {
    const token = singnup(admin._id);
  
    res.cookie("jwt", token, {
      expiresIn: new Date(Date.now + 90 * 24 * 60 * 60 * 1000),
      secure: false,
      httpOnly: true,
    });
    res.status(statusCode).json({
      statusbar: "success",
      token,
      data: {
        admin,
      },
    });
  };
  
exports.AdminSignup=catchAsync(async(req,res,next)=>{
  const admin=await Admin.create({
    email:req.body.email,
    password:req.body.password,
    confirm_password:req.body.confirm_password
  })

  createAndSendToken(admin,201,res)
})


exports.AdminLogin=catchAsync(async(req,res,next)=>{
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("please provide email and password", 400));
    }
    const admin = await Admin.findOne({ email }).select("+password");

    createAndSendToken(admin,201,res)
})