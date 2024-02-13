const express = require('express');
const router = express.Router()
const BoardingLead = require('./../controllers/BoardingPass');

router.post("/BoardingLead",BoardingLead.CreateLeadData)


module.exports = router