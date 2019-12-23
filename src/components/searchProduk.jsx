import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
//import Pagination from 'react-js-pagination';
import { KONEKSI } from '../support/config';
import ProductItemKu from './ProductItemKu.jsx';
import queryString from 'query-string';
class SearchProduk extends Component {
    state = { listProduk : [], activePage: 1, tampilPerPage: 8, totalItem: 0, totalPage: 0, startIndex: 0, finishIndex: 0, listPage: []   };

    componentDidMount() {
        this.getProductlist()
    }
    getProductlist=()=>{
        var params = queryString.parse(this.props.location.search);
        var keyword = params.search;
        axios.post(`${KONEKSI}/product/searchproduct/`,{
            keyword
        }
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
    renderPagination = () => {
        //this.setState({listPage: []})
        for (let i = 0; i < this.state.totalPage; i++) {
                //listPageNumb += <li className="page-item"><a className="page-link" href="#">{i+1}</a></li>
                this.state.listPage[i] = i+1;
        }
        console.log(this.state.listPage);
        var listPageJSX = this.state.listPage.map((item) => {
            return <li className="page-item" onClick={() => this.setState({activePage: item})}><a className="page-link" href="#">{item}</a></li>
        }) 
        //console.log(listPageNumb)
        return listPageJSX;
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
    comingsoon=()=>{
        var params = queryString.parse(this.props.location.search);
        var negara = params.country;
        if(this.state.listProduk.length>0){
            return(
                <div>
                    <center><h1 className="py-4">{negara}</h1></center>
                <div className="row">
                    {this.renderListProduct()}
                </div>
                
                <div className="row justify-content-md-center">
                    {/* pagination */}
                    <nav aria-label="Page navigation example">
                        <ul className="pagination">
                            {/* <li class="page-item">
                                <a className="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>
                            </li> */}
                            {this.renderPagination()}
                            {/* <li className="page-item">
                                <a className="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>
                            </li> */}
                        </ul>
                    </nav>
                </div>
                </div>
            )
        }else{
            return(
                <div className="mt-5">
                <h1>{negara} is Comingsoon</h1>
            </div>
            )
        }
    }
    render() {
        
        return(
            <div className="container">
                {this.comingsoon()}
            </div>
            
        );
    }
}

const mapStateToProps = (state) => {
    return { 
        produk: state.selectedProduk
    };
}

export default connect(mapStateToProps)(SearchProduk);