import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import HomePage from './components/HomePage/HomePage.jsx';
import Products from './components/Products/Products.jsx';
import { useEffect } from 'react';
import Women from './components/Products/Women.jsx';
import Men from './components/Products/Men.jsx';
import ProductDetails from './components/Products/ProductDetails.jsx';

function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path='/' element={<HomePage />} />
        <Route exact path='/products' element={<Products />} />
        <Route exact path='/products/women' element={<Women />} />
        <Route exact path='/products/men' element={<Men />} />
        <Route exact path='/products/:id' element={<ProductDetails />} />
      </Routes>
    </Router>
  )
}

export default App;