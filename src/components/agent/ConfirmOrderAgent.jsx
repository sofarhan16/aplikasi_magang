import React, { Component} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import  SidebarAgent from './SidebarAgent';
import axios from 'axios';
import { CustomInput } from 'reactstrap';
import queryString from 'query-string';
//import moment from 'moment'
import { KONEKSI } from '../../support/config';
import Cookies from "universal-cookie";

import moment from 'moment';
import Countdown from 'react-countdown-now';

const cookies = new Cookies();

class ConfirmOrderAgent extends Component {
    state = { listPayment: [], AddBrandImage: 'Unggah Bukti Pembayaran', idTrx: "*pilih transaksi di tabel bawah", message: "" ,bank:[]}

    componentDidMount() {
        //var idtransaksi = this.props.match.params;
        this.getListPayment();
        this.getBank()
        
        var params = queryString.parse(this.props.location.search);
        console.log(params.idtransaksi)
        if(params.idtransaksi !== undefined){
            this.setState({idTrx: params.idtransaksi})
        }
    }
    getBank=()=>{
        axios.get(`${KONEKSI}/product/getdatabank`
        ).then((res) => {
            this.setState({bank: res.data});
            
        }).catch((err) => {
            console.log(err);
        })
      }

    getListPayment = () => {
        var username = cookies.get('myPengguna');
        axios.post(`${KONEKSI}/transaction/getlistpayment`, 
            { username } 
        ).then((res) => {
            this.setState({ listPayment: res.data });
            console.log(this.state.listPayment)
        }).catch((err) => {
            console.log(err);
        })
    }

    renderMessage = () => {
        if(this.state.message !== ""){
            return(
                <div className="alert alert-warning">
                    <h6>{this.state.message}</h6>
                    <p>Admin akan memverifikasi pembayaran.</p>
                    <p>Silahkan tunggu email selanjutnya</p>
                </div>
            );
        }
    }

    autoDelete = (id) => {
        
        
        (axios.post(`${KONEKSI}/transaction/autoDelete/transaction`, {id_transaksi: id}
        ).then((res) => {
            this.getListPayment()
        }).catch((err) => {
            console.log(err);
        }))
        return window.location.reload()

    }

    batalPesanan = (id_tr) => {

        var valid = window.confirm("Apakah Anda yakin untuk mebatalkan pesanan?")

        if(valid){
            var transaksi = id_tr

            axios.post(`${KONEKSI}/transaction/batalPesanan`, {transaksi: transaksi})
            .then((res) => {
                window.location.reload()
            }).catch((err) => {
                console.log(err)
            })
            

        }else{
            return false;
        }

    }

    listPayment = () => {
        var listJSX = this.state.listPayment.map((item) => {  
            
            // Random component
            const Completionist = () => <span>You are good to go!</span>;
            
            // Renderer callback with condition
            const renderer = ({days, hours, minutes, seconds, completed }) => {
                if (completed) {
                    // Render a completed state
                    return this.autoDelete(item.id_transaksi)

                } else {
                    // Render a countdown
                    return <span>{days}D {hours}:{minutes}:{seconds}</span>;
                }
            };

            return (
                
                <tr onClick={() => this.setState({idTrx: item.id_transaksi})}>
                    <td>{item.id_transaksi}</td>
                    <td className="text-danger">Rp. {item.total_bayar.toLocaleString()}</td>
                    <td>{item.total_berat/1000} Kg</td>
                    <td><Countdown date={item.tenggang_waktu} renderer={renderer}/></td>
                    <td><button className="btn btn-sm btn-danger" onClick={() => this.batalPesanan(item.id_transaksi)}><i className="fa fa-close"></i></button></td>
                </tr>
            );
        })
        return listJSX;
    }

    onBtnAddClick = () => {
        var username = cookies.get('myPengguna');
        if(document.getElementById("AddBuktiBayar").files[0] !== undefined) {
            var formData = new FormData()
            var headers = {
                headers: 
                {'Content-Type': 'multipart/form-data'}
            }

            var data = {
                id_transaksi: this.refs.AddIdTrx.value,
                username: username,
                waktu: moment(new Date()).format('YYYY:MM:DD HH:MM:SS')
                // moment(new Date()).format('YYYY:MM:DD HH:MM:SS')
                
                
            }
            console.log(data.id_transaksi)
            if(data.id_transaksi!="*pilih transaksi di tabel bawah"){
                if(document.getElementById('AddBuktiBayar')){
                formData.append('image', document.getElementById('AddBuktiBayar').files[0])
            }
            formData.append('data', JSON.stringify(data))
            console.log(data)
            axios.post(`${KONEKSI}/transaction/confirmpayment`, formData, headers)
            .then((res) => {
                
                alert("Payment Proof Successfully Uploaded!")
                //this.setState({ brandList: res.data })
                this.setState({message:"Payment Proof Successfully Uploaded"})
                this.getListPayment();
                window.location.reload()
            })
            .catch((err) =>{
                console.log(err)
            })
            }else{
                alert("Id transaksi harus dipilih terlebih dahulu")
            }
            
        }
        else {
            alert('Image must be fill')
        }
    }

    onAddFileImageChange = () => {
        if(document.getElementById("AddBuktiBayar").files[0] !== undefined) {
            this.setState({AddBrandImage: document.getElementById("AddBuktiBayar").files[0].name})
        }
        else {
            this.setState({AddBrandImage: 'Unggah Bukti Pembayaran'})
        }
    }
    putBank=()=>{
        var bank= this.state.bank.map(item =>{
            return(
                <div className="mb-2">
                    <div className="row">
                        <div className="col-md-4 col-4">
                            <img src={`${KONEKSI}/${item.gambar}`} width="100"/>
                        </div>
                        <div className="col-md-8 col-8">
                            <p className='text-left'>Bank {item.nama_bank}</p>
                            <p className='text-left'>Nomer Rekening: {item.noRek}</p>
                            <p className='text-left'>Atas Nama : {item.atasNama}</p>
                        </div>
                    </div>
                </div>
            )
        })
        return bank
    }
    render(){

        
        const { username } = this.props.user;

        if(username !== ""){
            return (
                <div className="container-fluid">
                    <div className="row">
                        <SidebarAgent payment="aktif"/>

                        <div className="col-md-10 bg-light pl-3 pt-3">
                        <div className="row justify-content-sm-center mt-3" >
                        <div className="alert blue text-white media col-12">
                            <div className="col-md-12 media-body">
                                <h4>Bukti pembayaran</h4>
                            </div>
                        </div>
                    <form className="border mb-3 rounded" style={{padding:"20px", width:"400px"}} ref="formPayment">
                        <fieldset>
                            <legend><h5>Thank you for your order</h5></legend>
                            <p className='text-left border-bottom'>Lakukan pembayaran pada rekening dibawah ini</p>
                            <div className="border-bottom mb-4">
                            {this.putBank()}
                            </div>
                            <div className="form-group row">
                                <div className="col-sm-12">
                                    <input type="text" ref="AddIdTrx" className="form-control" id="inputEmail" placeholder="ID Trx" value={this.state.idTrx} readOnly required autoFocus/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-sm-12">
                                    <CustomInput type="file" className="form-control col-sm-12" id="AddBuktiBayar" name="AddBuktiBayar"  label={this.state.AddBrandImage} onChange={this.onAddFileImageChange} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-sm-12">
                                    <button type="button" class="btn btn-default orange col-sm-12" onClick={this.onBtnAddClick} ><i class="fas fa-file-upload"></i> Upload</button>
                                </div>
                            </div>
                            {this.renderMessage()}
                        </fieldset>
                    </form>
                </div>

                <div>
                    <div className="alert alert-success col-md-6 offset-md-3">Mau Konfirmasi Yang Mana?</div>
                    <table className="table table-hover col-md-6 offset-md-3">
                        <thead className="blue text-white">
                            <tr>
                                <th>ID Trx</th>
                                <th>Total Pembayaran</th>
                                <th>Total Berat</th>
                                <th>Tenggang Waktu</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.listPayment()}
                        </tbody>
                    </table>
                    
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

export default connect(mapStateToProps)(ConfirmOrderAgent);