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
class orderDetail extends Component {
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

        report:[]
    }
    componentDidMount(){
        this.getDataBuyer()
        this.getReportshopping()
        this.getCurency()
        this.getCukai()
        this.getuser()
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
        axios.get(`${KONEKSI}/transaction/getlistorderdetail/${id_transaksi}`
        ).then((res) => {
            this.setState({ listCart: res.data, selectedRow: 0 });
            console.log(this.state.listCart)
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
                bronze2: res.data[0].bronze,
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
                bronze3:res.data[0].bronze,
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
            if(item.id_customer !== this.state.selectedRow){
                // var dollarPrice = item.harga/this.state.curency
                // if(dollarPrice >= 75){
                //     var beamasuk = dollarPrice*0.075;
                //     var ppn = dollarPrice*0.1;
                //     var pph = dollarPrice*0.1;
                //     var total = dollarPrice+beamasuk+ppn+pph
                //     var totalRupiah = total*this.state.curency;
                // }else{
                //     var totalRupiah = dollarPrice*this.state.curency;
                // }
                return (
                    <tr key={item.id_customer} className="text-wrap" style={{fontSize:'12px'}}>  
                        <td className="align-middle">{item.nama_lengkap}</td>                      
                        {/* <td className="align-middle">{item.nama_produk}</td>
                        <td className="align-middle text-danger">Rp. {item.harga.toLocaleString()}</td>
                        <td className="align-middle text-danger">$ {dollarPrice.toLocaleString()}</td>
                        <td className="align-middle">{item.berat} gr</td> */}
                        <td className="align-middle">{item.jumlah_beli}</td>
                        {/* <td className="align-middle"> {item.berat.toLocaleString()}</td>
                        
                        <td className="align-middle">{item.negara}</td> */}
                        <td className="align-middle"><a href={`/agent/ordercustomer?id_transaksi=${item.id_transaksi}&&id_customer=${item.id_customer}`}><button type="button" className="btn btn-success"><i class="fas fa-chevron-right"></i></button></a></td>
                    </tr>
                )
            }
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
        if(this.state.listCart.length>0){
            return(
                <div>
                   
                                <div className="container-fluid">
                                <div className="row">
                                    <div className="card mt-2 shadow col-lg-12 pl-0 pr-0">
                                        <div className="card-header">
                                            <h4>History Order Customermu</h4>
                                            <a href={`/invoicecustomer?id=${id_transaksi}`}> <button className="btn btn-success float-left">Invoice</button></a>
                                           <a href='/agent/order'> <button className="btn btn-success float-right">kembali</button></a>
                                        </div>
                                        <div className="card-body">
                                            <table className="table table-hover">
                                                <thead className="blue">
                                                    <tr>
                                                        <th scope="col">Nama Customer</th>
                                                        {/* <th scope="col">Nama Produk</th>
                                                        <th scope="col">Harga Rupiah</th>
                                                        <th scope="col">Harga Dollar</th>
                                                        <th scope="col">Berat</th> */}
                                                        <th scope="col">Jumlah</th>
                                                        {/* <th scope="col">Total Berat</th>
                                                        <th scope="col">Negara</th> */}
                                                        <th>Detail Harga</th>
                                                        
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {this.putDataBuyer()}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6 pl-0 pr-0">
                                       
                                    </div>
                                    <div className="col-lg-6 pl-0 pr-0">
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
        }else{
            return(
                <div className="alert alert-warning media col-12">
                <img className="img img-fluid" src="http://localhost:3000/images/flat/039-stadistics.png" width="100px" />
                <div className="col-md-10 media-body">
                    <h4>Keranjangmu kosong</h4>
                </div>
            </div>
            )
        }
    }
    render(){
        const { username, role } = this.props.user;

        if(username !== "" && role !== "Admin" ){
            return (
                <div className="container-fluid">
                  
                    <div className="row">
                        <SidebarAgent order="aktif"/>
                        
                        <div className="col-md-10 bg-light pl-3 pt-3" >
                     
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

export default connect(mapStateToProps, { loadOfCart })(orderDetail);