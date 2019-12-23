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
class InvoiceCustomer extends Component {
    state={
        listCart:[],
        selectedRow:0,
        curency:0,
        agentdata:[],
        cukai:[],
        bm:0,
        ppn:0,
        pph:0,
        ppnbm:0,
        pungutan:0,
        level:'',

        bronze:0,
        silver:0,
        gold:0,
        platinum:0,

        bronze2:0,
        silver2:0,
        gold2:0,
        platinum2:0,

        bronze3:0,
        silver3:0,
        gold3:0,
        platinum3:0,

        report:[],
        username:""
    }
    componentDidMount(){
        this.getDataBuyer()
        this.getReportshopping()
        this.getCurency()
        this.getCukai()
        this.getShipping()
        this.getTransactionfee()
    }
    getCukai = () => {
        axios.get(`${KONEKSI}/transaction/cukai`
        ).then((res) => {
            this.setState({
                cukai: res.data,
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
    getDataBuyer=()=>{
        var params = queryString.parse(this.props.location.search);
        var id_transaksi = params.id
        axios.get(`${KONEKSI}/transaction/getlistordercustomerdetailinvoice/${id_transaksi}`
        ).then((res) => {
            this.setState({ listCart: res.data, selectedRow: 0 ,username:res.data[0].username});
            console.log(this.state.listCart)
                axios.post(`${KONEKSI}/auth/keeplogin`,{
                    username:res.data[0].username
                }
                ).then((res2) => {
                    this.setState({ level: res2.data[0].level});
                    console.log(this.state.level)
                }).catch((err) => {
                    console.log(err);
                })
        }).catch((err) => {
            console.log(err);
        })
    }
    getReportshopping=()=>{
        var params = queryString.parse(this.props.location.search);
        var id_transaksi = params.id
        axios.get(`${KONEKSI}/transaction/getreportorder/${id_transaksi}`
        ).then((res) => {
            this.setState({ report: res.data, selectedRow: 0 });
            console.log(this.state.report)
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
                selectedRow: 0,
                // silver2:res.data[1].silver,
                // gold2:res.data[1].gold,
                // platinum2:res.data[1].platinum, 
            });
        }).catch((err) => {
            console.log(err);
        })
    }
     
    getTransactionfee=()=>{
        axios.get(`${KONEKSI}/transaction/transactionfee`
        ).then((res) => {
            this.setState({ 
                bronze2:res.data[0].bronze,
                silver2:res.data[0].silver,
                gold2:res.data[0].gold,
                platinum2:res.data[0].platinum, 
            });
        }).catch((err) => {
            console.log(err);
        })
    }
    getShipping=()=>{
        axios.get(`${KONEKSI}/transaction/shipping`
        ).then((res) => {
            this.setState({ 
                bronze3: res.data[0].bronze,
                silver3:res.data[0].silver,
                gold3:res.data[0].gold,
                platinum3:res.data[0].platinum, 
            });
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
        
        var totalBerat = 0, totalBayar = 0, totalBeli = 0, hargashipping=0,transactionfee=0,totalakhir=0;
        for(let i = 0; i < this.state.report.length; i++){
            totalBerat += this.state.report[i].total_berat;
            totalakhir += this.state.report[i].total_bayar;
            totalBeli += this.state.report[i].total_beli;
            hargashipping += this.state.report[i].hargashipping
            transactionfee += this.state.report[i].transactionfee
        }
      
        if(this.state.level == 'BRONZE'){
            var fee = this.state.bronze2
        }else if(this.state.level == 'SILVER'){
           
            var fee = this.state.silver2
        }else if(this.state.level == 'GOLD'){
          
            var fee = this.state.gold2
        }else if(this.state.level == 'PLATINUM'){
           
            var fee = this.state.platinum2
        }
        return (
            <div>
                <table className="table table-hover text-left">
                    <tbody>
                        <tr >
                            <td><i className="fas fa-book"></i> Total Item </td>
                            <td>{totalBeli}</td>
                        </tr>
                        <tr>
                            <td><i className="fas fa-weight-hanging"></i> Total Berat</td>
                            <td>{totalBerat/1000} Kg</td>
                        </tr>
                        <tr>
                            <td><i className="fas fa-money-check-alt"></i> Total</td>
                            <td>Rp. {(totalakhir-transactionfee-hargashipping).toLocaleString()}</td>
                        </tr> 
                        <tr>
                            <td><i className="fas fa-weight-hanging"></i> Shipping fee</td>
                            <td>Rp {Math.round(hargashipping).toLocaleString()}</td>
                        </tr>
                       
                        <tr>
                            <td><i className="fas fa-money-check-alt"></i> Transaction fee {fee}% </td>
                            <td>Rp. {Math.round(transactionfee).toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td><i className="fas fa-money-check-alt"></i> Total Bayar</td>
                            <td className="text-danger">Rp. {totalakhir.toLocaleString()}</td>
                        </tr> 
                    </tbody>

                </table>
               
            </div>
        );
    }
    
    renderPage=()=>{
        var params = queryString.parse(this.props.location.search);
        var id_transaksi = params.id
        const { username, role } = this.props.user;
        var arrbulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
        var date = new Date()
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();
        var tanggal = day+" "+" "+arrbulan[month]+" "+year
        var dates =year+""+""+month+""+day
        if(this.state.listCart.length > 0){
            return(
                <div>
                        <div className="text-left">
                        <img src="../logo.png" width='70px' className="mr-3"/><span className="judulbig">Warehousenesia</span>
                            <div className="mt-5 mb-3">
                                <h4 className="font-weight-bold mb-2">INVOICE</h4>
                                <p>Diterbitkan atas nama :</p>
                                <p className="font-weight-bold">Member <span className="pl-5 text-dark">{this.state.username}</span></p>
                                <p className="font-weight-bold">Nomor <span className="pl-5 text-dark">INV/WN/{dates}/{id_transaksi}</span></p>
                                <p className="font-weight-bold">Tanggal <span className="pl-5 text-dark">{tanggal}</span></p>
                            </div>
                        </div>
                       
                                <div className="container-fluid">
                                <div className="row">
                                    <div className="card mt-2 shadow col-lg-12 pl-0 pr-0">
                                        {/* <div className="card-header">
                                            <h4>History Order Customermu</h4>
                                           <a href='/agent/order'> <button className="btn btn-success float-right">kembali</button></a>
                                        </div> */}
                                        <div className="card-body">
                                            <table className="table table-hover">
                                                <thead className="blue">
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
                                <div className="row mb-4">
                                    <div className="col-lg-6 col-md-6 pl-0 pr-0">
                                    <div className="text-center">
                                            <p className="mt-4">Invoice ini adalah bukti pembayaran yang sah</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 pl-0 pr-0">
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
    printInvoice=()=>{
        window.print()
    }
    render(){
        const { username, role, level } = this.props.user;
        

        if(username !== "" ){
            return (
                <div className="">
                 <div className="float-right mr-5">
                    <button className="btn btn-default orange" onClick={this.printInvoice}><i class="fa fa-print" aria-hidden="true"></i></button>
                 </div>
                    <div className="container">
                      
                        
                      
                     
                            {this.renderPage()}                      
                      
                    
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

export default connect(mapStateToProps, { loadOfCart })(InvoiceCustomer);