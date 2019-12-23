import React, { Component} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import  SidebarAgent from './SidebarAgent';
import axios from 'axios';
import { KONEKSI } from '../../support/config';
import Cookies from "universal-cookie";
import moment from 'moment'

const cookies = new Cookies();
class OrderAgent extends Component {
    state={
        listOrder:[]
    }
    componentDidMount(){
        this.getOrder()
    }
    getOrder=()=>{
        var username = cookies.get('myPengguna');
        axios.get(`${KONEKSI}/transaction/getlistorder/${username}`
        ).then((res) => {
            this.setState({ listOrder: res.data});
        }).catch((err) => {
            console.log(err);
        })
    }
    putData=()=>{
        const data = this.state.listOrder.map((item)=>{
            if(item.is_finished == 'no'){
                return(
                    <tr key={item.id_customer} className="text-wrap" style={{fontSize:'12px'}}>  
                        <td className="align-middle">{item.id_transaksi}</td>  
                        <td className="align-middle">{item.total_berat/1000} kg</td>  
                        <td className="align-middle">Rp {item.total_bayar.toLocaleString()}</td>  
                        <td className="align-middle">{moment(item.waktu).format('YYYY-MM-MM HH:mm:ss')}</td>  
                        <td className="align-middle">Belum dibayar</td>
                        <td className="align-middle"><a href={`/agent/orderdetail?id=${item.id_transaksi}`}><button className="btn btn-default orange">Detail</button></a></td>                     
                    </tr>
                    )
            }else{
                return(
                    <tr key={item.id_customer} className="text-wrap" style={{fontSize:'12px'}}>  
                        <td className="align-middle">{item.id_transaksi}</td>  
                        <td className="align-middle">{item.total_berat/1000} kg</td>  
                        <td className="align-middle">Rp {item.total_bayar.toLocaleString()}</td>  
                        <td className="align-middle">{moment(item.waktu).format('YYYY-MM-MM HH:mm:ss')}</td>  
                        <td className="align-middle">{item.is_finished}</td>
                        <td className="align-middle"><a href={`/agent/orderdetail?id=${item.id_transaksi}`}><button className="btn btn-default orange">Detail</button></a></td>                     
                    </tr>
                    )
            }
            
        })
        return data
    }

    render(){
        const { username } = this.props.user;

        if(username !== ""){
            return (
                <div className="container-fluid">
                    <div className="row">
                        <SidebarAgent order="aktif"/>

                        <div className="col-md-10 bg-light pl-3 pt-3">
                                <div className="alert blue text-white text-center media col-12">
                                   
                                    <div className="col-md-12 media-body font-weight-bold">
                                        <h4>Riwayat pesanan</h4>
                                    </div>
                                </div>  
                                <div className="card mt-2 shadow col-lg-12 pl-0 pr-0">
                                    {/* <div className="card-header">
                                        <h4>History Belanja customermu</h4>
                                    </div> */}
                                    <div className="card-body">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Nama transaksi</th>
                                                    <th scope="col">Total berat</th>
                                                    <th scope="col">Total Pembayaran</th>
                                                    <th scope="col">Tanggal</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Detail</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {this.putData()}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>                          
                        </div>
                    
                                
                    </div>

                </div>
            );
        }
        return(
            <Redirect to="/" />
        );
    }
}

const mapStateToProps = (state) => {
    return { 
        user: state.auth
    };
}

export default connect(mapStateToProps)(OrderAgent);