import {
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    ALL_PRODUCT_FAIL,

    PRODUCT_DETAILS_REQUEST, 
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
}
from '../constants/productConstants';

import axios from 'axios';

export const getProduct = (keyword="", currentPage=1, price=[0,25000],category, ratings=0) => async(dispatch) => {
    try {
        dispatch({
            type: ALL_PRODUCT_REQUEST
        })
        

        if(JSON.stringify(keyword) !== '{}') {
            keyword = keyword['keyword']
        }

        let link;

        if(category) {
            link = `http://localhost:4000/api/v1/product?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}&category=${category}`;
        }

        else {
            link = `http://localhost:4000/api/v1/product?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;
        }

        const { data } = await axios.get(link);

        dispatch({
            type: ALL_PRODUCT_SUCCESS,
            payload: data
        })
    }
    catch(error) {
        dispatch({
            type: ALL_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getProductDetails = (id) => async(dispatch) => {

    try {
        dispatch({
            type: PRODUCT_DETAILS_REQUEST
        })

        const { data } = await axios.get(`http://localhost:4000/api/v1/product/${id}`);
        
        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data.product
        })
    } catch (error) {
        dispatch({ // takes an action object as an argument
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
};