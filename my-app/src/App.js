import { useEffect } from 'react';
import './App.css';
import Header from './component/layout/Header/Header.js';
import { Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import WebFont from 'webfontloader';
import Home from './component/Home/Home.js';
import Loader from './component/layout/Loader/Loader.js';
import ProductDetails from './component/Product/ProductDetails.js';
import Products from './component/Product/Products.js';
import Search from './component/Product/Search.js';
import LoginSignup from './component/User/LoginSignup.js';
import store from './store.js';
import { loadUser } from './actions/userAction.js';
import { useSelector } from 'react-redux';
import Profile from './component/User/Profile.js';
import UpdateProfile from './component/User/UpdateProfile.js';
import Women from './component/Product/Women.js'
import Men from './component/Product/Men.js'
import UserOptions from './component/layout/Header/UserOptions.js';
import UpdatePassword from './component/User/UpdatePassword.js';
import ForgotPassword from './component/User/ForgotPassword.js';
import ResetPassword from './component/User/ResetPasswrod.js';

function App() {

  const { isAuthenticated, user } = useSelector(state => state.user);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Roboto', 'Droid Sans', 'Chilanka']
      }
    })

    store.dispatch(loadUser());
  }, [])

  
  return (
    <Router>

      <Header />

      {isAuthenticated && <UserOptions user={user} />}

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products/:id' element={<ProductDetails />} />
          <Route path='/products' element={<Products />} />
          <Route path='/products/:keyword' element={<Products />} />
          <Route path='/search' element={<Search />} />

          <Route exact path='/account' element={<Profile />} />

          <Route path='/login' element={<LoginSignup />} />

          <Route exact path='/products/women' element={<Women />} />
          <Route exact path='/products/men' element={<Men />} />

          <Route exact path='/me/update' element={<UpdateProfile />} />
          <Route exact path='/password/update' element={<UpdatePassword />} />
          <Route exact path='/password/forgot' element={<ForgotPassword />} />
          <Route exact path='/api/v1/password/reset/:token' element={<ResetPassword />} />
        </Routes>

    </Router>
  );
}

export default App;
