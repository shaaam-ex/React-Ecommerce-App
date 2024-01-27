import React, { useState } from 'react'
import './Search.css';
import { useNavigate } from 'react-router-dom';
import MetaData from '../layout/MetaData';

const Search = ({ history }) => {

    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        if(keyword.trim()) { // trim to remove spaces
            navigate(`/products/${keyword}`);
        }
        else{
            navigate('/products')
        }
    };

    return (
        <>
        <MetaData title={'Search'} />
            <form className='searchBox' onSubmit={searchSubmitHandler}>
                <input
                type='text'
                placeholder='Search a Product ...'
                onChange={(e) => setKeyword(e.target.value)}
                />

                <input type='submit' value='Search' />

            </form>
        </>
    )
}

export default Search