const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); 

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [30, 'Name cannot exceed 30 characters'],
        minLength: [4, 'Name should have more than 4 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minLength: [8, 'Password should be of at least 8 characters'],
        select: false, // Doesn't allow anyone to search for password
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

userSchema.pre("save", async function(next){ // event
    if(!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
})

// JWT Token // To generate and store token in cookie
userSchema.methods.getJWTToken = function () {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    }) // making token
}

// Generate Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString('hex'); // of 20 bytes, hex to convert garbage to string
    const tokenCrypto = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');


    // Hashing and adding to userSchema
    this.resetPasswordToken = tokenCrypto
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes to milliseconds

    return resetToken;
}

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password); // this.password is the hashed one
}

module.exports = mongoose.model('User', userSchema);