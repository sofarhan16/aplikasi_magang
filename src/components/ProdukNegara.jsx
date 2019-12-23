import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
//import Pagination from 'react-js-pagination';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { KONEKSI } from '../support/config';
import ProductItemKu from './ProductItemKu.jsx';
import queryString from 'query-string';
import FilterProduk from './fitur/filterProduk';
import ReactLoading from 'react-loading';
class ProdukNegara extends Component {
    state = { listProduk : [], activePage: 1, tampilPerPage: 16, totalItem: 0, totalPage: 0, startIndex: 0, finishIndex: 0, listPage: [], dropdownOpen: false ,negara:[],loading:'' };
    toggle() {
        this.setState(prevState => ({
          dropdownOpen: !prevState.dropdownOpen
        }));
      }
    componentDidMount() {
        var params = queryString.parse(this.props.location.search);
        var id = params.id;
        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getCountry()
       if(id!=null){
        this.getProductCategory()
       }else{
        this.getProduct()
       }
       
    }
    getCountry=()=>{
        axios.get(`${KONEKSI}/product/getallcountry`
        ).then((res) => {
            this.setState({negara: res.data});
        }).catch((err) => {
            console.log(err);
        })
    }
    getProduct=()=>{
        var params = queryString.parse(this.props.location.search);
        var negara = params.country;
       if(negara != ""){
        axios.get(`${KONEKSI}/product/getproductcountry/${negara}`
        ).then((res) => {
           
                this.setState({listProduk: res.data});
                this.setState({loading:true});
            
            this.setState({totalItem: this.state.listProduk.length});
            //console.log(this.state.totalItem);
            this.setState({totalPage: Math.ceil(this.state.totalItem / this.state.tampilPerPage)})
            //console.log(this.state.totalPage);            
        }).catch((err) => {
            console.log(err);
        })
       }
    }
    getProductCategory=()=>{
        var params = queryString.parse(this.props.location.search);
        var negara = params.country;
        var id = params.id;
       
        if(id != "" && negara != ""){
            console.log("masuk")
            axios.post(`${KONEKSI}/product/getproductcountryandcategory`,{
                negara,id
            }
            ).then((res) => {
                this.setState({listProduk: res.data});
                this.setState({totalItem: this.state.listProduk.length});
                this.setState({loading:true});
                console.log(this.state.listProduk)
                this.setState({totalPage: Math.ceil(this.state.totalItem / this.state.tampilPerPage)})
                //console.log(this.state.totalPage);            
            }).catch((err) => {
                console.log(err);
            })
        }else{
            this.setState({loading:true});
        }
        
    }
    renderPagination = () => {
        //this.setState({listPage: []})
        for (let i = 0; i < this.state.totalPage; i++) {
                //listPageNumb += <li className="page-item"><a className="page-link" href="#">{i+1}</a></li>
                this.state.listPage[i] = i+1;
        }
        console.log(this.state.listPage);
        var listPageJSX = this.state.listPage.slice(this.state.activePage-1,this.state.activePage+3 ).map((item) => {
            return <li className="page-item" onClick={() => this.setState({activePage: item})}><a className="page-link">{item}</a></li>
        }) 
        //console.log(listPageNumb)
        return listPageJSX;
    }
    renderPagination2=()=>{
        if(this.state.activePage==1){
            
            return(
                <ul className="pagination"> 
                   
                                 {this.renderPagination()}
                                 <li className="page-item">
                                     <a className="page-link" onClick={() => this.setState({activePage: this.state.activePage+1})} aria-label="Next"><span aria-hidden="true">Berikutnya</span></a>
                                 </li>
                </ul>
             )
        }else if(this.state.totalPage==this.state.activePage  ){
            return(
                <ul className="pagination"> 
                     <li class="page-item">
                                     <a className="page-link" onClick={() => this.setState({activePage: this.state.activePage-1})} aria-label="Previous" ><span aria-hidden="true">Sebelumnya</span></a>
                                 </li>
                                 {this.renderPagination()}
                                 
                </ul>
             )
        }else{
            console.log(this.state.totalPage)
            return(
                <ul className="pagination"> 
                     <li class="page-item">
                                     <a className="page-link" onClick={() => this.setState({activePage: this.state.activePage-1})} aria-label="Previous" ><span aria-hidden="true">Sebelumnya</span></a>
                                 </li>
                                 {this.renderPagination()}
                                 <li className="page-item">
                                     <a className="page-link" onClick={() => this.setState({activePage: this.state.activePage+1})} aria-label="Next"><span aria-hidden="true">Berikutnya</span></a>
                                 </li>
                </ul>
             )
        }
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
    pageProduct=()=>{
        if(this.state.loading != true){
            return(
                <div className="row loading" style={{borderRadius: "5px"}}>
                <ReactLoading type='cylon' color="#065286" height={100} width={190} />
            </div>
            )
        }else{
            if(this.state.listProduk.length>0){
                return(
                    <div className="col-md-9">
                         
                  <div className="row">
                  {this.renderListProduct()}
                  </div>
                </div>
                )
            }else{
                return(
                <div className="mt-1 col-md-9">
                    <h1>Product Comingsoon</h1>
                </div>
                )
            }
        }
        
    }
    putDropdownNegara=()=>{
        var country = this.state.negara.map(item=>{
               return <a href={`/negara?country=${item.negara}`}><DropdownItem >{item.negara}</DropdownItem></a>
        })
        return country
    }
    putSelectedCountry=()=>{
        var params = queryString.parse(this.props.location.search);
        var country = params.country;
        return(
            <DropdownToggle className="btn btn-default border-white orange" caret>
            {country}
            </DropdownToggle>
        )
    }
    toggle() {
        this.setState(prevState => ({
          dropdownOpen: !prevState.dropdownOpen
        }));
      }
      handleChange(event) {
        // alert(event.target.value)
        console.log(event.target.value)
        // console.log(event.target.id)
        var sort =event.target.value;
        if(sort=="lowestprice"){
            var params = queryString.parse(this.props.location.search);
            var negara = params.country;
           if(negara != ""){
            axios.get(`${KONEKSI}/product/getproductcountrylowestprice/${negara}`
            ).then((res) => {
                    this.setState({listProduk: res.data});
                    this.setState({loading:true});
                
                this.setState({totalItem: this.state.listProduk.length});
                //console.log(this.state.totalItem);
                this.setState({totalPage: Math.ceil(this.state.totalItem / this.state.tampilPerPage)})
                //console.log(this.state.totalPage);            
            }).catch((err) => {
                console.log(err);
            })
           }
        }else if(sort=="highestprice"){
            var params = queryString.parse(this.props.location.search);
            var negara = params.country;
           if(negara != ""){
            axios.get(`${KONEKSI}/product/getproductcountryhighestprice/${negara}`
            ).then((res) => {
                    this.setState({listProduk: res.data});
                    this.setState({loading:true});
                
                this.setState({totalItem: this.state.listProduk.length});
                //console.log(this.state.totalItem);
                this.setState({totalPage: Math.ceil(this.state.totalItem / this.state.tampilPerPage)})
                //console.log(this.state.totalPage);            
            }).catch((err) => {
                console.log(err);
            })
           }
        }else if(sort=="highestweight"){
            var params = queryString.parse(this.props.location.search);
            var negara = params.country;
           if(negara != ""){
            axios.get(`${KONEKSI}/product/getproductcountryhighestweight/${negara}`
            ).then((res) => {
                    this.setState({listProduk: res.data});
                    this.setState({loading:true});
                
                this.setState({totalItem: this.state.listProduk.length});
                //console.log(this.state.totalItem);
                this.setState({totalPage: Math.ceil(this.state.totalItem / this.state.tampilPerPage)})
                //console.log(this.state.totalPage);            
            }).catch((err) => {
                console.log(err);
            })
           }
        }else if(sort=="lowestweight"){
            var params = queryString.parse(this.props.location.search);
            var negara = params.country;
           if(negara != ""){
            axios.get(`${KONEKSI}/product/getproductcountrylowestweight/${negara}`
            ).then((res) => {
                    this.setState({listProduk: res.data});
                    this.setState({loading:true});
                
                this.setState({totalItem: this.state.listProduk.length});
                //console.log(this.state.totalItem);
                this.setState({totalPage: Math.ceil(this.state.totalItem / this.state.tampilPerPage)})
                //console.log(this.state.totalPage);            
            }).catch((err) => {
                console.log(err);
            })
           }
        }else if(sort=="AZ"){
            var params = queryString.parse(this.props.location.search);
            var negara = params.country;
           if(negara != ""){
            axios.get(`${KONEKSI}/product/getproductcountryaz/${negara}`
            ).then((res) => {
                    this.setState({listProduk: res.data});
                    this.setState({loading:true});
                
                this.setState({totalItem: this.state.listProduk.length});
                //console.log(this.state.totalItem);
                this.setState({totalPage: Math.ceil(this.state.totalItem / this.state.tampilPerPage)})
                //console.log(this.state.totalPage);            
            }).catch((err) => {
                console.log(err);
            })
           }

        }else if(sort=="ZA"){
            var params = queryString.parse(this.props.location.search);
            var negara = params.country;
           if(negara != ""){
            axios.get(`${KONEKSI}/product/getproductcountryza/${negara}`
            ).then((res) => {
                    this.setState({listProduk: res.data});
                    this.setState({loading:true});
                
                this.setState({totalItem: this.state.listProduk.length});
                //console.log(this.state.totalItem);
                this.setState({totalPage: Math.ceil(this.state.totalItem / this.state.tampilPerPage)})
                //console.log(this.state.totalPage);            
            }).catch((err) => {
                console.log(err);
            })
           }

        }
       
        
      }
    comingsoon=()=>{
        var params = queryString.parse(this.props.location.search);
        var negara = params.country;
        var id = params.id;
        
            return(
              <div>
                   <div className={`${negara} py-5`}>
                 <span className="my-5"/>
                   </div>
                    <div className="container mt-3">
                 <div className="row">
                 
                  
                 </div>
                <div className="row">
                    <div className="col-3"/>
                        <div className="col-9">
                             <center><h2 className="text-center font-weight-bold font-templates">Featured Product</h2></center> 
                             
                             <select class="form-control form-control-sm w-25 float-right" onChange={this.handleChange}>
                                 <option selected disabled hidden>Sort by</option>
                                 <option value="lowestprice" >Lowest Price</option>
                                 <option value="highestprice" >Highest Price</option>
                                 <option value="lowestweight" >lowest Weight</option>
                                 <option value="highestweight" >Highest Weight</option>
                                 <option value="AZ" >A-Z</option>
                                 <option value="ZA" >Z-A</option>
                             </select>
                        </div>
                </div>
               
                <div className="row">
                
                    <div className="col-md-3 filters-product ">
                        <div className="">
                        <div className="text-left pl-1 mb-2">
                        <p className="font-templates font-weight-bold mb-2">Filter by: </p>
                            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                                {this.putSelectedCountry()}
                                <DropdownMenu>
                                  {this.putDropdownNegara()}
                                </DropdownMenu>
                            </Dropdown>
                    </div>
                      <FilterProduk negara={negara} id={id}/>
                    </div>
                        </div>
                  
                 
                    {this.pageProduct()}
                </div>
                
                <div className="row mb-5">
               
                <div className="col-md-3"/>
                    {/* pagination */}
                <div className="col-md-9 justify-content-md-center row">
                <nav className='col-3 '>
                        
                            {this.renderPagination2()}
                       
                       
                    </nav>
                </div>
                </div>
                </div>
              </div>
            ) 
    }
    render() {
        
        return(
            <div className="">
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

export default connect(mapStateToProps)(ProdukNegara);