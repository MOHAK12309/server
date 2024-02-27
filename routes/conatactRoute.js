const express = require('express');
const router = express.Router()
const Contact = require('../controllers/contactaController');

router.post("/contactus",Contact.CreateContactData)


module.exports = router