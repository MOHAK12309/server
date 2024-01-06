const Booking = require("../models/BookedRide");
const Ride = require("../models/RideModel");
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





exports.CreateBookData = async (req, res) => {
  try {
    // Fetch the ride from the database based on the ride details
    const ride = await Ride.findOne({ RideID: req.params.RideID });

    if (!ride) {
      return res.status(404).json({
        status: "error",
        message: "Ride not found",
      });
    }

    if (ride.Status === "Avail") {
      const session = await Booking.create({
        TimeOfBooking: req.body.TimeOfBooking,
        Coins: req.body.Coins,
        RideName: req.body.RideName,
        Slot: req.body.Slot,
      });

      res.status(201).json({
        status: "Success",
        Data: {
          session,
        },
      });
    } else {
      res.status(400).json({
        status: "false",
        message: "Ride not available",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
