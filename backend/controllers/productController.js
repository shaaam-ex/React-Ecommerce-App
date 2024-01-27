const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apifeatures');



// Creating a Product -- Only For Admin
exports.createProduct = catchAsyncErrors(async(req,res,next) => {
    req.body.user  = req.user.id; // to store who created the product
    const product = await Product.create(req.body);

    console.log(req.body)
    res.status(201).json({
        success:true,
        product
    })
}
)

// Get all products
exports.getAllProducts = catchAsyncErrors(async(req, res) => {
    // Now we will use Pagination to show products on different pages
    const resultPerPage = 8; // 8 results per pages
    const productsCount = await Product.countDocuments(); // get's count of products

    const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
    
    // let products = await apiFeature.query;
    // let filteredProductsCount = product.length;

    // apiFeature.pagination(resultPerPage);

    const products = await apiFeature.query;
    
    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        // filteredProductsCount
    })
})

// Update Product -- Only For Admin
exports.updateProduct = catchAsyncErrors(async(req,res,next) => {
    let product = await Product.findById(req.params.id)

    if(!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    // If found
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        product
    })
})


// Delete Product -- Admin
exports.deleteProduct = catchAsyncErrors(async(req,res,next) => {
    let product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    // If found

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
})


// Get Single product Details
exports.getProductDetails = catchAsyncErrors(async(req,res,next) => {
    let product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    // If found

    res.status(200).json({
        success: true,
        product
    })
});


// Create New Review or update
exports.createProductReview = catchAsyncErrors(async(req,res,next) => {

    const {rating, comment, productId} = req.body
    const review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating), // convert to number
        comment
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString()); // finds if the current user has made a review already

    if(isReviewed) {
        product.reviews.forEach(rev => {

            if(rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating,
                rev.comment = comment
            }

        })
    }
    else{
        product.reviews.push(review); // add review
        product.numOfReviews = product.reviews.length;
    }

    // finding average review ratings

    let avg = 0;

    product.reviews.forEach(rev => {
        avg += rev.rating
    });

    product.ratings = avg/product.reviews.length;

    await product.save({
        validateBeforeSave: false
    });

    res.status(200).json({
        success: true
    })

})



// Get All Reviews of a single product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if(!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    res.status(201).json({
        success: true,
        reviews: product.reviews
    });
})


// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if(!product) {
        return next(new ErrorHandler('Product not found', 404));
    }


    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString())

    // Update Rating
    let avg = 0;

    reviews.forEach(rev => {
        avg += rev.rating
    });

    const ratings = avg/reviews.length;
    const numOfReviews = reviews.length;

    await product.save({
        validateBeforeSave: false
    });


    await Product.findByIdAndUpdate(req.query.productId, 
        {
            reviews,
            ratings,
            numOfReviews
        }, 

        {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

    //

    res.status(201).json({
        success: true
    });
})