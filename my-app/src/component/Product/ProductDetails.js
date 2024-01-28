import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProductDetails } from '../../actions/productAction';
import { Link } from 'react-router-dom';
import './ProductDetails.css';
import Carousel from 'react-material-ui-carousel';
import ReactStars from 'react-rating-stars-component';
import MetaData from '../layout/MetaData';
import { clearErrors } from '../../actions/productAction';
import { addItemsToCart } from '../../actions/cartAction';
import { useAlert } from 'react-alert';
import ReviewCard from './ReviewCard.js';

const ProductDetails = () => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const [tempLoad, setTempLoad] = useState(true);

    const { id } = useParams();
    const { product, loading, error } = useSelector((state) => state.productDetails);

    useEffect(() => {
        if(error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProductDetails(id));
    }, [dispatch, id, error]);

    let options = {
        edit: false, // To not allow edit to stars
        color: 'rgba(20,20,20,0.1)',
        activeColor: 'tomato',
        value: product.ratings,
        size: window.innerWidth < 600 ? 20 : 25,
        isHalf: true, // To allow half stars to be shown
    };

    const [quantity, setQuantity] = useState(1);

    function increaseQuantity() {
        setQuantity(quantity<product.Stock?quantity+1:quantity)
    }

    function decreaseQuantity() {
        quantity > 1 ? setQuantity(quantity-1) : setQuantity(1)
    }
    
    const addToCartHandler = (e) => {
        e.preventDefault();
        dispatch(addItemsToCart(id, quantity));
        alert.success("Item Added To Cart Successfully")
    }

    return (
        loading ? (<h1>Loading</h1>) : (
            <>
                {product ? (
                    <>
                        <div className='product-details'>
                        <MetaData title={`${product.name}`} />
                        <div className="image-container-product-details">
                            <Carousel>
                                {product.images &&
                                    product.images.map((item, i) => (
                                        <img className="CarouselImage" key={i} src={item.url} alt={`${i} Slide`} />
                                    ))}
                            </Carousel>
                        </div>
                        <div className="product-details-main">
                            <div className="name-product-details">
                                <h2>{product.name}</h2>
                            </div>
                            <div className="sku-code-product-details">
                                <h3>SKU: {product.description}</h3>
                            </div>
                            <div className="rating-product-details">
                                <ReactStars {...options} />
                                <span className="detailsBlock-2-span"> ({product.numOfReviews} Reviews)</span>
                            </div>
                        </div>
                        <div className="user-actions-product-details">
                            <h2>Rs. {product.price}</h2>
                            <h3>Quantity</h3>
                            <div className="quantity-user-actions-product-details">
                                <p onClick={decreaseQuantity} style={{userSelect: 'none'}}>{'<'}</p>
                                <input type="text" name="" style={{textAlign: 'center', fontWeight: 'bold'}} className='selected-quantity-user-product-details' value={quantity} id="selected-quantity-user-product-details" />
                                <p onClick={increaseQuantity} style={{userSelect: 'none'}}>{'>'}</p>
                            </div>
                            <div className='product-stock-status-div'>
                                {
                                    product.Stock > 0 ? (<div>Status: <span style={{color: 'green', fontWeight: 'bold'}}>In Stock</span></div>)
                                    : (<div>Status: <span style={{color: 'red', fontWeight: 'bold'}}>Out of Stock</span></div>)
                                }
                            </div>
                            <Link onClick={addToCartHandler} className='add-to-cart-button-product-details'>Add to Cart</Link>
                        </div>  
                    </div>
                    <h3 className='reviewsHeading'>Reviews</h3>

                    {
                        product.reviews && product.reviews[0] 
                        ?(
                        <div className='reviews'>
                            {
                            product.reviews &&
                            product.reviews.map((review) => <ReviewCard review={review} />)
                            }
                        </div>
                        ): (
                            <p className='noReviews'>No Reviews Yet</p>
                        )
                    }
                    </>
                ) : (
                    <p>Product not found</p>
                )}
            </>
        )
    )
}

export default ProductDetails;
