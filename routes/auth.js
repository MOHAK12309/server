const express = require('express');
const router=express.Router()
const auth = require('./../controllers/authController');


router.post('/signup', auth.signup)
router.post('/login', auth.login)
router.post('/loginWithOtp', auth.loginWithOtp)
router.patch('/update/:id', auth.updateUser)
router.patch('/updatePhoto/:id', auth.uploadUserPhoto)
router.get('/logout',auth.logout);
router.post('/resend',auth.resendOTP);
router.post('/verify',auth.verify);

router.post('/forgot',auth.forgotPassword);
router.post('/reset/:token',auth.reset);
router.get('/getOneuser/:id',auth.getOneuser);
module.exports = router