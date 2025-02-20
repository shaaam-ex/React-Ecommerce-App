const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview } = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');


const router = express.Router();

router.route('/product').get(getAllProducts); // show products only if logged in
router.route('/product/new').post(isAuthenticatedUser, authorizeRoles('admin'), createProduct);
router.route('/product/:id')
.put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
.delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct)
.get(getProductDetails); // both have the same url

router.route('/review').put(isAuthenticatedUser, createProductReview);
router.route('/reviews').get(getProductReviews).delete(isAuthenticatedUser, deleteReview);

module.exports = router;