import { useEffect } from 'react';
import './Products.css';
import { Link } from 'react-router-dom';

const Products = () => {
    const hideNav = () => {
        document.getElementById('container-header-main').style.visibility ='hidden';
    }

    const fadeIt = (event) => {
        if(event.currentTarget.id == 'women') {
            document.getElementById('women').style.opacity=0.7;
        }

        else if(event.currentTarget.id == 'men') {
            document.getElementById('men').style.opacity=0.7;
        }
    }
    
    const removeFade = (event) => {
        document.getElementById('men').style.opacity=1;
        document.getElementById('women').style.opacity=1;
    }
    useEffect(()=>{hideNav()}, [])
    return (
        <>
            <div className="main-container-products">
                <div id='women' className="products" onMouseLeave={e => removeFade(e)} onMouseEnter={e => fadeIt(e)}>
                    <img className='main-image-products' src="https://mohagni.com/cdn/shop/files/MGL-11_1_Custom.jpg?v=1703597797&width=1946" alt="" />
                    <Link className='navigate-button-products' to='/products/women'>Browse Women</Link>
                </div>

                <div id='men' className="products" onMouseLeave={e => removeFade(e)} onMouseEnter={e => fadeIt(e)}>
                    <img className='main-image-products' src="https://uniworthdress.com/uploads/product/5e7e072089200a273e943fe8c08d2e05.jpg" alt="" />
                    <Link className='navigate-button-products' to='/products/men'>Browse Men</Link>
                </div>
            </div>
        </>
    )
}

export default Products