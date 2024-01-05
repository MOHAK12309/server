const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const crypto = require("crypto");

const SessionDataScheme1 = new mongoose.Schema({
  Location: {
    type: String,
  },

  RideID: {
    type: String,
  },
  Name: {
    type: String,
  },
  Thumbnail: {
    type: String,
  },
  Gallery: {
    type: [],
  },
  Reviews: {
    type: [{
      userReview:{
        type:String
      },
      userRating:{
        type:Number
      },
      userName:{
        type:String
      }
    }],
  },
  Rating: {
    type: Number,
  },
  Description: {
    type: String,
  },

  Status: {
    type: String,
  },
});

// Create a separate connection for this schema
mongoose.set("useCreateIndex", true);
mongoose.set("strictQuery", true);
const customDbConnection = mongoose.createConnection(
  "mongodb+srv://mohak:xpPb0L0OFzRt3CJu@cluster0.rcgseuy.mongodb.net/Ourcadium?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Create a model using the schema and the custom connection
const RideData = customDbConnection.model("RideData", SessionDataScheme1);

module.exports = RideData;
