const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

// Create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(201).json({
        success: true,
        order
    })

})


// Get single Order
exports.getSingleOrder = catchAsyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email'); // using 'user', it searches the user DB with the user Id and get his/her name and email

    if(!order) {
        return next(new ErrorHandler('Order not found with this id', 404))
    }

    res.status(200).json({
        success: true,
        order
    })
})

// Get logged in User Order
exports.myOrders = catchAsyncErrors(async(req, res, next) => {
    const orders = await Order.find({user: req.user._id});


    res.status(200).json({
        success: true,
        orders
    })
})

// Get all Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async(req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount+=order.totalPrice
    })


    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

// Update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order) {
        return next(new ErrorHandler('Order not found with this id', 404));
    }
    
    if(order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('You have already delivered this order', 400))
    }

    order.orderItems.forEach(async(o) => {
        await updateStock(o.product, o.quantity)
    });

    order.orderStatus = req.body.status;
    
    if(req.body.status === 'Delivered') {
        order.deliveredAt = Date.now();
    }

    await order.save({
        validateBeforeSave: false
    })


    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
});

// Delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order) {
        return next(new ErrorHandler('Order not found with this id', 404));
    }
    
    await order.remove();


    res.status(200).json({
        success: true
    })
})

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    
    product.stock -= quantity;

    await product.save({
        validateBeforeSave: false
    })
}