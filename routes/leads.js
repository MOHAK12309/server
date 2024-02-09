const express = require('express');
const router = express.Router()
const Bookride = require('./../controllers/lead');

router.post("/Lead",Bookride.CreateLeadData)


module.exports = router