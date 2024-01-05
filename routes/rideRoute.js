const express = require('express');
const router = express.Router()
const ride = require('./../controllers/RideCountroller');

router.post("/createsession",ride.CreateData)
module.exports = router
