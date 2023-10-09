"use strict";

var User = require("../models/userModel");

var _require = require("util"),
    promisify = _require.promisify;

var express = require("express");

var mongoose = require("mongoose");

var validator = require("validator");

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var AppError = require("../utils/appError");

var catchAsync = require("../utils/catchAsync");

var crypto = require("crypto");

var nodemailer = require("nodemailer");

var _ = require("lodash");

var axios = require("axios");

var otpGenerator = require("otp-generator");

var _require2 = require("../utils/s3"),
    upload = _require2.upload;

var _require3 = require("lodash"),
    result = _require3.result,
    slice = _require3.slice;

var Mailgen = require("mailgen");

var admin = require('firebase-admin'); // admin.initializeApp({
//   credential: admin.credential.cert({
//       "type": "service_account",
//       "project_id": "youthbuzzwebtest",
//       "private_key_id": "78cabc1a5575243ba47cabc19eab8333f25fbadb",
//       "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDnctYhJHJJ8xNc\nDSNwp4RpF1XnSVXC2c1XgcL8a5qy50JEOH9vT9Mgobv6u/JE5a8PlS82SBTZ9aBu\nmafeeHFB20GeRn/P4dVJlnA+03dsUU6F5ZdKGAkEPgeQUnvq5mHWMTg/2S19iPza\nmxAl1jG3ODPPFeowMWbgwKZUlaT+dm32E+xQtjNyIFmm3yNNWnZWbUbgEV7m+jod\nXd/KkKvbS6KFFk/LXdcpJ/kKqKwU/4Msc9gdMh09eipVRw2G8MNr0m4PYOGj6J+K\neVZ+E/IKdlVhk2k2u2EQpwiLk2ILLG+KotM2H6t8kNNVUbMWCe4dCOMTOrq3AHfi\nAQtLgVNxAgMBAAECggEAFhcIxusCmXpAu8VpP4RNh/Y5NbTzIYDGL3bsFEl032Rh\nF7/IsegNf4zQMzMjAV5mofccJXMlwlPGNyglNH+MV7vEfIXAByhHwhlAp05plIYC\nF5d9JA49NhFxiV3GA/pvFhFmi/l/dP7RG1A3b1UNM66Ci15NFsJwTj004tfRgpO+\nj7jD9oMgAK2mtdSImjZtSX5zXGHzBeCJjVM9IY41FkU0ajEyYtj2jklFhTf3RZuk\nqlsWIY8sCf/5dfG4weOiAmJBC0pCRHtb9GFnZ4YNiHjgFUXZGO74B9wuwqOIsMjb\nbzqqG6xpmOBzX0QLmSIVv9RoPdQwpXd2lX8oUdXLHQKBgQD/oypXIE5SP9MswZhJ\nKECUZyKEHNpHIqEym47jfiAQ+R2ckDf173Yx5mdM/S52305GxgsI+MNBBiy0MW2G\nbqieaGnJwBoW0fMzwg3Vv/VEaS1CqiTZH8qY6AMMykQJ3xBPJF4T96EEDyVPizh1\nxdA8FgKeZ25keRo6A+4kk5tyJwKBgQDnxuMMHMHRFEZoDoV+em7osOOB29c5f4av\nw8A7qZOST2cWuG9VJoq5YwKnnMjkEYQfdunKvJaTezNKRPPQsq80HWMEbO+3mE60\n2URtGby8q3WpPa0VpOocuLIebYURhNFX7yqKMEWMpi8jDIwgvSVRhkLL94lxOhay\njX+nCSzEpwKBgQCo2wUHoc46I/CAOqw1foIRxIIXE9vWavhhLkFW4SObMoGtvdFJ\nANBoq5EGWKINYPkaZIw7c929IK/8oj1/M67rW3qtCdfxxOJJCOAMlYwTkQmVZD+M\nr6QqFe6VzzDb+FyUeiguNj5EKSDzBrnXiT8/wSYfraBMe3WoZpoxzNI7twKBgQCR\nnJTF5kcpqHg3JXBermKBU6gKzGehmumuAOgDU5z/nVzhnEttjoI2x+pCDTD0f8Cm\n19k3YlWjIBJwBXO72JZTwmaTwDC2AjzoR1tCw5mcWofYJIRaBbqDAtH8Zcfk4rF2\nci4ilQMMwtb4SQi8BLiuSBAs/j3d4aWi1VyuPwheHwKBgQCjAiLjiCQ2mCchoLvw\nzM+H81Mm2KMjp/ZTvBV6DS/g2odLCX1GqENrCGLKFw5VejweMNUKLwt4k0TbWJr9\nWVbBIkYfGa5KHLgZxOuTSc+o8h5jmzClE02le93ZVFXr7HDJ5cm+t9s/jsWgHrbi\nvVsevWooAZCtWfKUaCuW6tdxuQ==\n-----END PRIVATE KEY-----\n",
//       "client_email": "firebase-adminsdk-a744y@youthbuzzwebtest.iam.gserviceaccount.com",
//       "client_id": "107654070045600469214",
//       "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//       "token_uri": "https://oauth2.googleapis.com/token",
//       "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//       "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-a744y%40youthbuzzwebtest.iam.gserviceaccount.com",
//       "universe_domain": "googleapis.com"
//     }
//   ),
// });
// const firebaseConfig = {
//   apiKey: "AIzaSyBjepGG8G886Y_AKHW5BYtdasJG-6JmhYc",
//   authDomain: "youthbuzzwebtest.firebaseapp.com",
//   projectId: "youthbuzzwebtest",
//   storageBucket: "youthbuzzwebtest.appspot.com",
//   messagingSenderId: "786059551387",
//   appId: "1:786059551387:web:302299035e292bc4465c3e",
//   measurementId: "G-JBSKGP91C9"
// };
// // Your user's phone number
//   admin.initializeApp(firebaseConfig);


exports.uploadUserPhoto = catchAsync(function _callee2(req, res, next) {
  var uploadSingle;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          uploadSingle = upload("youthbuzzdata", "userData/", "user").single('photo');
          uploadSingle(req, res, function _callee(err) {
            var blog;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!err) {
                      _context.next = 2;
                      break;
                    }

                    return _context.abrupt("return", next(new AppError(err.message, 400)));

                  case 2:
                    if (req.file) {
                      req.body.photo = req.file.key;
                    }

                    console.log(req.file);
                    _context.next = 6;
                    return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.params.id, req.body, {
                      "new": true,
                      runValidators: true
                    }));

                  case 6:
                    blog = _context.sent;
                    res.status(201).json({
                      status: "success",
                      message: "Image uploaded successfully",
                      data: {
                        blog: blog
                      }
                    });

                  case 8:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
});

var singnup = function singnup(id) {
  return jwt.sign({
    id: id
  }, "this-is-my-super-longer-secret", {
    expiresIn: "90d"
  });
};

var createAndSendToken = function createAndSendToken(user, statusCode, res) {
  var token = singnup(user._id);
  res.cookie("jwt", token, {
    expiresIn: new Date(Date.now + 90 * 24 * 60 * 60 * 1000),
    secure: false,
    httpOnly: true
  });
  res.status(statusCode).json({
    statusbar: "success",
    token: token,
    data: {
      user: user
    }
  });
}; // Set up Nodemailer transporter


var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: "careerclassroom4@gmail.com",
    pass: "viqiqwwdppyjtntd"
  }
}); // Configure Express session
// API route to register user and send OTP

exports.register = function _callee3(req, res) {
  var email, otp, mailOptions;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          email = req.body.email;
          _context3.prev = 1;
          // Generate OTP
          otp = otpGenerator.generate(4, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
          }); // Store OTP in the session

          req.session.otp = otp; // Send OTP email

          mailOptions = {
            from: 'careerclassroom4@gmail.com',
            to: email,
            subject: 'OTP Verification',
            text: "Your OTP: ".concat(otp)
          };
          _context3.next = 7;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 7:
          res.status(200).json({
            status: "success",
            message: 'OTP sent successfully'
          });
          _context3.next = 14;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](1);
          console.error(_context3.t0);
          res.status(500).json({
            error: 'Internal server error'
          });

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 10]]);
}; // API route to verify OTP and manage session
// exports.verify = async (req, res) => {
//   const { OTP } = req.body;
//   try {
//     // Get OTP from the session
//     const sessionOtp = req.session.otp;
//     if (!sessionOtp || sessionOtp !== otp) {
//       return res.status(400).json({ error: 'Incorrect OTP' });
//     }
//     // Clear the OTP from the session
//     req.session.otp = null;
//     // Store session data indicating successful verification
//     req.session.verified = true;
//     res.status(200).json({ message: 'OTP verified successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }
// Protected route requiring verification


exports.getOneuser = catchAsync(function _callee4(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.params.id));

        case 2:
          user = _context4.sent;
          res.status(200).json({
            status: "true",
            data: {
              user: user
            }
          });

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // exports.signup = catchAsync(async (req, res, next) => {
//   const {  email } = req.body;
//   if ( !email ) {
//     return res.status(422).json({
//       status: false,
//       message: "please provide required requested field",
//     });
//   }
//   const user = await verify.findOne({ email: email });
//   if (user) {
//     return res.status(422).json({
//       status: true,
//       message: "email is already registered. please login",
//     });
//   }
//   const otp = otpGenerator.generate(4, {
//     digits: true,
//     lowerCaseAlphabets: false,
//     upperCaseAlphabets: false,
//     specialChars: false,
//   });
//   let transporter = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: true, // true for 465, false for other ports
//     auth: {
//       user: "youthbuzz00@gmail.com",
//       pass: "viqiqwwdppyjtntd" // generated ethereal password
//     },
//   });
//   const mailGenerator = new Mailgen({
//     theme: 'salted', // Choose a Mailgen theme (e.g., 'salted' or 'neopolitan')
//     product: {
//       name: 'portal.youthbuzz.in',
//       link: 'https://yourapp.com',
//       // You can customize other product details here
//     },
//   });
//   // Function to send OTP via email
//   const sendOTPEmail = () => {
//     // Create a Mailgen email template
//     const email2 = {
//       body: {
//          // Customize the recipient's name
//         intro: `Your OTP for verification is:${otp}`,
//         // code: otp, // Replace with your generated OTP
//         outro: 'If you did not request this OTP, please ignore this email.',
//       },
//     };
//     // Generate the email HTML using Mailgen
//     const emailBody = mailGenerator.generate(email2);
//     // Create email options
//     const mailOptions = {
//       from: 'youthbuzz00@gmail.com',
//       to: email,
//       subject: 'OTP Verification',
//       html: emailBody,
//     };
//     // Send the email
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error('Error sending OTP email:', error);
//       } else {
//         console.log('OTP email sent:', info.response);
//       }
//     });
//   };
//   sendOTPEmail()
//   const time = new Date();
//   time.setMinutes(time.getMinutes() + 5);
//   const OTP = {
//     OTP: otp,
//     createdAt: new Date().toLocaleTimeString(),
//     expiresAt: time.toLocaleTimeString(),
//   };
//   const newusers = new User({
//     email: email,
//     OTP: OTP,
//     });
//   const savedResponse = await newusers.save();
//   createAndSendToken(savedResponse, 201, res);
// });

exports.signup2 = catchAsync(function _callee5(req, res) {
  var newUser;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(User.create({
            email: req.body.email,
            lastname: req.body.lastname,
            name: req.body.name,
            password: req.body.password,
            confirm_password: req.body.confirm_password,
            gender: req.body.gender,
            DOB: req.body.DOB,
            phoneNumber: req.body.phoneNumber,
            country: req.body.country
          }));

        case 2:
          newUser = _context5.sent;
          // const url = `${req.protocol}://${req.get('host')}/all-services`;
          // await new sendEmail(newUser, url).sendWelcome();
          console.log(newUser);
          createAndSendToken(newUser, 201, res);

        case 5:
        case "end":
          return _context5.stop();
      }
    }
  });
});
exports.resendOTP = catchAsync(function _callee6(req, res, next) {
  var email, existingUser, otp, transporter, mailGenerator, sendOTPEmail, time;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          email = req.body.email;

          if (email) {
            _context6.next = 3;
            break;
          }

          return _context6.abrupt("return", res.status(422).json({
            status: false,
            message: "Please provide your email address."
          }));

        case 3:
          _context6.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 5:
          existingUser = _context6.sent;

          if (existingUser) {
            _context6.next = 8;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            status: false,
            message: "User not found. Please sign up first."
          }));

        case 8:
          // Generate a new OTP and send it via email
          otp = otpGenerator.generate(4, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
          });
          transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: true,
            // true for 465, false for other ports
            auth: {
              user: "youthbuzz00@gmail.com",
              pass: "viqiqwwdppyjtntd" // generated ethereal password

            }
          });
          mailGenerator = new Mailgen({
            theme: 'salted',
            // Choose a Mailgen theme (e.g., 'salted' or 'neopolitan')
            product: {
              name: 'portal.youthbuzz.in',
              link: 'https://yourapp.com' // You can customize other product details here

            }
          }); // Function to send OTP via email

          sendOTPEmail = function sendOTPEmail() {
            // Create a Mailgen email template
            var email2 = {
              body: {
                name: existingUser.name,
                // Customize the recipient's name
                intro: "Your OTP for verification is:".concat(otp),
                // code: otp, // Replace with your generated OTP
                outro: 'If you did not request this OTP, please ignore this email.'
              }
            }; // Generate the email HTML using Mailgen

            var emailBody = mailGenerator.generate(email2); // Create email options

            var mailOptions = {
              from: 'careerclassroom4@gmail.com',
              to: email,
              subject: 'OTP Verification',
              html: emailBody
            }; // Send the email

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.error('Error sending OTP email:', error);
              } else {
                console.log('OTP email sent:', info.response);
              }
            });
          }; // Usage example:
          // Replace with the recipient's email
          // Replace with your generated OTP


          sendOTPEmail(); // const emailSent = await sendOTPByEmail(email, otp);

          if (sendOTPEmail) {
            _context6.next = 15;
            break;
          }

          return _context6.abrupt("return", res.status(500).json({
            status: false,
            message: "Failed to send OTP via email. Please try again later."
          }));

        case 15:
          // Update the user's OTP in the database
          time = new Date();
          time.setMinutes(time.getMinutes() + 5);
          existingUser.OTP = {
            OTP: otp,
            createdAt: new Date().toLocaleTimeString(),
            expiresAt: time.toLocaleTimeString()
          };
          _context6.next = 20;
          return regeneratorRuntime.awrap(existingUser.save());

        case 20:
          res.status(200).json({
            status: true,
            message: "OTP has been resent successfully."
          });

        case 21:
        case "end":
          return _context6.stop();
      }
    }
  });
});

exports.verify = function _callee7(req, res) {
  var OTP, user, currentTime, expiresAt;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          OTP = req.body.OTP; // Assuming 'User' is your model name

          _context7.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            'OTP.OTP': OTP
          }));

        case 3:
          user = _context7.sent;

          if (user) {
            _context7.next = 8;
            break;
          }

          res.status(400).send('Invalid OTP');
          _context7.next = 17;
          break;

        case 8:
          currentTime = new Date().getTime();
          expiresAt = new Date(user.OTP.expiresAt).getTime();

          if (!(currentTime > expiresAt)) {
            _context7.next = 14;
            break;
          }

          res.status(400).send('OTP has expired');
          _context7.next = 17;
          break;

        case 14:
          _context7.next = 16;
          return regeneratorRuntime.awrap(User.findOneAndUpdate({
            'OTP.OTP': OTP
          }, {
            $unset: {
              OTP: 1
            },
            verified: true
          }));

        case 16:
          res.status(201).json({
            statusbar: "true"
          });

        case 17:
        case "end":
          return _context7.stop();
      }
    }
  });
}; // Start the server
// exports.signup = catchAsync(async (req, res, next) => {
//   const newUser = await User.create({
//     email: req.body.email,
//     name: req.body.name,
//     lastname: req.body.lastname,
//     password: req.body.password,
//     confirm_password: req.body.confirm_password,
//   });
//   // const url = `${req.protocol}://${req.get('host')}/all-services`;
//   // await new sendEmail(newUser, url).sendWelcome();
//   console.log(newUser);
//   createAndSendToken(newUser, 201, res);
// });


exports.login = catchAsync(function _callee8(req, res, next) {
  var _req$body, emailOrphoneNumber, password, isEmail, user;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _req$body = req.body, emailOrphoneNumber = _req$body.emailOrphoneNumber, password = _req$body.password; // Check if emailOrPhone is an email

          isEmail = /\S+@\S+\.\S+/.test(emailOrphoneNumber); // Find the user by email or phone

          _context8.next = 4;
          return regeneratorRuntime.awrap(User.findOne(isEmail ? {
            email: emailOrphoneNumber
          } : {
            phoneNumber: emailOrphoneNumber
          }));

        case 4:
          user = _context8.sent;

          if (user) {
            _context8.next = 7;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            message: 'User not found'
          }));

        case 7:
          // Compare passwords
          createAndSendToken(user, 201, res);

        case 8:
        case "end":
          return _context8.stop();
      }
    }
  });
});
exports.loginWithOtp = catchAsync(function _callee9(req, res, next) {
  var phoneNumber, user;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          phoneNumber = req.body.phoneNumber;

          if (phoneNumber) {
            _context9.next = 3;
            break;
          }

          return _context9.abrupt("return", next(new AppError("Please provide email and OTP.", 400)));

        case 3:
          _context9.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            phoneNumber: phoneNumber
          }));

        case 5:
          user = _context9.sent;

          if (!user) {
            res.status(400).send('Invalid OTP');
          }

          createAndSendToken(user, 201, res);

        case 8:
        case "end":
          return _context9.stop();
      }
    }
  });
});
exports.protect = catchAsync(function _callee10(req, res, next) {
  var token, decode;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          if (req.headers.authorization && req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1];
          }

          if (token) {
            _context10.next = 3;
            break;
          }

          return _context10.abrupt("return", next(new AppError("You are not logged in! Please log in to get access.", 401)));

        case 3:
          _context10.next = 5;
          return regeneratorRuntime.awrap(promisify(jwt.verify)(token, "this-is-my-super-longer-secret"));

        case 5:
          decode = _context10.sent;
          // const freshUser =await User.findById(decode.id)
          // if(!freshUser){
          //   return next(new AppError('user not exist',401))
          // }
          // if(freshUser.changePasswordAfter(decode.iat))
          // {
          //   return next(new AppError('password changed',401))
          // }
          // req.user=freshUser;
          next();

        case 7:
        case "end":
          return _context10.stop();
      }
    }
  });
});

exports.restrictTo = function () {
  for (var _len = arguments.length, roles = new Array(_len), _key = 0; _key < _len; _key++) {
    roles[_key] = arguments[_key];
  }

  return function (req, res, next) {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403));
    }

    next();
  };
};

exports.forgotPassword = catchAsync(function _callee11(req, res, next) {
  var user, resetToken, resetURL, _transporter, _mailGenerator, _email, emailBody, mailOptions, info;

  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }));

        case 2:
          user = _context11.sent;

          if (user) {
            _context11.next = 5;
            break;
          }

          return _context11.abrupt("return", next(new AppError("There is no user with the provided email address.", 404)));

        case 5:
          // 2) Generate the random reset token
          resetToken = user.createPasswordResetToken();
          _context11.next = 8;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 8:
          // 3) Send it to the user's email
          resetURL = "".concat(req.protocol, "://").concat(req.get("host"), "/api/v1/users/reset/").concat(resetToken);
          _context11.prev = 9;
          _transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            // Use false for port 587
            auth: {
              user: "youthbuzz00@gmail.com",
              pass: "viqiqwwdppyjtntd" // Use your Gmail password

            }
          });
          _mailGenerator = new Mailgen({
            theme: 'salted',
            product: {
              name: 'portal.youthbuzz.in',
              link: 'https://yourapp.com'
            }
          }); // Create a Mailgen email template

          _email = {
            body: {
              name: user.name,
              // Customize the recipient's name
              intro: "Forgot your password?",
              action: {
                instructions: "Please reset your password by clicking the button below:",
                button: {
                  color: "#007bff",
                  text: "Reset Your Password",
                  link: "https://portal.youthbuzz.in/reset/".concat(resetToken)
                }
              },
              outro: "If you didn't forget your password, please ignore this email."
            }
          }; // Generate the email HTML using Mailgen

          emailBody = _mailGenerator.generate(_email); // Create email options

          mailOptions = {
            from: 'youthbuzz00@gmail.com',
            to: user.email,
            subject: 'Password Reset',
            html: emailBody
          }; // Send the email

          _context11.next = 17;
          return regeneratorRuntime.awrap(_transporter.sendMail(mailOptions));

        case 17:
          info = _context11.sent;
          console.log('Password reset email sent:', info.response); // Send a response to the client

          res.status(200).json({
            status: "success",
            message: "Token sent to email!"
          });
          _context11.next = 29;
          break;

        case 22:
          _context11.prev = 22;
          _context11.t0 = _context11["catch"](9);
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          _context11.next = 28;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 28:
          return _context11.abrupt("return", next(new AppError("There was an error sending the email. Try again later!"), 500));

        case 29:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[9, 22]]);
});
exports.reset = catchAsync(function _callee12(req, res, next) {
  var hashedToken, user;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          // 1) Get user based on the token
          hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
          _context12.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: {
              $gt: Date.now()
            }
          }));

        case 3:
          user = _context12.sent;

          if (user) {
            _context12.next = 6;
            break;
          }

          return _context12.abrupt("return", next(new AppError("Token is invalid or has expired", 400)));

        case 6:
          user.password = req.body.password;
          user.confirm_password = req.body.confirm_password;
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          _context12.next = 12;
          return regeneratorRuntime.awrap(user.save());

        case 12:
          // 3) Update changedPasswordAt property for the user
          // 4) Log the user in, send JWT
          //   const token=jwt.sign({id:user._id},'this-is-my-super-longer-secret',{
          //     expiresIn:"90d"
          //   })
          //   res.status(200).json({
          //     statusbar:'success',
          //     token
          //   })
          createAndSendToken(user, 200, res);

        case 13:
        case "end":
          return _context12.stop();
      }
    }
  });
});
exports.updatePassword = catchAsync(function _callee13(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.params.id).select("+password"));

        case 2:
          user = _context13.sent;
          _context13.next = 5;
          return regeneratorRuntime.awrap(user.correctPassword(req.body.passwordCurrent, user.password));

        case 5:
          if (_context13.sent) {
            _context13.next = 7;
            break;
          }

          return _context13.abrupt("return", next(new AppError("Your current password is wrong.", 401)));

        case 7:
          // 3) If so, update password
          user.password = req.body.password;
          _context13.next = 10;
          return regeneratorRuntime.awrap(user.save());

        case 10:
          // User.findByIdAndUpdate will NOT work as intended!
          // 4) Log user in, send JWT
          //   const token=jwt.sign({id:user._id},'this-is-my-super-longer-secret',{
          //     expiresIn:"90d"
          //   })
          //   res.status(200).json({
          //     statusbar:'success',
          //     token
          //   })
          createAndSendToken(user, 201, res);

        case 11:
        case "end":
          return _context13.stop();
      }
    }
  });
});
exports.deleteuser = catchAsync(function _callee14(req, res, next) {
  var seller;
  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.next = 2;
          return regeneratorRuntime.awrap(User.findByIdAndDelete(req.params.id));

        case 2:
          seller = _context14.sent;

          if (seller) {
            _context14.next = 5;
            break;
          }

          return _context14.abrupt("return", next(new AppError("No ".concat(seller, " found with that ID"), 404)));

        case 5:
          res.status(204).json({
            status: 'success',
            data: null
          });

        case 6:
        case "end":
          return _context14.stop();
      }
    }
  });
}); // Generate OTP and send email
// exports.sentOtp= async (req, res) => {
//   const { email } = req.body;
//   const generatedOTP = otpGenerator.generate(6, { upperCase: false, specialChars: false });
//   const user = new User({
//     email,
//     otp: generatedOTP,
//     otpExpiry: new Date().getTime() + 5 * 60 * 1000, // OTP valid for 5 minutes
//   });
//   await user.save();
//   const mailOptions = {
//     from: 'your-email@gmail.com',
//     to: email,
//     subject: 'Your OTP Code',
//     text: `Your OTP code is: ${generatedOTP}`,
//   };
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log(error);
//       res.status(500).send('Error sending OTP');
//     } else {
//       console.log('Email sent: ' + info.response);
//       res.send('OTP sent successfully');
//     }
//   });
// }

exports.updateUser = catchAsync(function _callee15(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.next = 2;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.params.id, req.body, {
            "new": true,
            runValidators: true
          }));

        case 2:
          user = _context15.sent;

          if (user) {
            _context15.next = 5;
            break;
          }

          return _context15.abrupt("return", next(new AppError("No seller found with that ID", 404)));

        case 5:
          res.status(201).json({
            status: 'success',
            data: {
              user: user
            }
          });

        case 6:
        case "end":
          return _context15.stop();
      }
    }
  });
});

exports.logout = function (req, res) {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({
    status: 'success'
  });
};