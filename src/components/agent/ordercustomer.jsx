import React, { Component} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import SidebarAgent from './SidebarAgent';
import axios from 'axios';
import { KONEKSI } from '../../support/config';
import Cookies from "universal-cookie";
import { loadOfCart } from '../../actions';
import queryString from 'query-string';
const cookies = new Cookies();
class OrderCustomer extends Component {
    state={
        listCart:[],
        selectedRow:0,
        curency:0,
        bm:0,
        ppn:0,
        pph:0,
        ppnbm:0,
        pungutan:0,
        level:'',
        bronze:0,
        silver:0,
        gold:0,
        platinum:0
    }
    componentDidMount(){
        this.getDataBuyer()
        this.getCurency()
        this.getuser()
        this.getCukai()
    }
    getCukai = () => {
        axios.get(`${KONEKSI}/transaction/cukai`
        ).then((res) => {
            this.setState({
                bm:res.data[0].bea_masuk,
                ppn:res.data[0].PPN,
                pph:res.data[0].PPh,
                ppnbm:res.data[0].PPnBM,
                pungutan:res.data[0].pungutan
            });   
                   
        }).catch((err) => {
            console.log(err);
        })
    }
    getuser=()=>{
        var username = cookies.get('myPengguna');
        axios.post(`${KONEKSI}/auth/keeplogin`,{
            username
        }
        ).then((res) => {
            this.setState({ level: res.data[0].level});
            console.log(this.state.level)
        }).catch((err) => {
            console.log(err);
        })
    }
    getDataBuyer=()=>{
        var params = queryString.parse(this.props.location.search)
        var id_customer = params.id_customer;
        var id_transaksi = params.id_transaksi
        axios.post(`${KONEKSI}/transaction/getlistordercustomer`,{
            id_customer,id_transaksi
        }
        ).then((res) => {
            this.setState({ listCart: res.data, selectedRow: 0 });
            console.log(this.state.listCart)
        }).catch((err) => {
            console.log(err);
        })
    }
    getCurency=()=>{
        axios.get(`${KONEKSI}/transaction/curency`
        ).then((res) => {
            this.setState({ 
                curency: res.data[0].dollar, 
                bronze: res.data[0].bronze,
                silver:res.data[0].silver,
                gold:res.data[0].gold,
                platinum:res.data[0].platinum,
                selectedRow: 0 });
            console.log(this.state.platinum)
        }).catch((err) => {
            console.log(err);
        })
    }
    onBtnSaveClick = (item) => {
        var new_jumlah_beli = parseInt(this.refs.jumlahEdit.value);
        var new_total_berat = parseInt(item.berat * new_jumlah_beli);
        var new_total_harga = parseInt(item.harga * new_jumlah_beli);

        //alert(`new qty: ${new_jumlah_beli}, new berat: ${new_total_berat}, new totharga: ${new_total_harga}`)
        axios.post(`${KONEKSI}/transaction/editlistcart`, {
            id_agent:item.id_agent,
            id_customer: item.id_customer,
            id_produk: item.id_produk,
            jumlah_beli : new_jumlah_beli, 
            total_berat : new_total_berat, 
            total_harga: new_total_harga 
        }).then((res) => {
            this.getDataBuyer();
            console.log(new_jumlah_beli)
        }).catch((err) => {
            console.log(err);
        })
    }

    onBtnDeleteClick = (item) => {
        
        if(window.confirm('Apakah Anda Yakin?')){

            axios.post(`${KONEKSI}/transaction/deleteitemcart`, {
                id_agent:item.id_agent,
            id_customer: item.id_customer,
            id_produk: item.id_produk,
            }).then((res) => {
                this.getDataBuyer();
                alert('Pesanan berhasil dihapus')
                this.props.loadOfCart({id_agent: item.id_agent})
            }).catch((err) => {
                console.log(err)
            })

        }
    }
    putDataBuyer = () => {
        var listBuyer = this.state.listCart.map(item => {

            if(this.state.level == 'BRONZE'){

                var curency = ((this.state.curency*this.state.bronze)/100)+this.state.curency

            }else if(this.state.level == 'SILVER'){
                var curency = ((this.state.curency*this.state.silver)/100)+this.state.curency
              
            }else if(this.state.level == 'GOLD'){
                var curency = ((this.state.curency*this.state.gold)/100)+this.state.curency
                
            }else if(this.state.level == 'PLATINUM'){
                var curency = ((this.state.curency*this.state.platinum)/100)+this.state.curency
               
            }
            var rupiah = item.harga*curency
            var dollarPrice =item.harga
                if(dollarPrice >= this.state.pungutan){
                    var beamasuk = dollarPrice*this.state.bm/100;
                    var ppn = dollarPrice*this.state.ppn/100;
                    var pph = dollarPrice*this.state.pph/100;
                    var ppnbm = dollarPrice*this.state.ppnbm/100;
                    var total = dollarPrice+beamasuk+ppn+pph+ppnbm
                    var pajak = beamasuk+ppn+pph+ppnbm
                    var pajakrupiah = pajak*curency
                    var totalx = total*item.jumlah_beli;
                    var totalRupiah = totalx*curency;
                }else{
                    var totalx = dollarPrice*item.jumlah_beli;
                    if(totalx >= this.state.pungutan){
                        var beamasuk = totalx*this.state.bm/100;
                        var ppn = totalx*this.state.ppn/100;
                        var pph = totalx*this.state.pph/100;
                        var ppnbm = totalx*this.state.ppnbm/100;
                        var pajak = beamasuk+ppn+pph+ppnbm
                        var pajakrupiah = pajak*curency
                        var total = totalx+beamasuk+ppn+pph+ppnbm
                        var totalRupiah = total*curency;
                    }else{
                        var pajakrupiah=0;
                        var totalRupiah = totalx*curency;
                    }
                   
                }
            if(item.id !== this.state.selectedRow){
                
                return (
                    <tbody>
                        <tr key={item.id_customer} className="text-wrap" style={{fontSize:'12px'}}>  
                        <td className="align-middle">{item.nama_lengkap}</td>                      
                        <td className="align-middle">{item.nama_produk}</td>
                        <td className="align-middle text-danger">Rp. {rupiah.toLocaleString()}</td>
                        <td className="align-middle text-danger">$ {item.harga.toLocaleString()}</td>
                        <td className="align-middle text-danger">Rp {curency}</td>
                        <td className="align-middle text-danger">Rp {pajakrupiah.toLocaleString()}</td>
                        <td className="align-middle">{item.berat.toLocaleString()} gram</td>
                        <td className="align-middle">{item.jumlah_beli}</td>
                        <td className="align-middle"> {item.total_berat.toLocaleString()} gram</td>
                        <td className="align-middle"> Rp. {totalRupiah.toLocaleString()}</td>
                        <td className="align-middle">{item.negara}</td>
                    </tr>
                    <tr>
                    <td colspan="5"></td>
                    
                    <td className="text-secondary">Catatan:</td>
                    <td colspan="5" className="text-left text-secondary" >{item.catatan}</td>
                 </tr>
                    </tbody>
                )
            }
            return (
                <tr key={item.id_customer} className="text-wrap"  style={{fontSize:'12px'}}>
                    <td className="align-middle">{item.nama_lengkap}</td>                                          
                    <td className="align-middle">{item.nama_produk}</td>
                    <td className="align-middle text-danger">Rp. {item.harga.toLocaleString()}</td>
                    <td className="align-middle text-danger">$ {dollarPrice.toLocaleString()}</td>
                    <td className="align-middle text-danger">$ {dollarPrice.toLocaleString()}</td>
                    <td className="align-middle">{item.berat} gr</td>
                    <td className="align-middle"><input className="form-control col-lg-9 offset-lg-3" type="number" defaultValue={item.jumlah_beli} ref="jumlahEdit"/></td>
                    <td className="align-middle"> {item.total_berat}</td>
                    <td className="align-middle"> Rp. {totalRupiah.toLocaleString()}</td>
                    <td className="align-middle">{item.negara}</td>
                </tr>
            )
        })

        return listBuyer;
    }

    ringkasanBelanja = () => {
        var params = queryString.parse(this.props.location.search)
        var id_transaksi = params.id_transaksi
        var totalBerat = 0, totalBayar = 0, totalBuku = 0;

        for(let i = 0; i < this.state.listCart.length; i++){
            var harga = this.state.listCart[i].total_harga;
            
            if(this.state.level == 'BRONZE'){
                var curency = ((this.state.curency*this.state.bronze)/100)+this.state.curency
            }else if(this.state.level == 'SILVER'){
                var curency = ((this.state.curency*this.state.silver)/100)+this.state.curency
            }else if(this.state.level == 'GOLD'){
                var curency = ((this.state.curency*this.state.gold)/100)+this.state.curency
            }else if(this.state.level == 'PLATINUM'){
                var curency = ((this.state.curency*this.state.platinum)/100)+this.state.curency
            }
            var dollarPrice = harga
            if(dollarPrice >= this.state.pungutan){
                var beamasuk = dollarPrice*this.state.bm/100;
                var ppn = dollarPrice*this.state.ppn/100;
                var pph = dollarPrice*this.state.pph/100;
                var ppnbm = dollarPrice*this.state.ppnbm/100;
                var total = dollarPrice+beamasuk+ppn+pph+ppnbm
                var bayar = total*curency;
            }else{
                var bayar = dollarPrice*curency;
            }
            totalBerat += this.state.listCart[i].total_berat;
            totalBayar += bayar
            totalBuku += this.state.listCart[i].jumlah_beli;
        }
        
        return (
            <div>
                <table className="table table-hover text-left">
                    <tbody>
                        <tr >
                            <td><i className="fas fa-book"></i> Total Item </td>
                            <td>{totalBuku}</td>
                        </tr>
                        <tr>
                            <td><i className="fas fa-weight-hanging"></i> Total Berat</td>
                            <td>{totalBerat/1000} Kg</td>
                        </tr>
                        <tr>
                            <td><i className="fas fa-money-check-alt"></i> Total Harga</td>
                            <td className="text-danger">Rp. {totalBayar.toLocaleString()}</td>
                        </tr> 
                    </tbody>

                </table>
                <a href={`/agent/orderdetail?id=${id_transaksi}`}><button className="btn btn-success col-lg-12">Kembali</button></a>
            </div>
        );
    }
    onCheckOutButton = (total_bayar, total_berat) => {
        const { id_agent, email } = this.props.user;
        axios.post(`${KONEKSI}/transaction/addtransaction`, {
            id_agent,
            total_bayar,
            total_berat,
            email
        }).then((res) => {
            console.log(res.data.insertId);
            
            for(let i = 0; i < this.state.listCart.length; i++){
                axios.post(`${KONEKSI}/transaction/adddetailtransaction`, {
                    id_transaksi: res.data.insertId,
                    id_customer: this.state.listCart[i].id_customer,
                    id_produk: this.state.listCart[i].id_produk,
                    nama_produk: this.state.listCart[i].nama_produk,
                    harga: this.state.listCart[i].harga,
                    jumlah_beli: this.state.listCart[i].jumlah_beli,
                    total_harga: this.state.listCart[i].total_harga,
                    email,
                    total_bayar
                }).then((res1) => {
                    console.log(res1)
                    this.props.loadOfCart({id_agent});
                }).catch((err1) => {
                    console.log(err1)
                }) 
            }

            // CART Clearance
            axios.post(`${KONEKSI}/transaction/clearcart`, {
                id_agent
            }).then((res) => {
                console.log(res);
                //Redirect ke Halaman Konfirmasi Pembayaran
                alert('Cek Email. Pindah ke Hal.Konfirm Pembayaran')
                this.getDataBuyer();
            }).catch((err) => {
                console.log(err);
            })


        }).catch((err) => {
            console.log(err);
        })
    }
    renderPage=()=>{
        const { username, role } = this.props.user;
        if(this.state.listCart.length>0){
            return(
                <div>
                    
                                <div className="container-fluid">
                                <div className="row">
                                    <div className="card mt-2 shadow col-lg-12 pl-0 pr-0">
                                        <div className="card-header">
                                            <h4>Keranjang Belanja customermu</h4>
                                        </div>
                                        <div className="card-body">
                                            <table className="table table-hover">
                                                <thead className="blue text-white"> 
                                                    <tr>
                                                        <th scope="col">Nama Customer</th>
                                                        <th scope="col">Nama Produk</th>
                                                        <th scope="col">Harga Rupiah</th>
                                                        <th scope="col">Harga Dollar</th>
                                                        <th scope="col">Nilai Tukar Dollar {this.state.level}</th>
                                                        <th scope="col">Pajak</th>
                                                        <th scope="col">Berat</th>
                                                        <th scope="col">Jumlah</th>
                                                        <th scope="col">Total Berat</th>
                                                        <th scope="col">Total Harga</th>
                                                        <th scope="col">Negara</th>
                                                        
                                                       
                                                    </tr>
                                                </thead>
                                               
                                                {this.putDataBuyer()}
                                                
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6 pl-0 pr-0">
                                       
                                    </div>
                                    <div className="col-lg-6 pl-0 pr-0 mt-4">
                                    <div className="card mt-2 shadow">
                                            <div className="card-header">
                                                <p>Ringkasan Belanja</p>
                                            </div>
                                            <div className="card-body">
                                                {this.ringkasanBelanja()}
                                            </div>
                                        </div>
                                    </div>
                                   
                                </div>
                            </div>    
                </div>
            );
        }
    }
    render(){
        const { username, role } = this.props.user;

        if(username !== "" && role !== "Admin" ){
            return (
                <div className="container-fluid">
                    <div className="row">
                        <SidebarAgent order="aktif"/>

                        <div className="col-md-10 bg-light pl-3 pt-3">
                            {this.renderPage()}                      
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

export default connect(mapStateToProps, { loadOfCart })(OrderCustomer);