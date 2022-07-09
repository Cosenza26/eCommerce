import React from 'react'
import { TextField, Grid } from '@material-ui/core'
import { useFormContext, Controller } from 'react-hook-form'



const FormInput = ( {name , label} ) => {
    const { control } = useFormContext();
  
    // display a specific controller 
    return (
    <Grid item xs={12} sm={6}>
       
       
        <Controller 
            
            
            render={({
                field: { onChange, onBlur, value, name, ref },
                //fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                <TextField
                required
                label={label}
                defaultValue={value}
                onChange={onChange} // send value to hook form
                onBlur={onBlur} // notify when input is touched
                inputRef={ref} // wire up the input ref
                />
            )}

            control={control}
            fullWidth
            name={name}
            rules={{required: true}}
           
        />


    </Grid>
  )
}

export default FormInput;