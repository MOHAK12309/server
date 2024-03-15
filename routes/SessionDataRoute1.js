const express = require('express');
const router = express.Router()
const session = require('./../controllers/SessionDataController1');

router.post("/createsession",session.CreateData)
router.get("/get",session.GetData)
module.exports = router


