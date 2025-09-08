import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import React, { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from "./context/CartContext";

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const CategoryPage = lazy(() => import('./pages/Category'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const AddProductPage = lazy(() => import('./pages/AddProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
const OrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));



function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <CartProvider>
          <Navbar/>
          <Suspense fallback={<div style={{textAlign:'center',marginTop:40}}>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/categories" element={<CategoryPage />} />
              <Route path="/user" element={<UserProfilePage />} />
              <Route path="/add-product" element={<AddProductPage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/orders" element={<OrderHistoryPage />} />
              <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
            </Routes>
          </Suspense>
          <Footer/>
        </CartProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
