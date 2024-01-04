const SessionDataController = require("../models/SessionsData");
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

exports.CreateData = async (req, res) => {
    try {
      // Assuming SessionDataController.create returns the created session
      const session = await SessionDataController.create({
        location: req.body.location,
        Date: req.body.Date,
        StartTime: req.body.StartTime,
        EndTime: req.body.EndTime,
        TotalPlayers: req.body.TotalPlayers,
      });
  
      // Set a timeout to update the user status after 5 minutes
      setTimeout(async () => {
        // Assuming there's a way to get the user associated with this session
        const userId = session._id; // Replace with the actual way to get the user ID
  
        // Update the user status to false
        await User.findByIdAndUpdate(userId, { status: false });
  
        console.log(`User status updated to false after 5 minutes for user ID: ${userId}`);
      }, 10000); // 5 minutes in milliseconds
  
      res.status(201).json({
        status: "Success",
        Data: {
          session,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "Error",
        message: "Internal Server Error",
      });
    }
  };