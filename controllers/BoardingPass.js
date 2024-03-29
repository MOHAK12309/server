const BoardingLead = require("../models/boardingPass");
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

exports.CreateLeadData = async (req, res) => {
  try {
    const session = await BoardingLead.create({
        nameOflead: req.body.nameOflead,
        EmailOfLead: req.body.EmailOfLead,
        ContactOfaLead: req.body.ContactOfaLead,
        DescriptionOfLead: req.body.DescriptionOfLead,
        RemarkOfLead:req.body.RemarkOfLead
     
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