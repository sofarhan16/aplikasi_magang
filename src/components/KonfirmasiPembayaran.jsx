import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { CustomInput } from 'reactstrap';
import queryString from 'query-string';
import { Redirect } from 'react-router-dom';
import moment from 'moment'
import { KONEKSI } from '../support/config';

class KonfirmasiPembayaran extends Component {
    state = { listPayment: [], AddBrandImage: 'Unggah Bukti Pembayaran', idTrx: "*pilih transaksi di tabel bawah", message: ""}

    componentDidMount() {
        //var idtransaksi = this.props.match.params;
        this.getListPayment();
        this.formUpload();
        var params = queryString.parse(this.props.location.search);
        console.log(params.idtransaksi)
        if(params.idtransaksi !== undefined){
            this.setState({idTrx: params.idtransaksi})
        }
    }

    getListPayment = () => {
        axios.get(`${KONEKSI}/auth/getdaftarinfo/${this.props.user.id_agent}`
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

    listPayment = () => {
        var listJSX = this.state.listPayment.map((item) => {
            return (
                <tr onClick={() => this.setState({idTrx: item.id})}>
                    <td>{item.id}</td>
                    <td className="text-danger">Rp. {item.total.toLocaleString()}</td>
                </tr>
            );
        })
        return listJSX;
    }

    onBtnAddClick = () => {
        if(document.getElementById("AddBuktiBayar").files[0] !== undefined) {
            var formData = new FormData()
            var headers = {
                headers: 
                {'Content-Type': 'multipart/form-data'}
            }

            var data = {
                id_transaksi: this.refs.AddIdTrx.value,
                id_agent: this.props.user.id_agent,
                waktu: moment(new Date()).format('YYYY/MM/DD HH:mm:ss'),
                status:'sudah dibayar'
            }
            if(data.id_transaksi!="*pilih transaksi di tabel bawah"){
                if(document.getElementById('AddBuktiBayar')){
                    formData.append('image', document.getElementById('AddBuktiBayar').files[0])
                }
                formData.append('data', JSON.stringify(data))
                console.log(data)
                console.log(JSON.stringify(data))
                axios.post(`${KONEKSI}/transaction/konfirmasipembayaranagent`, formData, headers)
                .then((res) => {
                    
                    alert("Bukti Pembayaran Berhasil Diunggah!")
                    //this.setState({ brandList: res.data })
                    this.setState({message:"Bukti Pembayaran Berhasil Diunggah"})
                    this.getListPayment();
                    this.refs.formPayment.reset();
                    
                    document.getElementById('inputEmail').remove()
                    document.getElementById('AddBuktiBayar').remove()

                })
                .catch((err) =>{
                    console.log(err)
                })
            }else{
                alert("Sebelum upload bukti pembayaran pilih id transaksi yang ingin kamu bayar!!")
            }
            
        }
        else {
            alert('Image harus diisi!')
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

    formUpload = () => {
        var lol = this.state.listPayment.map((item) => {
            if(this.state.message == ""){
                return (
                    
                    <div className="container">
                        <div className="form-group row">
                            <div className="col-sm-12">
                                <input type="text" ref="AddIdTrx" className="form-control" id="inputEmail" placeholder="ID Trx" value={this.state.idTrx} readOnly required autoFocus/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-12">
                                <CustomInput type="file" className="form-control col-sm-12" id="AddBuktiBayar" name="AddBuktiBayar" label={this.state.AddBrandImage} onChange={this.onAddFileImageChange} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-12">
                                <button type="button" class="btn btn-success col-sm-12" onClick={this.onBtnAddClick} ><i class="fas fa-file-upload"></i> Upload</button>
                            </div>
                        </div>
                    </div>
                );
            }else{
                return window.location.replace("/verify")
            }
        })
        return lol;
    }


    render() {
        if (this.props.user.username === ""){
            return <Redirect to="/" />
        }
        return(
            <div className="container" style={{minHeight:"600px"}}>
                <div className="row justify-content-sm-center mt-3" >
                    <form className="border mb-3 rounded" style={{padding:"20px", width:"400px"}} ref="formPayment">
                        <fieldset>
                            <legend><img src="./images/flat/024-payment-method.png" width="60px"/><p>Konfirmasi Pembayaran</p></legend>
                            {this.formUpload()}
                            {this.renderMessage()}
                        </fieldset>
                    </form>
                </div>

                <div>
                    <div className="alert alert-success col-md-6 offset-md-3">Mau Konfirmasi Yang Mana?</div>
                    <table className="table table-hover col-md-6 offset-md-3">
                        <thead>
                            <tr>
                                <th>ID Transaksi</th>
                                <th>Total Pembayaran</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.listPayment()}
                        </tbody>
                    </table>
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

export default connect(mapStateToProps)(KonfirmasiPembayaran);