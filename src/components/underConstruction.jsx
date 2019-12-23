import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import CarouselKu from './CarouselKu';
import ProductListKu from './ProductListKu';
//import { KONEKSI } from '../support/config';
class UnderConstruction extends Component{
    render(){
       
        return(
            <div className='container underconstruction' style={{marginTop:'200px'}}>
  
        <div className="text-center mb-4">
        <img class="mb-4" src="http://dilizents.com/image/logo.jpeg" alt="" width="120" height="90"></img>
          
          <h1 className="h3 mb-3 font-weight-normal">WE ARE COMING SOON</h1>
          <p>Our website is under construction.</p>
          <p>We'll be here soon with our awesome site</p>
        </div>
        
        <p className="mt-5 mb-3 text-muted text-center">© 2019</p>
        <a href='/login'><p className='text-center text-secondary mt-5'>Admin Login</p></a>
        </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { 
        user: state.auth
    };
}

export default connect(mapStateToProps)(UnderConstruction);