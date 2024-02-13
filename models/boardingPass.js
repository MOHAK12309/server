const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const crypto = require("crypto");

const SessionDataScheme1 = new mongoose.Schema({
  nameOflead: {
    type: String,
  },

  EmailOfLead: {
    type: String,
  },

  ContactOfaLead: {
    type: String,
  },
  DescriptionOfLead: {
    type: String,
  },
  RemarkOfLead: {
    type: String,
  },
});

// Create a separate connection for this schema
mongoose.set("useCreateIndex", true);
mongoose.set("strictQuery", true);
const customDbConnection = mongoose.createConnection(
  "mongodb+srv://mohak:xpPb0L0OFzRt3CJu@cluster0.rcgseuy.mongodb.net/BoardingPass?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Create a model using the schema and the custom connection
const BoardingLeads = customDbConnection.model(
  "BoardingLeads",
  SessionDataScheme1
);

module.exports = BoardingLeads