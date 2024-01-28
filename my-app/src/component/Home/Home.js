import './HomePage.css';
import { Link, useParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { getProduct, clearErrors } from '../../actions/productAction';
import axios from 'axios';
import ReactStars from 'react-rating-stars-component';
import Loader from '../layout/Loader/Loader';


const HomePage = () => {
    const [ isLoading, setLoading ] = useState(true);

    useEffect(() => {
        document.getElementById('container-header-main').style.visibility ='visible';
    }, [])

    const dispatch = useDispatch(); // to send data

    const [products, setProducts] = useState([]);

    const getData = async() => {
        setLoading(true);
        const temp = await axios.get(`http://localhost:4000/api/v1/product?keyword=&page=1&price[gte]=0&price[lte]=25000&ratings[gte]=0&category=Women`);
        setProducts(temp.data['products'])
        setLoading(false);
    }

    useEffect(() => {
        getData();
    }, [])




    return (
        isLoading?(<Loader />)
        :(
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
                    <Link to='/products' className='view-more-button'>View More</Link>
                </section>
            </div>
        </>
        )
    )
}

export default HomePage;