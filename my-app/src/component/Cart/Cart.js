import React from 'react'
import './Cart.css'
import CartItemCard from './CartItemCard.js'
import { useDispatch, useSelector } from 'react-redux'
import { addItemsToCart, removeItemsFromCart } from '../../actions/cartAction.js'
import { Typography } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom'
import { RemoveShoppingCart } from '@material-ui/icons';


const Cart = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { cartItems } = useSelector(state => state.cart);

    const increaseQuantity = (id, quantity, stock) => {
        quantity = quantity < stock ? quantity+1:quantity
        dispatch(addItemsToCart(id, quantity));
        return;
    }

    const decreaseQuantity = (id, quantity, stock) => {
        quantity = quantity > 1 ? quantity-1 : 1;
        dispatch(addItemsToCart(id, quantity));
        return;
    }

    const deleteCartItem = (id) => {
        dispatch(removeItemsFromCart(id))
    }

    const checkoutHandler = () => {
        navigate('/login?redirect=shipping');
    }

    return (
        <>
            {
                cartItems.length===0 ? (
                    <div className='emptyCart'>
                        <RemoveShoppingCart />

                        <Typography>No Products in your cart</Typography>
                        <Link to='/products'>View Products</Link>
                    </div>
                )
                :
                (
                    <>
            <div className='cartPage'>
                <div className='cartHeader'>
                    <p>Product</p>
                    <p>Quantity</p>
                    <p>Subtotal</p>
                </div>

                {
                    cartItems && cartItems.map(item => (
                        <div key={item.product} className='cartContainer'>
                            <CartItemCard item={item} deleteCartItem={deleteCartItem} />
                            <div className='cartInput'>
                                <button onClick={() => decreaseQuantity(item.product, item.quantity, item.stock)}>-</button>
                                <input type='number' value={item.quantity} readOnly />
                                <button onClick={() => increaseQuantity(item.product, item.quantity, item.stock)}>+</button>
                            </div>
                            <p className='cartSubtotal'>{`Rs. ${item.price*item.quantity}`}</p>
                        </div>
                    ))
                }

                <div className='cartGrossTotal'>
                    <div></div>
                    <div className='cartGrossTotalBox'>
                        <p>Gross total</p>
                        <p>{`Rs. ${cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)}`}</p>
                    </div>
                    <div></div>
                    <div className='checkOutBtn'>
                        <button onClick={checkoutHandler}>Check Out</button>
                    </div>
                </div>
            </div>
        </>
                )
            }
        </>
    )
}

export default Cart