import React from 'react';
import {Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline} from '@material-ui/core'
import { useState, useEffect } from 'react';
import { commerce } from '../../../lib/commerce';
import { useNavigate, Link } from 'react-router-dom';

import useStyles from './styles';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';


const steps = ['Shipping address', 'Payment details']

const Checkout = ( { cart, order, onCaptureCheckout, error } ) => {
  const [activeStep, setActiveStep] = useState(0);
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [shippingData, setShippingData] = useState({});
  const classes = useStyles();
  //let shippingData = {};
  const history = useNavigate();

  // API call to get cart token

  useEffect(() => {
    const generateToken = async () => {
      try {
          const token = await commerce.checkout.generateToken(cart.id, { type: 'cart'});
          

          setCheckoutToken(token);
      } catch (error) {
        history(-1);
      }
    }

    generateToken();

},[cart]);



const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);
 //function mocks that a transaction happened succesfully 
const timeout = () => {
  setTimeout(() => {
    setIsFinished(true);

  },3000);
}


// gets shipping information from AddressForm
 const test = (data) => {
  
  setShippingData(data);
  console.log(data.email);
  console.log(shippingData.email);
  console.log(shippingData.firstName);
 

  nextStep();
};




let Confirmation = () => (
  order.customer ? (
  <>
    <div>
      <Typography variant="h5">Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}!</Typography>
      <Divider className={classes.divider} />
      <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
    </div>
    <br />
    <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
  </>
) : 
isFinished ? (
  <>
    <div>
      <Typography variant="h5">Thank you for your purchase!</Typography>
      <Divider className={classes.divider} />
      
    </div>
    <br />
    <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
  </>

) : (
  <div className={classes.spinner}>
    <CircularProgress />
  </div>
));

if (error) {
  Confirmation = () => (
    <>
      <Typography variant="h5">Error: {error}</Typography>
      <br />
      <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
    </>
  );
}


  const Form = () => activeStep === 0 ?
    <AddressForm checkoutToken={checkoutToken} nextStep={nextStep}  test={test}/> :
    <PaymentForm  checkoutToken={checkoutToken} backStep={backStep} shippingData={shippingData} onCaptureCheckout={onCaptureCheckout} nextStep={nextStep} timeout={timeout} />

  
    // displays  different steos of the checkout process
    return (
    <>
    <CssBaseline />
      <div className={classes.toolbar}/>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant='h4' align='center' >
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((step) => (
              <Step key={step}>
                  <StepLabel> {step} </StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}

        </Paper>
        
      </main>

    </>
  )
}

export default Checkout