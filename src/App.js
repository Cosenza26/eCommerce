import React, { useState, useEffect } from 'react'
import {commerce} from "./lib/commerce"
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";



import { Products, Navbar, Cart, Checkout} from "./components"

const App = () => {

  // initialize variable to store all the items from commercejs
  const [products, setProducts] = useState([]);

  // initialize cart for all items that are currently in the cart
  const [cart, setCart] = useState([]);

  // initialize to get all the information needed to complete transaction
  const [order, setOrder] = useState({});
  
  // initialize to display error message if there was an error during the transaction process
  const [errorMessage, setErrorMessage] = useState('');


  // API call to get all items from commercejs
  const fetchProducts = async () => {
      const { data } = await commerce.products.list();

      setProducts(data);
      console.log(products);

  }

  // API call to get all the items inside the cart from commercejs

  const fetchCart = async () => {
    

    setCart(await commerce.cart.retrieve());

}

// function adds new item to cart

const handleAddToCart = async (productId, quantity) => {
  const { cart } = await commerce.cart.add(productId, quantity);

  setCart(cart);
}

// function updates the quantity of the selected item from the cart
const handleUpdateCartQty = async (productId, quantity) =>  {
  const {cart } = await commerce.cart.update( productId, {quantity} );
  setCart(cart);
}

// function removes selected item from the cart

const handleRemoveFromCart = async (productId) =>  {
  const {cart } = await commerce.cart.remove( productId);
  setCart(cart);
}

//function empties the cart
const handleEmptyCart = async () =>  {
  const {cart } = await commerce.cart.empty();
  setCart(cart);
}

// function is used to clear the cart after a successful order 
const refreshCart = async () => {
  const newCart = await commerce.cart.refresh();

  setCart(newCart);
}

// 

const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
  try{
    const incomingOrder = await commerce.checkout.capture( checkoutTokenId, newOrder);
    setOrder(incomingOrder);
    
    refreshCart();
  } catch (error) {
      setErrorMessage(error.data.error.message);

  }
}



  // API calls when the website first renders
  // Stops from requesting after each render
  useEffect(() => {
    fetchProducts();
    fetchCart();

  },[]);

 

  return (
    
    <Router>

      <div>
      
          <Navbar totalItems = {cart.total_items}/>

         



        
        <Routes>
          
            <Route  path="/" element={<Products products={products} onAddToCart={handleAddToCart}/>} />
            <Route path='/cart' element={<Cart cart={cart} handleUpdateCartQty={handleUpdateCartQty} handleEmptyCart={handleEmptyCart} handleRemoveFromCart={handleRemoveFromCart}/>} />
            <Route  path="/checkout" element={<Checkout order={order} onCaptureCheckout={handleCaptureCheckout} error={errorMessage} cart={cart} />} />
          
        </Routes>
      
      </div>
    </Router>
    
  )
}

export default App;