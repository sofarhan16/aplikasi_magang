import React, { Component} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import SidebarAgent from './SidebarAgent';
import axios from 'axios';
import { KONEKSI } from '../../support/config';
import Cookies from "universal-cookie";
import { loadOfCart } from '../../actions';
import ReactLoading from 'react-loading';
import moment from 'moment'

const cookies = new Cookies();
class CartAgent extends Component {
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

        bronzejpn:0,
        silverjpn:0,
        goldjpn:0,
        platinumjpn:0,

        bronzehkg:0,
        silverhkg:0,
        goldhkg:0,
        platinumhkg:0,

        bronzeaus:0,
        silveraus:0,
        goldaus:0,
        platinumaus:0,

        bronzekor:0,
        silverkor:0,
        goldkor:0,
        platinumkor:0,

        bronzemly:0,
        silvermly:0,
        goldmly:0,
        platinumly:0,

        bronzesg:0,
        silversg:0,
        goldsg:0,
        platinumsg:0,

        bronzeth:0,
        silverth: 0,
        goldth: 0,
        platinumth: 0,

        loading:'',
        shipping:[],
        negara:''
    }
    componentDidMount(){
        this.getDataBuyer()
        this.getDataBuyerAgent()
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
        var username = cookies.get('myPengguna');
        axios.get(`${KONEKSI}/transaction/getlistcartall/${username}`
        ).then((res) => {
            this.setState({ listCart: res.data, selectedRow: 0,negara:res.data[0].negara });
            console.log(this.state.listCart)
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
    getDataBuyerAgent=()=>{
        var username = cookies.get('myPengguna');
        axios.get(`${KONEKSI}/transaction/getlistchartagent/${username}`
        ).then((res) => {
            this.setState({ agentdata: res.data, selectedRow: 0 });
            console.log(this.state.agentdata)
            console.log('masuk')
        }).catch((err) => {
            console.log(err);
        })
    }
    
    getCurency=()=>{
        axios.get(`${KONEKSI}/transaction/curency`
        ).then((res) => {
            this.setState({ 
                curency: res.data[0].dollar, 
                bronze:res.data[0].bronze,
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
            console.log(res.data[1].silver)
            this.setState({ 
                bronzejpn: res.data[0].bronze,
                silverjpn:res.data[0].silver,
                goldjpn:res.data[0].gold,
                platinumjpn:res.data[0].platinum,

                bronzehkg: res.data[1].bronze,
                silverhkg:res.data[1].silver,
                goldhkg:res.data[1].gold,
                platinumhkg:res.data[1].platinum,

                bronzeaus: res.data[2].bronze,
                silveraus:res.data[2].silver,
                goldaus:res.data[2].gold,
                platinumaus:res.data[2].platinum,

                bronzekor:res.data[3].bronze,
                silverkor:res.data[3].silver,
                goldkor:res.data[3].gold,
                platinumkor:res.data[3].platinum,

                bronzemly: res.data[4].bronze,
                silvermly:res.data[4].silver,
                goldmly:res.data[4].gold,
                platinummly:res.data[4].platinum, 

                bronzesg: res.data[5].bronze,
                silversg:res.data[5].silver,
                goldsg:res.data[5].gold,
                platinumsg:res.data[5].platinum, 

                bronzeth: res.data[6].bronze,
                silverth:res.data[6].silver,
                goldth:res.data[6].gold,
                platinumth:res.data[6].platinum, 
                
            });
            // console.log(this.state.shipping[0].gold)
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
                        <td className="align-middle"> {item.total_berat.toLocaleString()}</td>
                        <td className="align-middle">{item.provinsi == "West Java" ?  "11000":
                                                      item.provinsi == "East Java" ? "19000" :
                                                      item.provinsi == "Central Java" ? "22000" :
                                                      item.provinsi == "DKI Jakarta" ? "9000" :
                                                      "37000"}</td>
                        <td className="align-middle">{item.negara}</td>
                        <td className="align-middle"><a href={`/agent/cartcustomer?id=${item.id_customer}`}><button type="button" className="btn btn-default orange"><i class="fas fa-chevron-right"></i></button></a></td>
                    </tr>
                )
            }
        })

        return listBuyer;
    }
    
    ringkasanBelanja = (limit) => {
        // console.log(shipping[0])
       
        var totalBerat = 0, totalBayar = 0, totalBuku = 0;
        for(let i = 0; i < this.state.agentdata.length; i++){
            var harga = this.state.agentdata[i].total_harga;
          
            if(this.state.level == 'BRONZE'){

                if(this.state.negara=="Japan"){
                    var paket = ((this.state.curency*this.state.bronze)/100)+this.state.curency
                    var weight = this.state.bronzejpn*paket
                }else if(this.state.negara=="Hongkong"){
                    var paket = ((this.state.curency*this.state.bronze)/100)+this.state.curency
                    var weight = this.state.bronzehkg*paket
                }else if(this.state.negara == "Australia"){
                    var paket = ((this.state.curency*this.state.bronze)/100)+this.state.curency
                    var weight = this.state.bronzeaus*paket

                }else if(this.state.negara == "Korea Selatan"){
                    var paket = ((this.state.curency*this.state.bronze)/100)+this.state.curency
                    var weight = this.state.bronzekor*paket

                }else if(this.state.negara == "Malaysia"){
                    var paket = ((this.state.curency*this.state.bronze)/100)+this.state.curency
                    var weight = this.state.bronzemly*paket

                }else if(this.state.negara == "Singapore"){
                    var paket = ((this.state.curency*this.state.bronze)/100)+this.state.curency
                    var weight = this.state.bronzesg*paket

                }else if(this.state.negara == "Thailand"){
                    var paket = ((this.state.curency*this.state.bronze)/100)+this.state.curency
                    var weight = this.state.bronzeth*paket

                }

            }else if(this.state.level == 'SILVER'){
              
                if(this.state.negara=="Japan"){
                    var paket = ((this.state.curency*this.state.silver)/100)+this.state.curency
                    var weight = this.state.silverjpn*paket
                }else if(this.state.negara=="Hongkong"){
                    var paket = ((this.state.curency*this.state.silver)/100)+this.state.curency
                    var weight = this.state.silverhkg*paket
                }else if(this.state.negara == "Australia"){
                    var paket = ((this.state.curency*this.state.silver)/100)+this.state.curency
                    var weight = this.state.silveraus*paket

                }else if(this.state.negara == "Korea Selatan"){
                    var paket = ((this.state.curency*this.state.silver)/100)+this.state.curency
                    var weight = this.state.silverkor*paket

                }else if(this.state.negara == "Malaysia"){
                    var paket = ((this.state.curency*this.state.silver)/100)+this.state.curency
                    var weight = this.state.silvermly*paket

                }else if(this.state.negara == "Singapore"){
                    var paket = ((this.state.curency*this.state.silver)/100)+this.state.curency
                    var weight = this.state.silversg*paket

                }else if(this.state.negara == "Thailand"){
                    var paket = ((this.state.curency*this.state.silver)/100)+this.state.curency
                    var weight = this.state.silverth*paket

                }
                // else{
                //      var paket = ((this.state.curency*this.state.silver)/100)+this.state.curency
                // var weight = this.state.silverjpn*paket
                // }
                
            }else if(this.state.level == 'GOLD'){
                if(this.state.negara=="Japan"){
                    var paket = ((this.state.curency*this.state.gold)/100)+this.state.curency
                    var weight = this.state.goldjpn*paket
                }else if(this.state.negara=="Hongkong"){
                    var paket = ((this.state.curency*this.state.gold)/100)+this.state.curency
                    var weight = this.state.goldhkg*paket
                }else if(this.state.negara == "Australia"){
                    var paket = ((this.state.curency*this.state.gold)/100)+this.state.curency
                    var weight = this.state.goldaus*paket

                }else if(this.state.negara == "Korea Selatan"){
                    var paket = ((this.state.curency*this.state.gold)/100)+this.state.curency
                    var weight = this.state.goldkor*paket

                }else if(this.state.negara == "Malaysia"){
                    var paket = ((this.state.curency*this.state.gold)/100)+this.state.curency
                    var weight = this.state.goldmly*paket

                }else if(this.state.negara == "Singapore"){
                    var paket = ((this.state.curency*this.state.gold)/100)+this.state.curency
                    var weight = this.state.goldsg*paket

                }else if(this.state.negara == "Thailand"){
                    var paket = ((this.state.curency*this.state.gold)/100)+this.state.curency
                    var weight = this.state.goldth*paket

                }
                // else{
                //     var paket = ((this.state.curency*this.state.gold)/100)+this.state.curency
                //     var weight = this.state.goldjpn*paket
                // }
                
               
            }else if(this.state.level == 'PLATINUM'){
                if(this.state.negara=="Japan"){
                    var paket = ((this.state.curency*this.state.platinum)/100)+this.state.curency
                var weight = this.state.platinumjpn*paket
                }else if(this.state.negara=="Hongkong"){
                    var paket = ((this.state.curency*this.state.platinum)/100)+this.state.curency
                    var weight = this.state.platinumhkg*paket
                }else if(this.state.negara == "Australia"){
                    var paket = ((this.state.curency*this.state.platinum)/100)+this.state.curency
                    var weight = this.state.platinumaus*paket
                }else if(this.state.negara == "Korea Selatan"){
                    var paket = ((this.state.curency*this.state.platinum)/100)+this.state.curency
                    var weight = this.state.platinumkor*paket

                }else if(this.state.negara == "Malaysia"){
                    var paket = ((this.state.curency*this.state.platinum)/100)+this.state.curency
                    var weight = this.state.platinummly*paket

                }else if(this.state.negara == "Singapore"){
                    var paket = ((this.state.curency*this.state.platinum)/100)+this.state.curency
                    var weight = this.state.platinumsg*paket

                }else if(this.state.negara == "Thailand"){
                    var paket = ((this.state.curency*this.state.platinum)/100)+this.state.curency

                    var weight = this.state.platinumth*paket
                }

                
                // else{
                //    var paket = ((this.state.curency*this.state.platinum)/100)+this.state.curency
                // var weight = this.state.platinumjpn*paket
                // }
                
            }
            console.log(paket)
            var dollarPrice = harga;
            if(dollarPrice >= this.state.pungutan){
                var beamasuk = dollarPrice*this.state.bm/100;
                var ppn = dollarPrice*this.state.ppn/100;
                if(this.state.agentdata[i].npwp >0){
                    var pph = dollarPrice*this.state.pph/100;
                }else{
                    var pph2 =this.state.pph*2
                    var pph = dollarPrice*pph2/100;
                }
            //    var pph=0;
                var ppnbm = dollarPrice*this.state.ppnbm/100;
                var total = dollarPrice+beamasuk+ppn+pph+ppnbm
                var bayar = total*paket;
            }else{
                var bayar = dollarPrice*paket;
            }
            totalBerat += this.state.agentdata[i].total_berat;
            totalBayar += bayar
            totalBuku += this.state.agentdata[i].jumlah_beli;
        }
      
        if(this.state.level == 'BRONZE'){
            var transactionfee = totalBayar*this.state.bronze2/100
            var fee = this.state.bronze2
        }else if(this.state.level == 'SILVER'){
            var transactionfee = totalBayar*this.state.silver2/100
            var fee = this.state.silver2
        }else if(this.state.level == 'GOLD'){
            var transactionfee = totalBayar*this.state.gold2/100
            var fee = this.state.gold2
        }else if(this.state.level == 'PLATINUM'){
            var transactionfee = totalBayar*this.state.platinum2/100
            var fee = this.state.platinum2
        }
        // if(transactionfee == undefined){
        //     window.location.reload()
        // }

       var { listCart } = this.state
       var deli = 0
        for(var i = 0; i < listCart.length; i++){

            if(listCart[i].provinsi == "West Java"){
                deli += 11000
            }else if(listCart[i].provinsi == "East Java"){
                deli += 19000
            }else if(listCart[i].provinsi == "Central Java"){
                deli += 22000
            }else if(listCart[i].provinsi == "DKI Jakarta"){
                deli += 9000
            }else{
                deli += 37000
            }

        }
        console.log(deli)
        console.log(paket)

        var hargashipping = (totalBerat/1000)* weight;
        var totalakhir = Math.ceil(totalBayar+Math.round(transactionfee)+Math.round(hargashipping)+Math.round(deli));

    //    var limit = this.props.user.limit;
       console.log(limit)
       if(limit != null){
           if(totalakhir<limit){
            return (
                <div>
                    <table className="table table-hover text-left">
                        <tbody>
                            <tr >
                                <td><i class='fas fa-shopping-basket'></i> Total Item </td>
                                <td>{totalBuku}</td>
                            </tr>
                            <tr>
                                <td><i className="fas fa-weight-hanging"></i> Total Berat</td>
                                <td>{totalBerat/1000} Kg</td>
                            </tr>
                           
                            <tr>
                                <td><i className="fas fa-money-check-alt"></i> Total</td>
                                <td>Rp. {parseInt(totalBayar).toLocaleString()}</td>
                            </tr> 
                            <tr>
                                <td><i className="fas fa-money-check-alt"></i> Transaction fee {fee}% </td>
                                <td>Rp. {Math.round(transactionfee).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td><i class='fas fa-ship'></i>  Shipping fee</td>
                                <td>Rp {Math.round(hargashipping).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td><i class='fas fa-shipping-fast'></i> Delivery fee</td>
                                <td>Rp {deli}</td>
                            </tr>
                            <tr>
                                <td><i className="fas fa-money-check-alt"></i> Total Bayar</td>
                                <td className="text-danger">Rp. {totalakhir.toLocaleString()}</td>
                            </tr> 
                        </tbody>
    
                    </table>
                    <button className="btn btn-default orange col-lg-12" onClick={() => {this.onCheckOutButton(totalakhir,totalBerat,totalBuku,transactionfee,hargashipping)}}>Checkout <i className="fas fa-arrow-alt-circle-right"></i></button>
                </div>
            );
           }else{
            return (
                <div>
                    <table className="table table-hover text-left">
                        <tbody>
                            <tr >
                                <td><i class='fas fa-shopping-basket'></i>  Total Item </td>
                                <td>{totalBuku}</td>
                            </tr>
                            <tr>
                                <td><i className="fas fa-weight-hanging"></i> Total Berat</td>
                                <td>{totalBerat/1000} Kg</td>
                            </tr>
                          
                            <tr>
                                <td><i className="fas fa-money-check-alt"></i> Total</td>
                                <td>Rp. {totalBayar.toLocaleString()}</td>
                            </tr> 
                            <tr>
                                <td><i className="fas fa-money-check-alt"></i> Transaction fee {fee}% </td>
                                <td>Rp. {Math.round(transactionfee).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td><i class='fas fa-ship'></i> Shipping fee</td>
                                <td>Rp {Math.round(hargashipping).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td><i class='fas fa-shipping-fast'></i> Delivery fee</td>
                                <td>Rp {deli}</td>
                            </tr>
                            <tr>
                                <td><i className="fas fa-money-check-alt"></i> Total Bayar</td>
                                <td className="text-danger">Rp. {totalakhir.toLocaleString()}</td>
                            </tr> 
                        </tbody>
    
                    </table>
                    <button className="btn btn-danger col-lg-12">your limit is below the transaction value <i className="far fa-frown"></i></button>
                </div>
            );
           }
       }else{
        return (
            <div>
                <table className="table table-hover text-left">
                    <tbody>
                        <tr >
                            <td><i class='fas fa-shopping-basket'></i> Total Item </td>
                            <td>{totalBuku}</td>
                        </tr>
                        <tr>
                            <td><i className="fas fa-weight-hanging"></i> Total Berat</td>
                            <td>{totalBerat/1000} Kg</td>
                        </tr>
                       
                        <tr>
                            <td><i className="fas fa-money-check-alt"></i> Total</td>
                            <td>Rp. {parseInt(totalBayar).toLocaleString()}</td>
                        </tr> 
                        <tr>
                            <td><i className="fas fa-money-check-alt"></i> Transaction fee {fee}% </td>
                            <td>Rp. {Math.round(transactionfee).toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td><i class='fas fa-ship'></i>  Shipping fee</td>
                            <td>Rp {Math.round(hargashipping).toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td><i class='fas fa-shipping-fast'></i> Delivery fee</td>
                            <td>Rp {deli}</td>
                        </tr>
                        <tr>
                            <td><i className="fas fa-money-check-alt"></i> Total Bayar</td>
                            <td className="text-danger">Rp. {totalakhir.toLocaleString()}</td>
                        </tr> 
                    </tbody>

                </table>
                <button className="btn btn-default orange col-lg-12" onClick={() => {this.onCheckOutButton(totalakhir,totalBerat,totalBuku,transactionfee,hargashipping)}}>Checkout <i className="fas fa-arrow-alt-circle-right"></i></button>
            </div>
        );
       }
        
    }
    onCheckOutButton = (totalakhir,totalBerat,totalBuku,transactionfee,hargashipping) => {
        this.setState({loading:'loading'})
        var bpom = window.confirm("Apakah kamu yakin sudah upload form BPOM? karna jika belum maka akan menghambat proses transaksimu")
        if(bpom){
            const { id_agent, email } = this.props.user;
        axios.post(`${KONEKSI}/transaction/addtransaction`, {
            id_agent,
            total_bayar:totalakhir,
            total_berat:totalBerat,
            total_beli:totalBuku,
            transactionfee,
            hargashipping,
            email
        }).then((res) => {
            console.log(res.data.insertId);
            const { id_agent } = this.props.user;
            console.log(res.data.newId)
            for(let i = 0; i < this.state.agentdata.length; i++){
                axios.post(`${KONEKSI}/transaction/adddetailtransaction`, {
                    id_transaksi: res.data.newId,
                    id_agent: id_agent,
                    id_customer: this.state.agentdata[i].id_customer,
                    id_produk: this.state.agentdata[i].id_produk,
                    nama_produk: this.state.agentdata[i].nama_produk,
                    harga: this.state.agentdata[i].harga,
                    jumlah_beli: this.state.agentdata[i].jumlah_beli,
                    total_harga: this.state.agentdata[i].total_harga,
                    email,
                    catatan:this.state.agentdata[i].catatan,
                    bpom:this.state.agentdata[i].bpom,
                    id_negara: this.state.agentdata[i].id_negara,
                    id_kategori: this.state.agentdata[i].kategori,
                    berat: this.state.agentdata[i].berat,
                    tot_berat: this.state.agentdata[i].total_berat,
                    waktu: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

                }).then((res1) => {
                    console.log(res1)
                    // this.props.loadOfCart({id_agent});
                  
                }).catch((err1) => {
                    console.log(err1)
                    this.setState({loading:'berenti'})
                }) 
            }

            // CART Clearance
            axios.post(`${KONEKSI}/transaction/clearcart`, {
                id_agent
            }).then((res) => {
                console.log(res);
                //Redirect ke Halaman Konfirmasi Pembayaran
                this.getDataBuyer();
                window.location="/agent/confirmpayment"
            }).catch((err) => {
                console.log(err);
                this.setState({loading:'berenti'})
            })
            // update limit
            if(this.props.user.level == "SILVER" || this.props.user.level == "BRONZE"){
                var limit = this.props.user.limit - totalakhir;
            axios.post(`${KONEKSI}/auth/updatelimit`, {
                id_agent,limit,level:this.props.user.level
            }).then((res) => {
                console.log(res);
                //Redirect ke Halaman Konfirmasi Pembayaran

                alert(`Your limit has been reduced`)
                window.location="/agent/confirmpayment"
            }).catch((err) => {
                console.log(err);
                this.setState({loading:'berenti'})
            })

            }
            
            this.setState({loading:'berenti'})
        }).catch((err) => {
            console.log(err);
            this.setState({loading:'berenti'})
        })
        }
    }
    // getDataBpom=()=>{
    //     var jumlah_bpom_null=0
    //     var getbpom = this.state.agentdata.map(item=>{
         
    //         if(item.kategori == 1 || item.kategori == 10 || item.kategori==15){
    //             var bpom = item.bpom
               
    //         }
    //     })
    //     return getbpom
    // }
    renderPage=()=>{
        const { username, role, limit } = this.props.user;
        console.log(limit)
       if(this.state.loading == 'loading'){
           return(
            <div className="row loading" style={{borderRadius: "5px"}}>
            <ReactLoading type='cylon' color="#065286" height={100} width={190} />
        </div>
           )
       }
       if(this.state.listCart.length>0){
        return(
            <div>
                <div className="alert blue text-white font-weight-bold media col-12">
                                <div className="col-md-12 media-body">
                                    <h4>Keranjang belanja pelanggan</h4>
                                </div>
                            </div> 
                            <div className="container-fluid">
                            <div className="row">
                                <div className="card mt-2 shadow col-lg-12 pl-0 pr-0">
                                    {/* <div className="card-header">
                                        <h4>Keranjang Belanja customermu</h4>
                                    </div> */}
                                    <div className="card-body">
                                        <table className="table table-hover">
                                            <thead className="blue text-white">
                                                <tr>
                                                    <th scope="col">Nama Customer</th>
                                                    {/* <th scope="col">Nama Produk</th>
                                                    <th scope="col">Harga Rupiah</th>
                                                    <th scope="col">Harga Dollar</th>
                                                    <th scope="col">Berat</th> */}
                                                    <th scope="col">Jumlah</th>
                                                    <th scope="col">Total Berat</th>
                                                    <th>Delivery Fee</th>
                                                    <th scope="col">Negara</th>
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
                                <div className="col-lg-6 pl-0 pr-0 mt-1 p-2">
                                <div className="card  shadow">
                                <div className="card-header">
                                                <p>BPOM Form Upload</p>
                                            </div>
                                            <div className="card-body">
                                            <p>Jika produk yang di beli oleh customermu mengandung kategori makanan atau obat obatan, customer diwajibkan mengisi form bpom untuk melanjutkan pemesanan. Cek detail harga untuk mengupload di setiap pesanan customer</p>
                                               <table className="table table-hover text-left">
                                               <tbody>
                                            
                                                </tbody>
                                               </table>
                                </div>

                                            </div>
                                    
                                </div>
                                <div className="col-lg-6 pl-0 pr-0">
                                    <div className="card mt-2 shadow">
                                        <div className="card-header">
                                            <p>Ringkasan Belanja</p>
                                        </div>
                                        <div className="card-body">
                                            {this.ringkasanBelanja(limit)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>    
            </div>
        );
    }else{
        return(
            <div className="alert blue media col-12">
            <div className="col-md-12 media-body text-white font-weight-bold text-center">
                <h4>Keranjangmu kosong</h4>
            </div>
        </div>
        )
    }
    }
    render(){
        console.log(this.state.agentdata)
        const { username, role } = this.props.user;
        console.log(this.state.listCart)
        if(username !== "" && role !== "Admin" ){
            return (
                <div className="container-fluid">
                    <div className="row">
                        <SidebarAgent cart="aktif"/>

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

export default connect(mapStateToProps, { loadOfCart })(CartAgent);