import './Header.css';
import { Link } from 'react-router-dom';
import { CiUser, CiShoppingCart } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';

const Header = ({ isAuthenticated }) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const { cartItems } = useSelector(state => state.cart);

    
    return (
        <>
            <div className="container-header-main" id='container-header-main'>
                <Link to={'/'}>
                    <div className="left-container-header">
                        <img className='header-main-logo' src="https://raw.githubusercontent.com/NOTAHTI123/react-app-ecommerce-5th-sem/main/ecommerce-app-main/src/assets/images/tsf-logo-header.png" alt="" />
                    </div>
                </Link>

                <div className="middle-container-header">
                    <Link className='clickable-link' to='/'>Home</Link>
                    <Link className='clickable-link' to='/products'>Products</Link>
                    <Link className='clickable-link' to='/'>About</Link>
                </div>

                <div className="right-container-header">
                    <Link className='clickable-link icon-buttons-header' to='/login'><CiUser /></Link>
                    {
                        isAuthenticated ? (
                            <Link className='clickable-link icon-buttons-header' to='/cart'><CiShoppingCart /><span className="cart-item-count">{cartItems.length}</span></Link>
                        ):(<></>)
                    }
                </div>
            </div>
        </>
    )
}

export default Header;