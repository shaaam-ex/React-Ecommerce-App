const Product = require('../models/productModel');
const ApiFeatures = require('../utils/apiFeatures');

// Get All Products
exports.getAllProducts = async (req, res, next) => {

    let resultsPerPage = 8;
    let productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultsPerPage);

    const products = await apiFeature.query;
    

    res.status(201).json({
        success: true,
        products
    })
}

// Create Product
exports.createProduct = async (req, res, next) => {
    req.body.user = req.user.id;
    product = await Product.create(req.body)

    res.status(201).json({
        success: true,
        product
    })
}

// Update Product
exports.updateProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id)

    if(!product) {
        return res.status(400).json({
            success: false,
            message: 'Product not found'
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body);

    res.status(201).json({
        success: true,
        product
    })
}

// Delete Product
exports.deleteProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return res.status(400).json({
            success: false,
            message: 'Product not found'
        })
    }

    await product.deleteOne();

    res.status(201).json({
        success: true,
        message: 'Product deleted successfully'
    })
}

// Get product Details
exports.getProductDetails = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return res.status(400).json({
            success: true,
            message: 'Product not found'
        })
    }

    res.status(201).json({
        success: true,
        product
    })
}

// Create a review
exports.createProductReview = async (req, res, next) => {
    let { rating, comment, productId } = req.body;

    let review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString());

    if(isReviewed) {
        product.reviews.forEach(rev => {
            if(rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating,
                rev.comment = comment
            }
        })
    }
    else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach( review => avg+=review.rating );

    product.ratings = avg/product.reviews.length;

    await product.save({
        validateBeforeSave: false
    })

    res.status(200).json({
        success: true
    })
}


// Get all reviews of a single product
exports.getProductReviews = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return res.status(400).json({
            success: true,
            message: 'Product not found'
        })
    }

    res.status(201).json({
        success: true,
        'reviews': product.reviews
    })
}


// delete review
exports.deleteReview = async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if(!product) {
        return res.status(404).json({
            success: false,
            message: 'Review not found'
        })
    }

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query._id.toString());

    let avg = 0;

    reviews.forEach(review => avg += review.rating );

    const ratings = avg/reviews.length;
    const numOfReviews = reviews.length;

    await product.save({
        validateBeforeSave: false
    })

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    },
    {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(201).json({
        success: true
    })
}