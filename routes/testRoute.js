const express = require('express');
const router = express.Router()
const auth2 = require('./../controllers/testController');
const { auth } = require('firebase-admin');



router.post('/signup3', auth2.signup3)
// router.post('/verify2',auth.signup)
router.patch('/update3/:id', auth2.updateUser2)
router.get('/getone2/:id',auth2.getOneuser2)

module.exports = router
// Mohak@12345
// careerclsaaasassroom44@gmail.com
// Mohak@1234567