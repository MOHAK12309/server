const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const crypto = require("crypto");

const SessionDataScheme1 = new mongoose.Schema({
    location:{
        type: String,
    },
    Date:{
        type: String,
    },
    StartTime:{
        type: String,
    },
    EndTime:{
        type: String,
    },
    TotalPlayers:{
        type: String,
    },
})

const SessionDataNow = mongoose.model("SessionDataNow",SessionDataScheme1)

module.exports = SessionDataNow