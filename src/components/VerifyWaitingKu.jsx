import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Pricing from './fitur/pricing';
import ProductListKu from './ProductListKu';
import Footer from './fitur/footer';
import { KONEKSI } from '../support/config';
import axios from 'axios';
class VerifyWaitingKu extends Component {
    state={
        payment:[],
        store:[]
    }
    componentDidMount(){
        this.getInfopayment()
        this.getAgentStore()
    }
    getInfopayment=()=>{
        axios.get(`${KONEKSI}/auth/getdaftarinfo/${this.props.user.id_agent}`
        ).then((res) => {
            this.setState({payment: res.data});
            console.log(res.data)
        }).catch((err) => {
            console.log(err);
        })
    }
    getAgentStore=()=>{
        axios.get(`${KONEKSI}/auth/getagentstoredata/${this.props.user.id_agent}`
        ).then((res) => {
            this.setState({store: res.data});
            console.log(res.data)
        }).catch((err) => {
            console.log(err);
        })
    }
    getBank=()=>{
        axios.get(`${KONEKSI}/product/getdatabank`
        ).then((res) => {
            this.setState({bank: res.data});
        }).catch((err) => {
            console.log(err);
        })
      }
    putAlertFillFormDataAgent=()=>{
        if(this.state.store.length == 0){
            return(
                <div className="alert alert-warning media col-12">
                <div className="media-body text-center">
                    <p>Hallo {this.props.user.username}, lengkapi datamu terlebih dahulu <a href="/registeragentdata">disini</a> sebelum melakukan transaksi</p>
                </div>
            </div>
            )
        }
    }

    Pembatalan = (id) => {

        axios.post(`${KONEKSI}/auth/batal`, {id: id})
        .then((res) => {
            alert("Berhasil di batalkan")
            window.location.reload()
        }).catch((err) => {
            console.log(err)
        })

    }

    putDataPayment=()=>{
        var filterpayment = this.state.payment.filter((item)=>{
            return item["status_agent"] == null
        })    
       
        const payment=filterpayment.map(item=>{
            return(
            <div className="alert alert-warning media col-12">
                <div className="media-body text-center">
                    <h4>Bill pembayaran</h4>
                    <p>Hallo {this.props.user.username}, lakukan transfer pembayaran ke</p>
                    <p>Bank {item.nama_bank} dengan nomor rekening</p>
                    <h6 className='text-center text-bold'>{item.noRek}</h6>
                    <p>sebesar</p>
                    <h5 className='text-center text-bold'>Rp {item.total.toLocaleString()}</h5>
                    <p>Kirim bukti pembayaran 
                        <a href="/konfirmasipembayaran" className="btn btn-success btn-sm">disini</a>
                        <button className="btn btn-sm btn-outline-danger ml-2" onClick={() => this.Pembatalan(item.id)}>Batal</button>
                    </p>
                </div>
            </div>   
            )
        })
        return payment
    }
    putDataReport=()=>{
        var filterpayment = this.state.payment.filter((item)=>{
            return item["status_agent"] == 'sudah dibayar'
        })    
       
       
        const payment=filterpayment.map(item=>{
            return(
            <div className="alert bg-primary media col-12">
                <div className="media-body text-center text-white">
                    <h4>Pembayaran pendaftaran sudah dilakukan <br/> sebesar Rp {item.total.toLocaleString()}</h4>
                    <p>Pembayaran atas nama agent {this.props.user.username} akan segera di proses</p>
                    
                </div>
            </div>   
            )
        })
        return payment
    }

    price = () => {

        var filterpayment = this.state.payment.filter((item)=>{
            return item["status_agent"] == 'sudah dibayar'
        }) 

        const filterPrice = filterpayment.map(item => {
        
            return (
                <Pricing />
            )

        })



    }

    render() {
        
        if(this.props.user.username !== ""){
            return (
                <div>
                    <div className='container'>
                        {this.putAlertFillFormDataAgent()}
                       {this.putDataPayment()}
                       {this.putDataReport()}
                    </div>    
                    <Pricing />
                    
                    <div className="container mt-4">
                        <div className="alert alert-primary">
                            <img src="./images/flat/040-computer.png" width="80px"/>
                            <h3>Silahkan Berlangganan Paket!</h3>
                        </div>
                        <ProductListKu />
                    </div>

                    <Footer/>
                </div>
            );
        }
        return <Redirect to="/" />
    }
}

const mapStateToProps = (state) => {
    return { 
        user: state.auth
    };
}

export default connect(mapStateToProps)(VerifyWaitingKu);
