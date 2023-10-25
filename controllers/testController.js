
const User2 = require("../models/personilityModel");
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




exports.signup3 =catchAsync(async (req, res) => {
   const {username} = req.body
   
    const user = await User2.findOne({username:username})
    if(username){
        res.status(201).json({
            statusbar:"true",
            message:"welocome back",
            data:{
                user
            }

        })
    }else{
        const newUser2 = await User2.create({
   
            username: req.body.username,
        
           
          
        });
        res.status(201).json(
            {
                statusbar:"true",
                message:"welocome",
                data:{
                    newUser2
    
                }
            }
        )

    }

    
  
  });
  exports.updateUser2 = catchAsync(async (req, res) => {
    const user = await User2.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) {
      return next(new AppError(`No seller found with that ID`, 404))
    }
    res.status(201).json({
      status: 'success',
      data: {
        user
      }
    });
  });
  exports.getOneuser2 = catchAsync(async (req, res) => {
    const user = await User2.findById(req.params.id)
    res.status(200).json(
      {
        status: "true",
        data: {
          user
        }
      }
    )
  })
  