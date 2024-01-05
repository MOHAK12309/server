const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const crypto = require("crypto");

const customCollectionName = "playground";

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
}, {
  collection: customCollectionName // Specify the custom collection name here
});

const SessionDataNow = mongoose.model("SessionDataNow",SessionDataScheme1)

module.exports = SessionDataNow