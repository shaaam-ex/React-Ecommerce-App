import './HomePage.css';
import { Link, useParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { getProduct } from '../../actions/productAction';


const HomePage = () => {

    useEffect(() => {
        document.getElementById('container-header-main').style.visibility ='visible';
    }, [])

    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 25000]);
    const [category, setCategory] = useState('Women');

    const [ratings, setRatings] = useState(0);

    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    }

    const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
    } 

    const { products, loading, error, productsCount, resultPerPage } = useSelector(state => state.products);

    const keyword = useParams();

    useEffect(() => {
        dispatch(getProduct(keyword, currentPage, price, category, ratings))
    }, [dispatch, keyword, currentPage, price, category, ratings, productsCount]);




    return (
        <>
            <div className="main-container-home">
                <section className="main-banner-home">
                    <img src="https://raw.githubusercontent.com/NOTAHTI123/react-app-ecommerce-5th-sem/main/ecommerce-app-main/src/assets/images/main-woman-banner.jpg" alt="" />
                </section>

                <section className='products-container-home'>
                    <h2>Available Products</h2>
                    <div className='products-main-container'>
                        {
                            products.map(product => (
                                <div key={product._id} className="product-card">
                                    <img src={product.images[0].url} alt="" />
                                    <h3>{product.name}</h3>
                                    <p>Price: {product.price}rs</p>
                                </div>
                            ))
                        }
                    </div>
                    <Link to='/products' className='view-more-button'>View More</Link>
                </section>
            </div>
        </>
    )
}

export default HomePage;