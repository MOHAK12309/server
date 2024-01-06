const express = require('express');
const router = express.Router()
const ride = require('./../controllers/RideCountroller');

router.post("/createRide",ride.CreateData)

router.patch("/Gallery/:id",ride.uploadGalleryPhotos)
router.patch("/Thumbnail/:id",ride.uploadThumnailPhoto)
router.patch("/updateRide/:id",ride.updateRide)
router.get("/getRide",ride.getRide)
router.get("/getRide",ride.getRide)
router.patch("/updateRideStatus/:RideID",ride.updateRideAfterPurchase)
module.exports = router
