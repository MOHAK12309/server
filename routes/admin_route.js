const express = require('express');
const router = express.Router()
const admin = require('./../controllers/adminLOgin');

const { upload } = require("../utils/s3")

router.post('/signup', admin.AdminSignup)
router.post('/login', admin.AdminLogin)

module.exports = router