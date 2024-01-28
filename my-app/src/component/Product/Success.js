import React, { useEffect, useState } from 'react'
import './Success.css'
import { CiCircleCheck } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeItemsFromCart } from '../../actions/cartAction';


const Success = () => {
    const [timer, setTimer] = useState(5);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { cartItems } = useSelector(state => state.cart);
    
    cartItems.forEach(item => {
        dispatch(removeItemsFromCart(item.product))
    })

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);

            if(timer === 1) {
                navigate('/');
                clearInterval(interval);
            }
        }, 1000);
        
        return () => clearInterval(interval);

    }, [timer, navigate]);
    
    return (
        <>
            <div className="success-container">
                <CiCircleCheck className='greenCheck' />
                <h2>Payment Succeeded</h2>
            </div>
            <div className="timer-div">
                <p>Redirecting to Home Page in {timer}s</p>
                <p>If not automatically redirected, <Link style={{color: 'gray', textDecoration: 'none'}} to='/'>Click Here</Link></p>
            </div>
        </>
    )
}

export default Success