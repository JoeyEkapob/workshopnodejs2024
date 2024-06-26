import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
 import App from './App'; 
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter,RouterProvider } from 'react-router-dom'
import SingIn from './pages/backoffice/singin';
import Home from './pages/backoffice/Home';
import Product from './pages/backoffice/product';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SingIn />
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path:'/product',
    element:<Product />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router}/>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
