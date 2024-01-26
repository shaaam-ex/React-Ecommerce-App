const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please enter the product name']
    },
    description: {
        type: String,
        required: [true, 'Please enter the product description']
    },
    price: {
        type: Number,
        maxLength: [8, 'Price cannot exceed 8 characters'], // 8 is the figure
        required: [true, 'Please enter the product price']
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [ // an array
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, 'Please add the product category']
    },
    Stock: {
        type: Number,
        required: [true, 'Please enter the product stock'],
        maxLength: [4, 'Stock cannot exceed 4 digits'],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [ // an Array
        {
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String
            },
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'user',
                required: true
            },
        }
    ],

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Product", productSchema);