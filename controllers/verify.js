const User = require("../models/userModel");
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
const { upload } = require("../utils/s3")

const { result, slice } = require("lodash");
const Mailgen = require("mailgen")
const admin = require('firebase-admin');
const verify=require("../models/verify")




const createAndSendToken = (user, statusCode, res) => {
    const token = singnup(user._id);
  
    res.cookie("jwt", token, {
      expiresIn: new Date(Date.now + 90 * 24 * 60 * 60 * 1000),
      secure: false,
      httpOnly: true,
    });
    res.status(statusCode).json({
      statusbar: "success",
      token,
      data: {
        user,
      },
    });
  };







exports.signup = catchAsync(async (req, res, next) => {
    const { email2 } = req.body;
  
    if ( !email2 ) {
      return res.status(422).json({
        status: false,
        message: "please provide required requested field",
      });
    }
  
    const user = await verify.findOne({ email2: email2 });
  
    if (user) {
      return res.status(422).json({
        status: true,
        message: "email2 is already registered. please login",
      });
    }
  
  
  
  
  
  
  
    const otp = otpGenerator.generate(4, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "youthbuzz00@gmail.com",
        pass: "viqiqwwdppyjtntd" // generated ethereal password
      },
    });
  
    const mailGenerator = new Mailgen({
      theme: 'salted', // Choose a Mailgen theme (e.g., 'salted' or 'neopolitan')
      product: {
        name: 'portal.youthbuzz.in',
        link: 'https://yourapp.com',
        // You can customize other product details here
      },
    });
  
    // Function to send OTP via email2
    const sendOTPemail2 = () => {
      // Create a Mailgen email2 template
      const email22 = {
        body: {
           // Customize the recipient's name
          intro: `Your OTP for verification is:${otp}`,
          // code: otp, // Replace with your generated OTP
  
          outro: 'If you did not request this OTP, please ignore this email2.',
        },
      };
  
      // Generate the email2 HTML using Mailgen
      const email2Body = mailGenerator.generate(email22);
  
      // Create email2 options
      const mailOptions = {
        from: 'youthbuzz00@gmail.com',
        to: email2,
        subject: 'OTP Verification',
        html: email2Body,
      };
  
      // Send the email2
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending OTP email2:', error);
        } else {
          console.log('OTP email2 sent:', info.response);
        }
      });
    };
  
    sendOTPemail2()
  
    const time = new Date();
    time.setMinutes(time.getMinutes() + 5);
  
    const OTP = {
      OTP: otp,
      createdAt: new Date().toLocaleTimeString(),
      expiresAt: time.toLocaleTimeString(),
    };
    
  
    const newusers = new verify({
      
      email2: email2,
    
      OTP2: OTP,
      
      });
  
    const savedResponse = await newusers.save();
    res.status(201).json(
        {
            statusbar:"success",
            data:{
                savedResponse
            }

        }
    )
  });



  exports.verify = async (req, res) => {
    const { OTP2 } = req.body;
  
    // Assuming 'User' is your model name
    const user = await verify.findOne({ 'OTP2.OTP2': OTP2 });
  
    if (!user) {
      res.status(400).send('Invalid OTP');
  
    } else {
      const currentTime = new Date().getTime();
      const expiresAt = new Date(user.OTP2.expiresAt).getTime();
  
      if (currentTime > expiresAt) {
        res.status(400).send('OTP has expired');
      } else {
        await User.findOneAndUpdate({ 'OTP2.OTP2': OTP2 }, { $unset: { OTP2: 1 } });
  
        res.status(201).json({
           statusbar:"true"
        })
    
      }
    }
  };