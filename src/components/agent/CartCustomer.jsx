import React, { Component} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import SidebarAgent from './SidebarAgent';
import axios from 'axios';
import { KONEKSI } from '../../support/config';
import Cookies from "universal-cookie";
import { loadOfCart } from '../../actions';
import queryString from 'query-string';
import ReactLoading from 'react-loading';
import { FormGroup, Input, FormText } from 'reactstrap';
const cookies = new Cookies();
class CartCustomer extends Component {
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
        platinum:0,
        npwp:0,
        catatan:"",
        loading:''
    }
    componentDidMount(){
        this.getDataBuyer()
        this.getCurency()
        this.getuser()
        this.getCukai()
        this.getCustomerByid()
    }
    getCustomerByid=()=>{
        var params = queryString.parse(this.props.location.search)
        var id = params.id;
        console.log(id)
        var username = cookies.get('myPengguna');
        axios.post(`${KONEKSI}/customer/getcustomerid`,{
            username,id
        }
        ).then((res) => {
            this.setState({npwp: res.data[0].npwp});   
            console.log(res.data)        
        }).catch((err) => {
            console.log(err);
        })
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
        var id = params.id;
        axios.get(`${KONEKSI}/transaction/getlistcart/${id}`
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
    noteBox=(e)=>{
        // console.log(e.target.value)
        this.setState({catatan:e.target.value});
    }
    updateCatatan=(id)=>{
       
       
        var catatan = this.state.catatan;
        console.log(catatan)
        axios.post(`${KONEKSI}/transaction/editcatatancustomer`, {
           id,catatan
        }).then((res) => {
            // this.getDataBuyer();
            alert('catatan berhasil ditambahkan')
            console.log(res.data)
        }).catch((err) => {
            console.log(err)
        })

    }
    uploadBPOM=(id,kategori,bpom)=>{
            
            if(kategori == 1 || kategori == 2 || kategori==3){
                return(
                   <div className="row">
                        <div className="col-6">
                         <p className="text-left">Upload form bpom</p>
                        <small className="text-left text-secondary">upload file kembali jika ingin mengedit file</small>
                        <Input type="file"  className="form-control form-control-sm " id={`bpomfile${id}`} name="bpomfile"  />
                        <p className="text-left">File berhasil terupload :</p>
                        <p className="text-left bg-light text-success">{bpom}</p>
                    </div>
                    <div className="col-4 text-left mt-4">
                        <button className="btn btn-default orange" onClick={()=>this.onBtnSaveFile(id)}>Upload</button>
                    </div>
                   </div>
                )
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
            // if(curency == undefined){
            //     window.location.reload()
            // }
            //    105000
            
            var rupiah = item.harga*curency
            var dollarPrice =item.harga*item.jumlah_beli;
            console.log(this.state.npwp)
                if(dollarPrice >= this.state.pungutan){
                    var beamasuk = dollarPrice*this.state.bm/100;
                    var ppn = dollarPrice*this.state.ppn/100;
                    if(this.state.npwp != 0){
                        var pph = dollarPrice*this.state.pph/100;
                    }else{
                        console.log("masuk")
                        var pph2 =this.state.pph*2
                        var pph = dollarPrice*pph2/100;
                    }
                    var ppnbm = dollarPrice*this.state.ppnbm/100;
                    var total = dollarPrice+beamasuk+ppn+pph+ppnbm
                    var pajak = beamasuk+ppn+pph+ppnbm
                    var pajakrupiah = pajak*curency
                   
                    var totalRupiah = total*curency;

                    console.log(curency)
                    console.log(dollarPrice)
                    console.log(beamasuk)
                    console.log(ppn)
                    console.log(pph)
                    console.log(ppnbm)
                    console.log(pajak)
                    console.log(pajakrupiah)

                }else{
                   
                    var pajakrupiah=0;
                        var totalRupiah = dollarPrice*curency;
                }
            if(item.id !== this.state.selectedRow){
                
                return (
                    <tbody>
                        <tr key={item.id_customer} className="text-wrap" style={{fontSize:'12px'}}>  
                            <td className="align-middle">{item.nama_lengkap}</td>  
                            <td className="align-middle"><img src={KONEKSI+item.gambar} alt="" width="100%"/></td>                      
                            <td className="align-middle">{item.nama_produk}</td>
                            <td className="align-middle">{item.berat.toLocaleString()} gram</td>
                            <td className="align-middle text-danger">Rp {curency}</td>
                            <td className="align-middle text-danger">$ {item.harga.toLocaleString()}</td>
                    
                            <td className="align-middle text-danger">Rp. {Math.round(rupiah).toLocaleString()}</td>
                            <td className="align-middle text-danger">Rp {Math.round(pajakrupiah).toLocaleString()}</td>
                        
                            <td className="align-middle">{item.jumlah_beli}</td>
                            <td className="align-middle"> {item.total_berat.toLocaleString()} gram</td>
                            <td className="align-middle"> Rp. {Math.round(totalRupiah).toLocaleString()}</td>
                            <td className="align-middle">{item.negara}</td>
                            
                            <td className="align-middle"><button type="button" className="btn btn-warning" onClick={() => this.setState({selectedRow: item.id})}   ><i className="fas fa-edit"></i></button></td>
                            <td className="align-middle"><button type="button" className="btn btn-danger" onClick={() => this.onBtnDeleteClick(item)} ><i className="fas fa-trash-alt"></i></button></td>
                        </tr>
                        <tr>
                           <td colspan="5">
                            {this.uploadBPOM(item.id,item.kategori,item.bpom)}
                            {this.loading1()}
                           </td>
                           
                           <td><p className="mt-2">Catatan</p></td>
                           <td colspan="5"  ><input type="text" className="form-control form-control-sm mt-2" ref="addnote" id="addnote" onChange={this.noteBox} placeholder="*buat catatan disini contoh warna merah" id="note" defaultValue={item.catatan}/></td>
                           <td colspan="2">
                           <button className="btn btn-default orange btn-sm" onClick={()=>this.updateCatatan(item.id)}>Simpan Catatan</button>
                           </td>
                        </tr>
                    </tbody>
                  
                )
            }
            return (
                <tr key={item.id_customer} className="text-wrap"  style={{fontSize:'12px'}}>
                    <td className="align-middle">{item.nama_lengkap}</td>                  
                    <td className="align-middle"><img src={KONEKSI+item.gambar} alt="" width="100%"/></td>                         
                    <td className="align-middle">{item.nama_produk}</td>
                    <td className="align-middle">{item.berat} gram</td>
                    <td className="align-middle text-danger">Rp {curency.toLocaleString()}</td>
                    <td className="align-middle text-danger">$ {item.harga.toLocaleString()}</td>
               
                    <td className="align-middle text-danger">Rp. {rupiah.toLocaleString()}</td>
                    <td className="align-middle text-danger">Rp {pajakrupiah.toLocaleString()}</td>
                   
                    <td className="align-middle"><input className="form-control col-lg-9 offset-lg-3" type="number" defaultValue={item.jumlah_beli} ref="jumlahEdit"/></td>
                    <td className="align-middle"> {item.total_berat.toLocaleString()} gram</td>
                    <td className="align-middle"> Rp. {totalRupiah.toLocaleString()}</td>
                    <td className="align-middle">{item.negara}</td>
                    <td className="align-middle"><button type="button" className="btn btn-primary" onClick={() => this.onBtnSaveClick(item)} ><i className="far fa-save"></i></button></td>
                    <td className="align-middle"><button type="button" className="btn btn-default" onClick={() => this.setState({selectedRow: 0})} ><i className="fas fa-undo-alt"></i></button></td>
                </tr>
            )
        })

        return listBuyer;
    }

    ringkasanBelanja = () => {
       
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
                if(this.state.npwp != 0){
                    var pph = dollarPrice*this.state.pph/100;
                }else{
                    var pph2 =this.state.pph*2
                    var pph = dollarPrice*pph2/100;
                }
               
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
                <a href="/agent/cart"><button className="btn btn-default orange col-lg-12">Back</button></a>
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
    taxHead=()=>{
        if(this.state.npwp!=0){
            return <th scope="col">Tax</th>
        }
        return<th scope="col">Tax <small>NoNPWP</small></th>
    }
    cartEmpty=()=>{
        return(
            <div className="alert blue text-white media col-12">
           
            <div className="col-md-12 media-body">
                <h4>Keranjangmu kosong</h4>
            </div>
        </div>
        )
    }
    renderPage=()=>{
        const { username, role } = this.props.user;
        if(this.state.listCart.length>0){
            return(
                <div>
                    <div className="alert blue text-white media col-12">
                                    
                                    <div className="col-md-12 media-body">
                                        <h4>
customer transaction details </h4>
                                    </div>
                                </div> 
                                <div className="container-fluid">
                                <div className="row">
                                    <div className="card mt-2 shadow col-lg-12 pl-0 pr-0">
                                        <div className="card-header">
                                            <h4>Keranjang Belanja customermu</h4>
                                        </div>
                                        <div className="card-body table-order">
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Customer Name</th>
                                                        <th scope="col">Image</th>
                                                        <th scope="col">Product</th>
                                                        <th scope="col">Weight</th>
                                                        <th scope="col">Currency {this.state.level}</th>
                                                        <th scope="col">Dollar</th>
                                                        <th scope="col">Rupiah</th>
                                                       {this.taxHead()}
                                                        <th scope="col">Quantity</th>
                                                        <th scope="col">Total Weight</th>
                                                        <th scope="col">Total Price</th>
                                                        <th scope="col">Origin</th>
                                                        <th colspan="2"></th>
                                                       
                                                    </tr>
                                                </thead>
                                                
                                                {this.putDataBuyer()}
                                               
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6 pl-0 pr-0 mt-4 p-2">
                                    <div className="card mt-2 shadow">
                                            <div className="card-header">
                                                <p>BPOM Form Upload</p>
                                            </div>
                                            <div className="card-body">
                                            <p>Jika produk yang di beli oleh customermu mengandung kategori makanan atau obat obatan, customer diwajibkan mengisi form bpom untuk melanjutkan pemesanan</p>
                                               <table className="table table-hover text-left">
                                               <tbody>
                                                   <tr>
                                                       <td>Download Form</td>
                                                       <td> <a href="../document/FORM_SKI_BPOM.docx" download="FORM_SKI_BPOM.docx"><button className="btn btn-default orange">Download</button></a></td>
                                                   </tr>
                                                   <tr>
                                                       <td>Upload Form BPOM customer</td>
                                                      <td><FormGroup>
                                                        <FormText color="muted">
                                                           Upload from bpom dalam bentuk word,pdf atau zip untuk setiap pembelanjaan custom
                                                        </FormText>
                                                        </FormGroup>
                                                          </td>
                                                   </tr>
                                                </tbody>
                                               </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 pl-0 pr-0 mt-4 p-2">
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
            return this.cartEmpty()
           
        }
    }
    onBtnSaveFile = (id) => {
        console.log(id)
        this.setState({loading:true})
        var formData = new FormData()
        var headers = {
            headers: 
            {'Content-Type': 'multipart/form-data'}
        }
        if(document.getElementById(`bpomfile${id}`)){
            formData.append('bpom', document.getElementById(`bpomfile${id}`).files[0])
        }
        axios.put(`${KONEKSI}/customer/addfilebpom/`+id, formData, headers)
        .then((res) => {
            this.setState({loading:false})
            console.log(res.data)
            alert("Upload file Form BPOM Success")
            console.log(res.data)
        })
        .catch((err) =>{
            this.setState({loading:false})
            console.log(err)
        })
    }
    loading1=()=>{
        if(this.state.loading){
            return<ReactLoading type='cylon' color="black" height={20} width={45} />
        }
    }
    render(){
        const { username, role } = this.props.user;

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

export default connect(mapStateToProps, { loadOfCart })(CartCustomer);