import React, { Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import  SidebarShopper from './sidebarShopper';
import { KONEKSI } from '../../support/config';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, CustomInput } from 'reactstrap';
var moment = require('moment');
class HomeAgent extends Component {

    constructor(props){
        super(props)

        this.state = {
            request: [],
            modal: false,
            barang: [],
            kategori: [],

            kdProduk: "",
            namaBarang: "",
            
            negara: 0,

        }

    }

    componentDidMount(){

        this.getRequest()
        this.getCategory()

    }

    toggle = () => {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
    }
    
    renderModal = (item) => {
        this.setState({barang: item})
        this.toggle()
    }

    getRequest = () => {
        
        axios.get(`${KONEKSI}/product/getproductrequestShopper/`+this.props.user.id_agent
        ).then((res) => {
            this.setState({request: res.data});
            // this.setState({totalItem2: this.state.request.length});
            // this.setState({totalPage2: Math.ceil(this.state.totalItem2 / this.state.tampilPerPage2)})
        }).catch((err) => {
            console.log(err);
        })

    }

    getCategory=()=>{
        axios.get(`${KONEKSI}/product/getallcategory`
        ).then((res) => {
            console.log(res.data)
            this.setState({kategori: res.data});
            console.log(this.state.kategori)
        }).catch((err) => {
            console.log(err);
        })
    }

    putCategoryOption = () => {
        
        const kat = this.state.kategori.map((item) => {
            return <option value={item.id}>{item.nama}</option>
        })

        return kat;

    }

    displayRequest = () => {

        const listReq = this.state.request.map((item) => {

            return (

                <tr key={item.id_customer} className="text-wrap" style={{fontSize:'12px'}}>                        
                    <td className="align-middle">{item.nama_barang}</td>
                    <td className="align-middle text-truncate" style={{maxHeight:"20px", maxWidth:"100px"}}><a href={`${KONEKSI}/${item.gambar}`} target="_blank"><img src={`${KONEKSI}/${item.gambar}`} width="50"/></a></td>
                    <td className="align-middle text-truncate" style={{maxHeight:"20px", maxWidth:"100px"}}>{item.deskripsi}</td>
                    <td className="align-middle text-truncate" style={{maxHeight:"20px", maxWidth:"100px"}}>{item.kategori}</td>
                    <td className="align-middle text-truncate" >{item.status}</td>
                    <td className="align-middle text-truncate" ><button className="btn btn-default orange" onClick={() => this.renderModal(item)}>Barang Di katalog</button>{` `} 
                    <button className="btn btn-danger" onClick={()=>this.onBtnActionRequest(item.id,"Tolak Request")}>Tolak Request</button>
                    </td>           
                </tr>

            )

        })

        return listReq;        

    }

    AutoAddProduct = () => {

        var { barang } = this.state

        var formData = new FormData()

        var headers = {
            headers: 
            {'Content-Type': 'multipart/form-data'}
        }

        var data = {

            id: this.refs.id_request.value,
            nama_produk: this.refs.nama_produk.value,
            harga: this.refs.harga.value,
            berat: this.refs.berat.value,
            deskripsi: this.refs.deskripsi.value,
            verified: '1',
            id_negara: barang.id_negara,
            id_kategori: this.refs.kategori.value,

        }

        if(document.getElementById('AddImage')){
            formData.append('gambar', document.getElementById('AddImage').files[0])
        }

        console.log(document.getElementById('AddImage').files[0])

        formData.append('data', JSON.stringify(data))

        axios.post(`${KONEKSI}/product/addproduct`, formData, headers)
            .then((res) => {
                
                
                console.log(res.data);
                window.location.reload()
                // this.refs.formLeft.reset();
                // this.refs.formRight.reset(); 
                //this.setState({ brandList: res.data })
                //this.setState({message:"Bukti Pembayaran Berhasil Diunggah"})
                //this.getListPayment();
               
            })
            .catch((err) =>{
                console.log(err)
                alert("Gagal Menambahkan Barang tolong muat ulang page")
            })
           

    }


    onBtnActionRequest=(id,status)=>{
        var request = window.confirm(`Apakah Kamu Yakin `+status);

        var kodee = this.refs.id_request || '-'        

        if(request){
            
            if(kodee == '-'){

                var kode = '-'
                axios.post(`${KONEKSI}/product/editrequestproduct`,{ id, status, kode })
                .then((res) => {
                    alert("Produk Request Berhasil Diupdate!")
                    this.getRequest()
                    this.AutoAddProduct()
                })
                .catch((err) =>{
                    console.log(err)
                })
            }else{

                var kode = kodee.value

                axios.post(`${KONEKSI}/product/editrequestproduct`,{ id, status, kode })
                .then((res) => {
                    alert("Produk Request Berhasil Diupdate!")
                    this.getRequest()
                    this.AutoAddProduct()
                })
                .catch((err) =>{
                    console.log(err)
                })

            }

        }

    }


    onAddFileImageChange = () => {
        if(document.getElementById("AddImage").files[0] !== undefined) {
            this.setState({AddImage: document.getElementById("AddImage").files[0].name})
            console.log(document.getElementById("AddImage").files[0].name)
        }
        else {
            this.setState({AddImage: 'Unggah Gambar Produk'})
        }
    }


    render(){
        const { username, status,level, role } = this.props.user;

        var { barang } = this.state

        var random  = Math.floor(1000 + Math.random() * 900)

        console.log(random)

        if(username !== "" && role !== "Shopper"){
            return <Redirect to="/" />
        }
      
        if(username !== ""  ){
            return (
                <div className="container-fluid">
                    <div className="row">
                        <SidebarShopper dashboard="aktif"/>

                        <div className="col-md-10 bg-light pl-3 pt-3">

                            {/* TOP */}
                            <div className="row justify-content-center mb-4">
                                <div className="col-md-3">
                                    <div className="card">
                                        <div className="card-body">

                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card">
                                        <div className="card-body">

                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /TOP */}


                             <div className="card">
                                 <div className="card-body">
                                     <div className="row">
                                         <div className="col-md-12">
                            
                                            <div className="alert blue media col-12">
                                                <div className="col-md-12 font-templates font-weight-bold media-body">
                                                    <h4>Request Barang</h4>
                                                </div>
                                            </div>
                                             <table className="table table-bordered">
                                                 <tr>
                                                    <th>Nama Barang</th>
                                                    <th>Gambar Barang</th>
                                                    <th>Deskripsi Barang</th>
                                                    <th>Kategori Barang</th>
                                                    <th>status</th>
                                                    <th>Action</th>
                                                 </tr>
                                                 {this.displayRequest()}
                                             </table>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                             
                        </div>
                    </div>

                    <div>
                        <Modal isOpen={this.state.modal} toggle={this.toggle} className="">
                        <ModalHeader toggle={this.toggle}>Confirm Request</ModalHeader>
                        <ModalBody className="text-center">
                            
                            <form action="">
                                <div className="mb-3">
                                    <input type="text" name="" ref="id_request" className="form-control" placeholder="Kode Produk" readOnly
                                        value={

                                            barang.id_negara == 1 ? `JPPS${random}` : 
                                            barang.id_negara == 2 ? `HKPS${random}` :
                                            barang.id_negara == 3 ? `AUPS${random}` :
                                            barang.id_negara == 4 ? `MLPS${random}` :
                                            barang.id_negara == 5 ? `SGPS${random}` :
                                            barang.id_negara == 6 ? `KOPS${random}` :
                                            barang.id_negara == 7 ? `THPS${random}` : ""

                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <input type="text" name="" ref="nama_produk" className="form-control" placeholder="Nama Produk" defaultValue={barang.nama_barang}/>
                                </div>
                                <div className="mb-3">
                                    <input type="number" name="" ref="harga" className="form-control" placeholder="$ (Dollar)"/>
                                </div>
                                <div className="mb-3">
                                    <input type="number" name="" ref="berat" className="form-control" placeholder="Weight (gram)"/>
                                </div>
                                <div className="mb-3">
                                    <textarea name="" id="" ref="deskripsi" className="form-control" rows="5" placeholder="Produk Description"></textarea>
                                </div>
                                <div className="mb-3">
                                    <select name="" id="" ref="kategori" className="form-control">
                                        <option value="" selected>Pilih Kategori</option>
                                        {this.putCategoryOption()}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <CustomInput type="file" className="form-control form-control-sm" id="AddImage" label={this.state.AddImage} onChange={this.onAddFileImageChange} />
                                </div>
                            </form>

                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onClick={() => this.onBtnActionRequest(barang.id, "Barang Di katalog")}>Confirm</Button>
                            <Button color="danger" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                        </Modal>
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

export default connect(mapStateToProps)(HomeAgent);