
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Women_Men.css';
import { useParams } from 'react-router-dom';
import { getProduct } from '../../actions/productAction';
import { Link } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component';

const Men = () => {

    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 25000]);
    const [category, setCategory] = useState("Men");

    const [ratings, setRatings] = useState(0);

    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    }

    const priceHandler = (event) => {
        if(event.currentTarget.id == 'start-price') {
            setPrice([event.target.value ? event.target.value : 0, Number(document.getElementById('limit-price').value) ])
        }

        else if(event.currentTarget.id == 'limit-price') {
            setPrice([Number(document.getElementById('start-price').value) , event.target.value ? event.target.value : 25000])
        }
    } 

    const keyword = useParams();

    useEffect(() => {
        dispatch(getProduct(keyword, currentPage, price, category, ratings));
    }, [dispatch, keyword, currentPage, price, category, ratings]);

    useEffect(() => {
        document.getElementById('container-header-main').style.visibility ='visible';
    }, [])

    const { products, loading, error, productsCount, resultPerPage } = useSelector(state => state.products);

    return (
        <div className='container'>
            <h2>Men Clothing</h2>
            <div className="main-container">
                <div className="left-div">
                    <h3>Filters</h3>
                    <div className="first-div-options">
                        <h4>Price</h4>
                        <div className="first-div-options-price-filter">
                            <input onChange={priceHandler} defaultValue={0} type="text" name="" id="start-price" placeholder='from' />
                            <p>to</p>
                            <input onChange={priceHandler} defaultValue={25000} type="text" name="" id="limit-price" placeholder='to' />
                        </div>
                    </div>
                </div>
                <div className="main-products-container">
                    {
                        products.map(product => (
                            <Link style={{textDecoration: 'none', color: 'black'}} to={`/products/${product._id}`} key={product._id}>
                                <div key={product._id} className="product-card">
                                    <img src={product.images[0].url} alt="" />
                                    <h3>{product.name}</h3>
                                    <p>Price: {product.price}rs</p>
                                        <ReactStars edit={false} color='rgba(20,20,20,0.1)' activeColor='tomato' value={product.ratings} size={window.innerWidth < 600 ? 20 : 25} isHalf={true} />
                                </div>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Men;