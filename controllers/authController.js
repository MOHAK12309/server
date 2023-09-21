const User = require("../models/userModel");
const { promisify } = require("util");
const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const catchAsync = require("../utils/catchAsync");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const _ = require("lodash");
const axios = require("axios");
const otpGenerator = require("otp-generator");
const { upload } = require("../utils/s3")

const { result, slice } = require("lodash");
const Mailgen = require("mailgen")
const admin = require('firebase-admin');
const verify=require("../models/verify")



// admin.initializeApp({
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

exports.uploadUserPhoto = catchAsync(async (req, res, next) => {


  const uploadSingle = upload("youthbuzzdata", "userData/", "user").single('photo');
  uploadSingle(req, res, async (err) => {
    if (err) {
      return next(new AppError(err.message, 400));
    }
    if (req.file) {
      req.body.photo = req.file.key
    }
    console.log(req.file)
    const blog = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(201).json({
      status: "success",
      message: "Image uploaded successfully",
      data: {
        blog
      }
    })
  })
});

const singnup = (id) => {
  return jwt.sign({ id }, "this-is-my-super-longer-secret", {
    expiresIn: "90d",
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = singnup(user._id);

  res.cookie("jwt", token, {
    expiresIn: new Date(Date.now + 90 * 24 * 60 * 60 * 1000),
    secure: false,
    httpOnly: true,
  });
  res.status(statusCode).json({
    statusbar: "success",
    token,
    data: {
      user,
    },
  });
};



// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: "careerclassroom4@gmail.com",
    pass: "viqiqwwdppyjtntd"
  },
});

// Configure Express session


// API route to register user and send OTP
exports.register = async (req, res) => {
  const { email } = req.body;

  try {
    // Generate OTP
    const otp = otpGenerator.generate(4, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // Store OTP in the session
    req.session.otp = otp;

    // Send OTP email
    const mailOptions = {
      from: 'careerclassroom4@gmail.com',
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP: ${otp}`,

    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      status: "success",
      message: 'OTP sent successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// API route to verify OTP and manage session
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

exports.getOneuser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id)
  res.status(200).json(
    {
      status: "true",
      data: {
        user
      }
    }
  )
})



// exports.signup = catchAsync(async (req, res, next) => {
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
exports.signup2 =catchAsync(async (req, res) => {
  const newUser = await User.create({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    confirm_password: req.body.confirm_password,
    gender: req.body.gender,
    DOB:req.body.DOB,
    phoneNumber:req.body.phoneNumber,
    country:req.body.country

     
    
  });
  // const url = `${req.protocol}://${req.get('host')}/all-services`;
  // await new sendEmail(newUser, url).sendWelcome();
    console.log(newUser);
  createAndSendToken(newUser, 201,  res)
});





exports.resendOTP = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(422).json({
      status: false,
      message: "Please provide your email address.",
    });
  }

  // Check if the user with the provided email exists
  const existingUser = await User.findOne({ email: email });

  if (!existingUser) {
    return res.status(404).json({
      status: false,
      message: "User not found. Please sign up first.",
    });
  }

  // Generate a new OTP and send it via email
  const otp = otpGenerator.generate(4, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "youthbuzz00@gmail.com",
      pass: "viqiqwwdppyjtntd" // generated ethereal password
    },
  });

  const mailGenerator = new Mailgen({
    theme: 'salted', // Choose a Mailgen theme (e.g., 'salted' or 'neopolitan')
    product: {
      name: 'portal.youthbuzz.in',
      link: 'https://yourapp.com',
      // You can customize other product details here
    },
  });

  // Function to send OTP via email
  const sendOTPEmail = () => {
    // Create a Mailgen email template
    const email2 = {
      body: {
        name: existingUser.name, // Customize the recipient's name
        intro: `Your OTP for verification is:${otp}`,
        // code: otp, // Replace with your generated OTP

        outro: 'If you did not request this OTP, please ignore this email.',
      },
    };

    // Generate the email HTML using Mailgen
    const emailBody = mailGenerator.generate(email2);

    // Create email options
    const mailOptions = {
      from: 'careerclassroom4@gmail.com',
      to: email,
      subject: 'OTP Verification',
      html: emailBody,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending OTP email:', error);
      } else {
        console.log('OTP email sent:', info.response);
      }
    });
  };

  // Usage example:
  // Replace with the recipient's email
  // Replace with your generated OTP
  sendOTPEmail();
  // const emailSent = await sendOTPByEmail(email, otp);

  if (!sendOTPEmail) {
    return res.status(500).json({
      status: false,
      message: "Failed to send OTP via email. Please try again later.",
    });
  }

  // Update the user's OTP in the database
  const time = new Date();
  time.setMinutes(time.getMinutes() + 5);

  existingUser.OTP = {
    OTP: otp,
    createdAt: new Date().toLocaleTimeString(),
    expiresAt: time.toLocaleTimeString(),
  };

  await existingUser.save();

  res.status(200).json({
    status: true,
    message: "OTP has been resent successfully.",
  });
});
exports.verify = async (req, res) => {
  const { OTP } = req.body;

  // Assuming 'User' is your model name
  const user = await User.findOne({ 'OTP.OTP': OTP });

  if (!user) {
    res.status(400).send('Invalid OTP');

  } else {
    const currentTime = new Date().getTime();
    const expiresAt = new Date(user.OTP.expiresAt).getTime();

    if (currentTime > expiresAt) {
      res.status(400).send('OTP has expired');
    } else {
      await User.findOneAndUpdate({ 'OTP.OTP': OTP }, { $unset: { OTP: 1 }, verified: true });

      res.status(201).json({
        statusbar: "true"
      })

    }
  }
};








// Start the server

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









exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("incorrect pass and mail"), 401);
  }
  if (!user.verified) {
    // Generate a new OTP for login
    const newOTP = otpGenerator.generate(4, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // Update user's OTP and expiry in the database
   user.OTP = {
      OTP: newOTP,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Set expiry for 5 minutes from now
    };
 
    await user.save()
 

    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "youthbuzz00@gmail.com",
        pass: "viqiqwwdppyjtntd" // generated ethereal password
      },
    });

    const mailGenerator = new Mailgen({
      theme: 'salted', // Choose a Mailgen theme (e.g., 'salted' or 'neopolitan')
      product: {
        name: 'portal.youthbuzz.in',
        link: 'https://yourapp.com',
        // You can customize other product details here
      },
    });
  
    // Function to send OTP via email2
    const sendOTPemail2 = () => {
      // Create a Mailgen email2 template
      const email22 = {
        body: {
           // Customize the recipient's name
          intro: `Your OTP for verification is:${newOTP}`,
          // code: otp, // Replace with your generated OTP
  
          outro: 'If you did not request this OTP, please ignore this email2.',
        },
      };

      const email2Body = mailGenerator.generate(email22);
  
      // Create email2 options
      const mailOptions = {
        from: 'youthbuzz00@gmail.com',
        to: email,
        subject: 'OTP Verification',
        html: email2Body,
      };
  
      // Send the email2
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending OTP email2:', error);
        } else {
          console.log('OTP email2 sent:', info.response);
        }
      });
    };
  
    sendOTPemail2()

    return res.status(200).json({
      status: "false",
      message: "Account is not verified. New OTP has been sent to your email.",
    });
  }

  createAndSendToken(user, 200, res);
  //     const token=jwt.sign({id:user._id},'this-is-my-super-longer-secret',{
  //         expiresIn:'90d'
  //       });
  //     res.status(200).json({
  //     statusbar:'success',
  //     token
  //     })
});
exports.loginWithOtp = catchAsync(async (req, res, next) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return next(new AppError("Please provide email and OTP.", 400));
  }

  const user = await User.findOne({phoneNumber});

  if (!user) {
    res.status(400).send('Invalid OTP');

  } 
  createAndSendToken(user,201,res)

    
  
});


exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
  const decode = await promisify(jwt.verify)(
    token,
    "this-is-my-super-longer-secret"
  );

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
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with the provided email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to the user's email
  const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/reset/${resetToken}`;

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use false for port 587
      auth: {
        user: "youthbuzz00@gmail.com",
        pass: "viqiqwwdppyjtntd", // Use your Gmail password
      },
    });

    const mailGenerator = new Mailgen({
      theme: 'salted',
      product: {
        name: 'portal.youthbuzz.in',
        link: 'https://yourapp.com',
      },
    });

    // Create a Mailgen email template
    const email = {
      body: {
        name: user.name, // Customize the recipient's name
        intro: "Forgot your password?",
        action: {
          instructions: "Please reset your password by clicking the button below:",
          button: {
            color: "#007bff",
            text: "Reset Your Password",
            link: `https://portal.youthbuzz.in/reset/${resetToken}` 
          },
        },
        outro: "If you didn't forget your password, please ignore this email.",
      },
    };

    // Generate the email HTML using Mailgen
    const emailBody = mailGenerator.generate(email);

    // Create email options
    const mailOptions = {
      from: 'youthbuzz00@gmail.com',
      to: user.email,
      subject: 'Password Reset',
      html: emailBody,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.response);

    // Send a response to the client
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});


exports.reset = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.confirm_password = req.body.confirm_password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

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
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.params.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) If so, update password
  user.password = req.body.password;

  await user.save();

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
});

exports.deleteuser = catchAsync(async (req, res, next) => {
  const seller = await User.findByIdAndDelete(req.params.id);

  if (!seller) {
    return next(new AppError(`No ${seller} found with that ID`, 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Generate OTP and send email
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

exports.updateUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!user) {
    return next(new AppError(`No seller found with that ID`, 404))
  }
  res.status(201).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};