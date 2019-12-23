import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
//import Pagination from 'react-js-pagination';
import { KONEKSI } from '../support/config';
import ProductItemKu from './ProductItemKu.jsx';

class BestProduct extends Component {
    state = { listProduk : [], activePage: 1, tampilPerPage: 4, totalItem: 0, totalPage: 0, startIndex: 0, finishIndex: 0, listPage: []   };

    componentDidMount() {
        axios.get(`${KONEKSI}/product/getproductbest`
        ).then((res) => {
            this.setState({listProduk: res.data});
            this.setState({totalItem: this.state.listProduk.length});
            //console.log(this.state.totalItem);
            this.setState({totalPage: Math.ceil(this.state.totalItem / this.state.tampilPerPage)})
            //console.log(this.state.totalPage);            
        }).catch((err) => {
            console.log(err);
        })
    }

   

    renderListProduct = () => {
        var { activePage, tampilPerPage } = this.state
        var listJSX = this.state.listProduk.slice( (activePage-1)*tampilPerPage, (activePage*tampilPerPage)).map((item) => {           
            return(
                 <ProductItemKu produk={item} color="font-templates"/> 
            );
        })
        return listJSX;
    }
    render() {
        return(
            <div className=" p-5">
                <h3 className="font-templates mb-5 border-bottom-yellow">Best Products</h3>
                <div className="row">
                    {this.renderListProduct()}
                </div>

            </div>
            
        );
    }
}

const mapStateToProps = (state) => {
    return { 
        produk: state.selectedProduk
    };
}

export default connect(mapStateToProps)(BestProduct);