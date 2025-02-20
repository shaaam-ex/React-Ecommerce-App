import React from 'react'
import './ConfirmOrder.css'
import CheckoutSteps from './CheckoutSteps'
import { useSelector } from 'react-redux'
import MetaData from '../layout/MetaData'
import { Link, useNavigate } from 'react-router-dom'
import { Typography } from '@material-ui/core'


const ConfirmOrder = () => {

    const navigate = useNavigate();
    
    const { shippingInfo , cartItems } = useSelector(state => state.cart);
    const user = useSelector(state => state.user);

    const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)
    const shippingCharges = subtotal > 1500 ? 0 : 250
    const tax = subtotal * 0.25
    const totalPrice = subtotal + shippingCharges + tax

    const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`

    const proceedToPayment = () => {
        const data = {
            subtotal,
            shippingCharges,
            tax,
            totalPrice
        };

        // for the tab
        sessionStorage.setItem('orderInfo', JSON.stringify(data));

        navigate('/process/payment');
    }
    return (
        <>
            <MetaData title='Confirm Order' />
            <CheckoutSteps activeStep={1} />
            <div className='confirmOrderPage'>
                <div>
                    <div className="confirmShippingArea">
                        <Typography>Shipping Info</Typography>
                        <div className='confirmShippingAreaBox'>
                            <div>
                                <p>Name:</p>
                                <span>{user.user.name}</span>
                            </div>
                            
                            <div>
                                <p>Phone:</p>
                                <span>{shippingInfo.phoneNo}</span>
                            </div>

                            <div>
                                <p>Address:</p>
                                <span>{address}</span>
                            </div>
                        </div>

                        <div className="confirmCartItems">
                            <Typography>Your Cart Items:</Typography>
                            <div className="confirmCartItemsContainer">
                                {
                                    cartItems && 
                                    cartItems.map(item => (
                                        <div key={item.product}>
                                            <img src={item.image} alt="Product" />
                                            <Link to={`/product/${item.product}`}>
                                                {item.name}
                                            </Link>

                                            <span>
                                                {item.quantity} X Rs. {item.price} = {" "}
                                                <b>Rs. {item.price * item.quantity}</b>
                                            </span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className='orderSummary'>
                    <Typography>Order Summary</Typography>
                    <div>
                        <div>
                            <p>Subtotal:</p>
                            <span>Rs. {subtotal}</span>
                        </div>

                        <div>
                            <p>Shipping Charges:</p>
                            <span>Rs. {shippingCharges}</span>
                        </div>

                        <div>
                            <p>GST:</p>
                            <span>Rs. {tax}</span>
                        </div>

                        <div className="orderSummaryTotal">
                            <p>
                                <b>Total:</b>
                            </p>
                            <span>Rs. {totalPrice}</span>
                        </div>
                        <button onClick={proceedToPayment}>Proceed To Payment</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConfirmOrder