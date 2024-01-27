const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const { Error } = require('mongoose');
const cloudinary = require('cloudinary');

// Register a user
exports.registerUser = catchAsyncErrors(async(req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });
    
    const {name, email, password} = req.body;

    const user = await User.create({
        name, 
        email, 
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    });

    const token = user.getJWTToken();

    res.status(201).json({
        success: true,
        token
    })
})

// Login user
exports.loginUser = catchAsyncErrors(async(req, res, next) => {
    const {email, password} = req.body;

    // Checking if user has given password and email both

    if(!email || !password) {
        return next(new ErrorHandler('Please enter the Email and Password', 401)); // 401 means unauthorized
    }

    const user = await User.findOne({email}).select("+password"); // didn't pass password as password is not visible directly, select will show password too

    if(!user) {
        return next(new ErrorHandler("Invalid Email or password"));
    }

    const isPasswordMatched = await user.comparePassword(password);
    
    if(!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401)); // 401 means unauthorized
    }

    sendToken(user, 200, res);
})


// Logout User
exports.logout = catchAsyncErrors(async(req, res, next) => {

    res.cookie('token', null, { // set cookie to null
        expires: new Date(Date.now()), // to expire now
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: 'Logged Out successfully'
    })
})


// Forgot Password
exports.forgotPassword = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if(!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    // Get Reset Password Token
    const resetToken = user.getResetPasswordToken();

    // wait for token to be saved in db
    await user.save({validateBeforeSave: false});

    // Sending mail
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email, please ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: `The Style Factory password recovery`,
            message
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })
    }
    catch (error) {
        user.resetPasswordToken = undefined; // very important
        user.resetPasswordExpire = undefined; // mandatory for security {both of them}

        await user.save({validateBeforeSave: false})

        return next(new ErrorHandler(error.message, 500))
    }

})


// Reset Password 
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    
    // creating token hash
    
    const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');


    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()} // greater than current time
    })
    console.log(user)

    if(!user) {
        return next(new ErrorHandler('Reset Password Token Expired/Invalid', 404))
    }

    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save()
    console.log(req.body.password)

    sendToken(user, 200, res); // to login automatically
})


// Get all users -- Admin

exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find({});

    res.status(200).json({
        success: true,
        users
    })
})



// Get User Details
exports.getUserDetails = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.user.id);
    console.log("api/v1/me")

    res.status(200).json({
        success: true,
        user
    })
});


// Update User Password
exports.updatePassword = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    if(req.body.newPassword != req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = req.body.newPassword;

    await user.save()

    sendToken(user, 200, res);
});


// Update User Profile
exports.updateProfile = catchAsyncErrors(async(req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    if(req.body.avatar != '') {
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        // delete the image from cloud
        // await cloudinary.v2.uploader.destroy(imageId);

        // console.log(req.body.avatar)

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })


    res.status(200).json({
        success: true,
        user
    })
});


// Get all users -- Admin
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.find({});

    res.status(200).json({
        success: true,
        user
    })
})


// Get single user -- Admin
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorHandler(`User does not exist with the id : ${req.params.id}`));
    }

    res.status(200).json({
        success: true,
        user
    })
})


// Update User Role -- Admin
exports.updateRole = catchAsyncErrors(async(req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })


    res.status(200).json({
        success: true,
        user
    })
});


// Delete User Profile -- Admin
exports.deleteUser = catchAsyncErrors(async(req, res, next) => {

    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorHandler(`User does not exist with id ${req.params.id}`, 400))
    }

    await user.remove()

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })
});


// Create new review or update review
