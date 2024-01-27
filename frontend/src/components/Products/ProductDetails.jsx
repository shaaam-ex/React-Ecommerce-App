import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProductDetails } from '../../actions/productAction';
import { Link } from 'react-router-dom';
import './ProductDetails.css';

const ProductDetails = () => {
    const dispatch = useDispatch();
    const [tempLoad, setTempLoad] = useState(true);

    const { id } = useParams();

    useEffect(() => {
        dispatch(getProductDetails(id));
        setTempLoad(false);
    }, [dispatch, id]);

    const { product, loading, error } = useSelector((state) => state.productDetails);

    return (
        tempLoad ? (<h1>Loading</h1>) : (
            <>
                {product ? (
                    <div className='product-details'>
                        <div className="image-container-product-details">
                            <img src={product.images && product.images[0] && product.images[0].url} alt="" />
                        </div>
                        <div className="product-details-main">
                            <div className="name-product-details">
                                <h2>{product.name}</h2>
                            </div>
                            <div className="sku-code-product-details">
                                <h3>SKU: {product.description}</h3>
                            </div>
                            <div className="rating-product-details">
                                <h5>Rating Here</h5>
                            </div>
                        </div>
                        <div className="user-actions-product-details">
                            <h2>Rs. {product.price}</h2>
                            <h3>Quantity</h3>
                            <div className="quantity-user-actions-product-details">
                                <p>{'<'}</p>
                                <input type="text" name="" className='selected-quantity-user-product-details' defaultValue={1} id="selected-quantity-user-product-details" />
                                <p>{'>'}</p>
                            </div>
                            <Link className='add-to-cart-button-product-details'>Add to Cart</Link>
                        </div>
                    </div>
                ) : (
                    <p>Product not found</p>
                )}
            </>
        )
    )
}

export default ProductDetails;
