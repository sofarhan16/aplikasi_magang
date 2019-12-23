import React, { Component} from 'react';
import { connect } from 'react-redux';

import axios from 'axios';
import { KONEKSI } from '../../../support/config';
import Cookies from "universal-cookie";
const cookies = new Cookies();

class Top extends Component {
    state={
        cart:[],
        customer:[],
        history:[],
        comfirm:[]
    }
   componentDidMount(){
    this.customer();
    this.cart();
    this.history();
    this.comfirm();
   }
   customer=()=>{
    var username = cookies.get('myPengguna');
    axios.post(`${KONEKSI}/customer/getcustomer`,{
        username
    }
    ).then((res) => {
        this.setState({customer: res.data});          
    }).catch((err) => {
        console.log(err);
    })
   }
   cart=()=>{
    var username = cookies.get('myPengguna');
        axios.get(`${KONEKSI}/transaction/getlistcartall/${username}`
        ).then((res) => {
            this.setState({ cart: res.data});
            console.log(this.state.cart)
        }).catch((err) => {
            console.log(err);
        })
   }
   history=()=>{
    var username = cookies.get('myPengguna');
    axios.get(`${KONEKSI}/transaction/getlistorder/${username}`
    ).then((res) => {
        this.setState({ history: res.data});
    }).catch((err) => {
        console.log(err);
    })
   }
   comfirm=()=>{
    var username = cookies.get('myPengguna');
    axios.post(`${KONEKSI}/transaction/getlistpayment`, 
        { username } 
    ).then((res) => {
        this.setState({ comfirm: res.data });
    }).catch((err) => {
        console.log(err);
    })
   }
    render(){
       
            return (
                
                              <div className="row text-left mt-3">
                                    <div className="col-md-3">
                                        <div className="h-100 card pt-1 pl-2 blue text-white biru">
                                       <p className="font-weight-bold text-white">Total Pelanggan</p>
                                        <div className="pt-2 pb-2">
                                        
                                        <span className="float-right pr-4"><svg class="feather feather-users sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> {this.state.customer.length}</span>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                    <div className="h-100 card pt-1 pl-2  blue text-white hijau">
                                    <p className="font-weight-bold text-white">Total Keranjang</p>
                                    <div className="pt-2 pb-2">
                                        
                                        <span className="float-right pr-4">
                                        <svg class="feather feather-shopping-cart sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-reactid="1096"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg> {this.state.cart.length}</span>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                    <div className="h-100 card pt-1 pl-2  blue text-white merah">
                                    <p className="font-weight-bold text-white">Riwayat Pesanan</p>
                                    <div className="pt-2 pb-2">
                                        
                                        <span className="float-right pr-4">
                                        <svg class="feather feather-archive sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg> {this.state.history.length}</span>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                    <div className="h-100 card pt-1 pl-2  blue text-white kuning">
                                    <p className="font-weight-bold text-white">Konfirmasi pembayaran</p>
                                    <div className="pt-2 pb-2">
                                        
                                        <span className="float-right pr-4"><svg class="feather feather-alert-triangle sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12" y2="17"></line></svg> {this.state.comfirm.length}</span>
                                        </div>
                                        </div>
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

export default connect(mapStateToProps)(Top);