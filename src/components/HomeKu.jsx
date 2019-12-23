import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import CarouselKu from './CarouselKu';
import ProductListKu from './ProductListKu';
//import { KONEKSI } from '../support/config';
import { Card, CardImg, CardText, CardTitle, CardImgOverlay  } from 'reactstrap';
import Negara from './fitur/negara';
import Pricing from './fitur/pricing';
import Footer from './fitur/footer';
import BestOffers from './BestOffers';
import NewArival from './NewArival';
import BestProduct from './bestProduct';
class HomeKu extends Component{
    state = {search: ""}
    searchSomething = () => {
        var keywords = this.refs.searchBook.value;
        console.log(keywords);
        this.setState({search: keywords})
    }

    renderOnKeyPress = (event) => {
        if (event.key === 'Enter'){
            // alert('Enter has been pressed')
            this.searchSomething()
        }
    }
    pricingfucntion =()=>{
        if(this.props.user.level == null && this.props.user.role == 'User'){
            return<Pricing/>
        }else if(this.props.user.username == ''){
            return<Pricing/>
        }
    }
    componentDidMount(){
        if(this.props.user.username !== ""){
            // window.location.reload()
            if(this.props.user.id_agent == undefined){
                window.location.reload()
            }
          }
    }
    render(){
        const { username, status,level } = this.props.user;
        console.log(this.props.user)
        // if( username !== "" && status === "Unverified" || level == null){
        //     return <Redirect to="/verify" />
        // }
        if (this.state.search !== "") {
            //var keywords = this.refs.searchBook.value;
            return <Redirect to={`/searchbook?keywords=${this.state.search}`} />
        }
        return(
            <div>
                <div className="w-100 bg-secondary">
                <CarouselKu/>
                </div>
                <div className="country" style={{backgroundImage: `url(./images/ombakatas2.png)`,backgroundRepeat:"no-repeat",backgroundSize:"100% 100%"}}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                        <center><h2 className="font-Head text-center mb-3 mt-5">SELECT COUNTRY</h2></center>   
                            <Negara/>
                            
                                <a href="/allcountry"><button className="btn btn-info bold w-25 mt-4">All country</button></a>
                        
                        </div>
                    </div>
                </div>
                </div>
                <div className="w-100  mt-4">
                    <BestProduct/>
                </div>
                <div className="w-100  mt-4">
                    <BestOffers/>
                </div>
               
                <div className="w-100 newArivval" style={{backgroundImage: `url(./images/newproduct.png)`,backgroundRepeat:"no-repeat",backgroundSize:"100% 100%",paddingTop:"265px"}}>
                    <div className="container">
                    <center><h3 className="font-Head text-center mb-4 mt-5">NEW ARRIVALS PRODUCT</h3></center>        
                <NewArival/>
                    </div>
                </div>
           <div className="" >
           {this.pricingfucntion()}
               </div>
           <div className="">
           <Footer/>
           </div>
        </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { 
        user: state.auth
    };
}

export default connect(mapStateToProps)(HomeKu);