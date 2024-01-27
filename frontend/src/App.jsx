import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import HomePage from './components/HomePage/HomePage.jsx';
import Products from './components/Products/Products.jsx';
import { useEffect } from 'react';
import Women from './components/Products/Women.jsx';
import Men from './components/Products/Men.jsx';
import ProductDetails from './components/Products/ProductDetails.jsx';
import { useDispatch, useSelector } from 'react-redux';
import store from './store.js';
import { loadUser } from './actions/userAction.js';
import LoginSignup from './components/User/LoginSignup.jsx';
import Profile from './components/User/Profile.jsx';

function App() {

  const { isAuthenticated, user } = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch])

  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path='/' element={<HomePage />} />
        <Route exact path='/products' element={<Products />} />
        <Route exact path='/products/women' element={<Women />} />
        <Route exact path='/products/men' element={<Men />} />
        <Route exact path='/products/:id' element={<ProductDetails />} />
        <Route exact path='/login' element={<LoginSignup />} />
        <Route exact path='/account' element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default App;