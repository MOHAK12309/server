const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const crypto = require("crypto");

const SessionDataScheme1 = new mongoose.Schema({
  TimeOfContact: {
    type: Date,
    default:Date.now
  },
  NameOfContact:{
    type:String
  },

  SubjectOfContact: {
    type: String,
  },
  EmailOfContact:{
    type:String
  },
  PhoneOfContact:{
    type:String
  },
  SubjectOfContact:{
    type:String
  }
});

// Create a separate connection for this schema
mongoose.set("useCreateIndex", true);
mongoose.set("strictQuery", true);
const customDbConnection = mongoose.createConnection(
  "mongodb+srv://mohak:xpPb0L0OFzRt3CJu@cluster0.rcgseuy.mongodb.net/Youthbuzz?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Create a model using the schema and the custom connection
const Contactus = customDbConnection.model("Contactus", SessionDataScheme1);

module.exports =  Contactus;
