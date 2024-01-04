const express = require('express');
const router = express.Router()
const session = require('./../controllers/SessionDataController1');

router.post("/createsession",session.CreateData)
module.exports = router


