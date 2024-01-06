const express = require('express');
const router = express.Router()
const Bookride = require('./../controllers/BookingController');

router.post("/BookRide/:RideID",Bookride.CreateBookData)


module.exports = router