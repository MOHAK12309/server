const express = require('express');
const router = express.Router()
const auth2 = require('./../controllers/verify');

const { upload } = require("../utils/s3");



router.post('/register',auth2.signup)
router.post("/verify",auth2.verify)
module.exports = router