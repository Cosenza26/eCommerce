import React from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, CardContent, ElementsConsumer, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import Review from './Review'



// collects credit/debit card information using stripe


const PaymentForm = ({ checkoutToken, backStep, shippingData, onCaptureCheckout, nextStep }) => {
  console.log(shippingData.email);
  console.log(shippingData.firstName);
  console.log("US-" + shippingData.shippingState);
  console.log( shippingData.shippingOption);
  
  
  

    const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
    const handleSubmit = async (event, elements, stripe) => {
        event.preventDefault();

        

        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);

        //const { paymentMethod, error } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });

        const {token, error} = await stripe.createToken(cardElement);
        
        if(error){
            console.log(error);

        } else {
            const orderData ={
                list_items: checkoutToken.live.line_items,
                customer: {firstname: shippingData.firstName, lastname: shippingData.lastName, email: shippingData.email},
                shipping: { 
                  name: shippingData.firstName, 
                  street: shippingData.address1, 
                  town_city: shippingData.city, 
                  county_state: 'US-' + shippingData.shippingState, 
                  postal_zip_code: shippingData.zip,
                  country: 'US',

                },
                fulfillment: {shipping_method: shippingData.shippingOption},
                billing: {
                  name: shippingData.firstName, 
                  street: shippingData.address1, 
                  town_city: shippingData.city, 
                  county_state: 'US-' + shippingData.shippingState, 
                  postal_zip_code: shippingData.zip,
                  country: 'US',
              },
            
              payment: {
                gateway: 'test_gateway',
                card: {
                  number: '4242424242424242',
                  expiry_month: '02',
                  expiry_year: '24',
                  cvc: '123',
                  postal_zip_code: '94107',
                }
              }

            }
            onCaptureCheckout(checkoutToken.id, orderData);
            //timeout();
            nextStep();

            
        }
    }
  
    // displays payment form 
    return (
    <>
    <Review checkoutToken={checkoutToken} />
    <Divider />
    <Typography variant="h6" gutterBottom style={{ margin: '20px 0' }}>Payment method</Typography>
    <Elements stripe={stripePromise}>
      <ElementsConsumer>{({ elements, stripe }) => (
        <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
          <CardElement />
          <br /> <br />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={backStep}>Back</Button>
            <Button type="submit" variant="contained" disabled={!stripe} color="primary">
              Pay {checkoutToken.live.subtotal.formatted_with_symbol}
            </Button>
          </div>
        </form>
      )}
      </ElementsConsumer>
    </Elements>
  </>
  )
}

export default PaymentForm 