const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary');

// Register User
exports.registerUser = async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: 'scale'
    })
    const { name, email, password } = req.body;

    let user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: 'temp_id',
            url: 'temp_url'
        }
    });

    user = user.getJWTToken();

    res.status(201).json({
        success: true,
        token
    })
}

// Login User 
exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(401).json({
            message: 'Please Enter email and password'
        })
    }

    const user = await User.findOne({email}).select('+password');

    if(!user) {
        return res.status(201).json({
            message: 'Invalid Email or Password'
        })
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return res.status(201).json({
            message: 'Invalid Email or Password'
        })
    }

    sendToken(user, 200, res);
}

// Logout User
exports.logout = async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: 'Logged Out Successfully'
    })
}

// Forgot Password
exports.forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if(!user) {
        return res.status(404).json({
            message: 'User not found'
        })
    }

    const resetToken = user.getResetPasswordtoken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is : - \n\n ${resetPasswordUrl} \n\n If you have not requested this email, please ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'The Style Factory password recovery',
            message
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })
    }
    catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false})

        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// Reset Password
exports.resetPassword = async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    })

    if(!user) {
        return res.status(404).json({
            success: false,
            message: 'Reset Password Token expired'
        })
    }

    if(req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Passwords do not match'
        })
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    sendToken(user, 200, res);
}

// Get All users -- Admin
exports.getAllUser = async (req, res, next) => {
    const users = await User.find({});

    res.status(200).json({
        success: true,
        users
    })
}

// Get User Details
exports.getUserDetails = async(req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
};

// Update Password
exports.updatePassword = async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched) {
        return res.status(400).json({
            success: false,
            message: 'Old Password is incorrect'
        })
    }

    if(req.body.newPassword != req.body.confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Passwords do not match'
        })
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
}

// Update Profile
exports.updateProfile = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    if(req.body.avatar != '') {
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: 'scale'
        })

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
}


// Get All Users -- Admin
exports.getAllUser = async (req, res, next) => {
    const user = await User.find({});

    res.status(200).json({
        success: true,
        user
    })
}


// Get single user -- Admin
exports.getSingleUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(res.json({success: false, message: `User with the id ${req.params.id} not found`}));
    }

    res.status(200).json({
        success: true,
        user
    })
}


// Update User Role -- Admin
exports.updateRole = async (req, res, next) => {
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
}

// Delete User Profile -- Admin
exports.deleteUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) {
        return res.status(400).json({
            success: false,
            message: `User does not exist with the id ${req.params.id}`
        })
    }

    await user.remove();

    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    })
}