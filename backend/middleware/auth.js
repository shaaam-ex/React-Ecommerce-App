const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.isAuthenticatedUser = catchAsyncErrors(async(req, res, next) => {
    const {token} = req.cookies;
    
    if(!token) {
        return next(new ErrorHandler('Please Login to access this resource', 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET); // verify

    req.user = await User.findById(decodedData.id); // we assigned id in model
    next();
})

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) { // if not admin
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403)) // 403 means refused by server
        }

        next();
    }
}