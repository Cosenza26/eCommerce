import React, {useState ,useEffect} from 'react'
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core'
import { useForm, FormProvider } from 'react-hook-form'
import FormInput from './CustomTextField'
import { Link } from 'react-router-dom'

import {commerce} from '../../lib/commerce';

const AddressForm = ( { checkoutToken, test }  ) => {
    const methods = useForm();
    const [shippingStates, setShippingStates] = useState([]);
    const [shippingState, setShippingState] = useState("");
    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingOption, setShippingOption] = useState("");

    //API call to get all available states

    const fetchStates = async () => {
        const {subdivisions} = await commerce.services.localeListSubdivisions('US');
        
        setShippingStates(subdivisions);
        setShippingState(Object.keys(subdivisions)[0]);
    }
    

    // Renders once 
    useEffect(() => {
        fetchStates();

    },[])

    const fetchShippingOptions = async (checkoutTokenId, country, stateProvince = null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region: stateProvince });
    
        setShippingOptions(options);
        setShippingOption(options[0].id);
      };


      useEffect(() => {
        if (shippingState) fetchShippingOptions(checkoutToken.id, 'US', shippingState);
      }, [shippingState]);
   

    //displays form with important fields


  return (
    <>
        <Typography variant='h6' gutterBottom>Shipping Address</Typography>
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit((data) => test({ ...data, shippingState,shippingOption }))}>
                <Grid container spacing={3}>
                    <FormInput name="firstName" label='First Name' />
                    <FormInput name="lastName" label='Last Name' />
                    <FormInput name="address1" label='Address' />
                    <FormInput name="email" label='Email' />
                    <FormInput name="city" label='City' />
                    <FormInput name="zip" label='ZIP Code' />
                    <Grid item xs={12} sm={6}>
                        <InputLabel>USA</InputLabel>

                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <InputLabel>State</InputLabel>
                        <Select value={shippingState} fullWidth onChange={(e) => setShippingState(e.target.value)}>
                            
                        {Object.entries(shippingStates).map(([code, name]) => ({ id: code, label: name })).map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
                            
                        </Select>
                    </Grid>

                    
                </Grid>
                <br />
                <div style= {{display: 'flex', justifyContent: 'space-between'} }>
                    <Button component={Link} to='/cart' variant='outlined' >Back to Cart</Button>
                    <Button type='submit' variant='contained' color="primary">Next</Button>
                </div>
            </form>

        </FormProvider>
    </>
  )
}

export default AddressForm;