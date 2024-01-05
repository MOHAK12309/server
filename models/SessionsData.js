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
  Date: {
    type: String,
  },
  Duration: {
    type: String,
  },
  StartTime: {
    type: String,
  },
  EndTime: {
    type: String,
  },
  TotalPlayers: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

// Create a separate connection for this schema
mongoose.set('useCreateIndex',true)
mongoose.set("strictQuery", true);
const customDbConnection = mongoose.createConnection("mongodb+srv://mohak:xpPb0L0OFzRt3CJu@cluster0.rcgseuy.mongodb.net/Playground?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a model using the schema and the custom connection
const SessionData = customDbConnection.model("SessionData", SessionDataScheme1);

module.exports = SessionData;