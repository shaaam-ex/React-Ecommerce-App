import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProduct, getProductDetails } from '../../actions/productAction';


const ProductDetails = () => {
    const dispatch = useDispatch();

    const { id } = useParams();

    useEffect(() => {
        dispatch(getProductDetails(id));
    }, [dispatch, id])

    const { product, loading, error } = useSelector((state) => state.productDetails);


    return (
        <div>
            <img src={product.images[0].url} alt="" />
        </div>
    )
}

export default ProductDetails