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

exports.CreateData = async (req, res) => {
  try {
    const session = await Ride.create({
      Location: req.body.Location,
      Rating: req.body.Rating,
      Review: req.body.Review,
      Duration: req.body.Duration,
      Status: req.body.Status,
      Description:req.body.Description
    });
    res.status(201).json({
      status: "Success",
      Data: {
        session,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
exports.uploadGalleryPhotos = catchAsync(async (req, res, next) => {
  const uploadMultiple = upload(
    "ourcadium",
    "Ride Thumbnails and Gallery Images/",
    "Gallery"
  ).array("Gallery", 5); // Assuming you want to allow up to 5 files to be uploaded

  uploadMultiple(req, res, async (err) => {
    if (err) {
      return next(new AppError(err.message, 400));
    }

    // Assuming req.files is an array containing information about the uploaded files
    if (req.files && req.files.length > 0) {
      req.body.Gallery = req.files.map((file) => file.key);
    }

    console.log(req.files);

    const ride = await Ride.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: "success",
      message: "Images uploaded successfully",
      data: {
        ride,
      },
    });
  });
});

exports.uploadThumnailPhoto = catchAsync(async (req, res, next) => {
  const uploadSingle = upload("ourcadium", "Ride Thumbnails and Gallery Images/", "thumbnail").single(
    "Thumbnail"
  );
  uploadSingle(req, res, async (err) => {
    if (err) {
      return next(new AppError(err.message, 400));
    }
    if (req.file) {
      req.body.Thumbnail = req.file.key;
    }
    console.log(req.file);
    const blog = await Ride.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: "success",
      message: "Image uploaded successfully",
      data: {
        blog,
      },
    });
  });
});
exports.updateRide = catchAsync(async (req, res) => {
  const user = await Ride.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new AppError(`No seller found with that ID`, 404));
  }
  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});
exports.getRide=catchAsync(async(req,res)=>{
  const ride=await Ride.find()
  res.status(200).json({
    status:"success",
    data:{
      ride

    }


  })
})