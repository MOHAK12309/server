const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const crypto = require("crypto");

// const usercontrolleer = require("./controllerUser");

const test_schema = new mongoose.Schema({
    username: {
        type: String,
        unique:true,
    

    },
    testNumber:{
        type: String,

    },
    score:{
        type:[]
    }

});

const test = mongoose.model("test", test_schema);
module.exports = test;

