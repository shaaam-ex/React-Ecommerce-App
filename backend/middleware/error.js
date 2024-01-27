const ErrorHandler = require('../utils/errorHandler');

module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500; // If statusCode doesn't exist then error status set to 500
    err.message = err.message || "Internal Server Error";

    // Wrong Mongodb Id error
    if(err.name === 'CastError') {
        const message = `Resource not found, Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400); // 400 means bad request
    }

    // Mongoose duplicate key error 
    if(err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message, 400); // 400 means bad request
    }

    
    // Wrong JWT error
    if(err.name === 'JsonWebTokenError') {
        const message = `JSON Web Token is invalid, try again!`
        err = new ErrorHandler(message, 400); // 400 means bad request
    }


    // JWT Expire error
    if(err.name === 'TokenExpiredError') {
        const message = `JSON Web Token is Expired, try again!`
        err = new ErrorHandler(message, 400); // 400 means bad request
    }

    

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
}
