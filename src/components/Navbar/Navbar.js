import React from 'react'
import {AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Typography} from '@material-ui/core';
import { ShoppingCart} from '@material-ui/icons';
import Store from "../../assets/images/store.png";
import useStyles from './styles';
import { Link, useLocation } from 'react-router-dom';


// displays navbar with logo
// shopping cart only displays if the user is in the product page
function Navbar({totalItems}) {
    const classes = useStyles();
    const location = useLocation();

    
  return (
    <>
        <AppBar position='fixed' className={classes.appBar} color='inherit'>
            <Toolbar>
                <Typography component={Link} to="/" variant='h6' className={classes.title} color="inherit" >
                    <img src={Store}  alt="commerce.js" height='25px' className={classes.image} />
                    Mr. C Squared
                </Typography>
                <div className={classes.grow}/>
                { location.pathname === '/' && (
                <div className={classes.button}>
                    <IconButton component={Link} to="/cart" aria-label='Show cart items' color='inherit'>
                        <Badge badgeContent={totalItems} color="secondary" >
                            <ShoppingCart />

                        </Badge>
                    </IconButton>
                </div>)}
            </Toolbar>

        </AppBar>
    </>
  )
}

export default Navbar