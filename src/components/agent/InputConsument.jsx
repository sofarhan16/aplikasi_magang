import React, { Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { CustomInput } from 'reactstrap';
import SidebarAgent from './SidebarAgent';
import { KONEKSI } from '../../support/config';
import Cookies from "universal-cookie";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Select from 'react-select';

const cookies = new Cookies();
class InputConsument extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            AddKTPImage: 'Unggah Foto KTP', 
            listProduk: [], 
            selectedEditCustomer: 0, 
            searchListProduk: [],
            state: [],
            selectedOption: null
        }
    }
    
    componentDidMount() {
        this.getListProduct();
        this.getState();
    }

    getState = () => {

        axios.get(`https://janio-api.herokuapp.com/api/location/states/?countries=Indonesia`)
        .then((res) => {
            this.setState({state: res.data})
        }).catch((err) => {
            console.log(err)
        })

    }

    dataSelect=()=>{
        const userList = this.state.state.map((item)=>{
            
            return { value: item.state_name, label: `${item.state_name}` } 
        
        })
        return userList
    }

    handleChange = selectedOption => {
        this.setState({ selectedOption });
        this.setState({
            namaCostumer: selectedOption.label,
            customer: selectedOption.value

        })
        console.log(`Option selected:`, selectedOption.value);
    };

    getListProduct = () => {
        var username = cookies.get('myPengguna');
        axios.post(`${KONEKSI}/customer/getcustomer`,{
            username
        }
        ).then((res) => {
            this.setState({listProduk: res.data, searchListProduk: res.data});   
            console.log(this.state.listProduk)        
        }).catch((err) => {
            console.log(err);
        })
    }
    onAddFileImageChange = () => {
        if(document.getElementById("AddKTPImage").files[0] !== undefined) {
            this.setState({AddKTPImage: document.getElementById("AddKTPImage").files[0].name})
        }
        else {
            this.setState({AddKTPImage: 'Unggah Foto KTP'})
        }
    }
    onBtnAddClick = () => {

                var { selectedOption } = this.state

                var nama_lengkap= this.refs.addfullname.value
                var alamat= this.refs.addAlamat.value
                var  kecamatan= this.refs.addKecamatan.value
                var   kota = this.refs.addKota.value
                var provinsi = selectedOption.value
                var  kodepos = this.refs.kodepos.value
                var id_ktp = this.refs.addIdKTP.value
                var npwp= this.refs.addNPWP.value
                if(nama_lengkap == '' || alamat == '' ||  kecamatan == '' || kota == '' || provinsi == '' || kodepos == '' || id_ktp == ''){
                    alert('form harus diisi lengkap');
                }else{
                    console.log(npwp.length)
                   if(npwp.length != 15){
                    alert("NPWP harus 15 angka")
                   }else{
                       var data = {
                        id_agent: this.props.user.id_agent,
                        nama_lengkap: this.refs.addfullname.value,
                        alamat: this.refs.addAlamat.value,
                        kecamatan: this.refs.addKecamatan.value,
                        kota: this.refs.addKota.value,
                        provinsi: selectedOption.value,
                        kodepos: this.refs.kodepos.value,
                        id_ktp: this.refs.addIdKTP.value,
                        npwp: this.refs.addNPWP.value,
                        number: this.refs.addNumber.value
                    }
                    console.log(data)
                    axios.post(`${KONEKSI}/customer/addcustomer`,data)
                    .then((res) => {
                        
                        alert("Customer Berhasil Diunggah!")
                        console.log(res.data);
                        this.refs.formLeft.reset();
                        this.refs.formRight.reset(); 
                        this.getListProduct()
                        //this.setState({ brandList: res.data })
                        //this.setState({message:"Bukti Pembayaran Berhasil Diunggah"})
                        //this.getListPayment();
                    })
                    .catch((err) =>{
                        console.log(err)
                    })
                   }
               
                
            
        } 
    }
    onBtnSaveClick = (id_customer) => {
            
            var { selectedOption } = this.state
        
            var data = {
                id_agent: this.props.user.id_agent,
                nama_lengkap: this.refs.editNamaLengkap.value,
                alamat: this.refs.editalamat.value,
                kecamatan: this.refs.editkecamatan.value,
                kota: this.refs.editkota.value,
                provinsi: selectedOption.value,
                kodepos: this.refs.editkodepos.value,
                id_ktp: this.refs.editktp.value,
                npwp: this.refs.editnpwp.value,
                number: this.refs.editnumber.value
            }
       
        
    console.log(data)
    axios.put(`${KONEKSI}/customer/editcustomer/`+ id_customer, data).then((res) => {
        
        alert("Customer Berhasil Diedit!")
        console.log(res.data);
        this.getListProduct()
        this.setState({selectedEditCustomer:0})
        //this.setState({ brandList: res.data })
        //this.setState({message:"Bukti Pembayaran Berhasil Diunggah"})
        //this.getListPayment();
    })
    .catch((err) =>{
        console.log(err)
    })

    }
    onBtnSearchClick = () => {
        var nama  = this.refs.searchNama.value;
        
        var arrSearch = this.state.listProduk.filter((item) => {
            return item.nama_lengkap.toLowerCase().includes(nama.toLowerCase());
        })
        this.setState({searchListProduk: arrSearch})
        console.log(this.state.searchListProduk)
    }
    onBtnDeleteClick = (id_customer) => {
        if(window.confirm('Are you sure to delete?')) {
            axios.delete(`${KONEKSI}/customer/deletecustomer/` + id_customer)
            .then((res) => {
                alert('Delete Success');
                this.setState({ listProduk: res.data, searchListProduk: res.data })
                this.getListProduct()
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }
    renderListJSX = () => {
        //var srcgambar = `${KONEKSI}/images/book`;
        var listJSX = this.state.searchListProduk.map(item => {
            if(item.id_customer !== this.state.selectedEditCustomer){
               
                return (
                    <tr key={item.id_customer} className="text-wrap" style={{fontSize:'12px'}}>                        
                        <td className="align-middle">{item.nama_lengkap}</td>
                        <td className="align-middle text-truncate" style={{maxHeight:"20px", maxWidth:"100px"}}>{item.id_ktp}</td>
                        <td className="align-middle text-truncate" style={{maxHeight:"20px", maxWidth:"100px"}}>{item.npwp}</td>
                        <td className="align-middle text-truncate" style={{maxHeight:"20px", maxWidth:"100px"}}>{item.number}</td>
                        <td className="align-middle text-danger">{item.alamat}</td>
                        <td className="align-middle">{item.kecamatan}</td>
                        <td className="align-middle">{item.kota}</td>
                        <td className="align-middle text-truncate">{item.provinsi}</td>
                        <td className="align-middle">{item.kodepos}</td>
                        {/* <td className="align-middle"><button type="button" className="btn btn-sm btn-warning">cek</button></td> */}
                        <td className="align-middle"><button type="button" className="btn btn-sm btn-warning" onClick={()=>this.setState({selectedEditCustomer: item.id_customer})} ><i className="fas fa-edit"></i></button> {' '}
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => this.onBtnDeleteClick(item.id_customer)} ><i className="fas fa-trash-alt"></i></button></td>
                    </tr>
                )
            }
            return (
                <tr key={item.id_customer} className="text-wrap"  style={{fontSize:'12px'}}>                    
                    <td className="align-middle" style={{maxWidth:"80px"}}><input type="text" ref="editNamaLengkap" placeholder="Nama Lengkap" className="form-control form-control-sm" defaultValue={item.nama_lengkap} /></td>
                    <td className="align-middle" style={{maxWidth:"50px"}}><input type="number" ref="editktp" placeholder="KTP id" className="form-control form-control-sm" defaultValue={item.id_ktp} /></td>
                    <td className="align-middle" style={{maxWidth:"50px"}}><input type="number" ref="editnpwp" placeholder="NPWP id" className="form-control form-control-sm" defaultValue={item.npwp} /></td>
                    <td className="align-middle" style={{maxWidth:"50px"}}><input type="tel" ref="editnumber" placeholder="Nomor HP" className="form-control form-control-sm" defaultValue={item.number} /></td>
                    <td className="align-middle" style={{maxWidth:"50px"}}><input type="text" ref="editalamat" placeholder="Alamat" className="form-control form-control-sm" defaultValue={item.alamat} /></td>
                    <td className="align-middle" style={{maxWidth:"80px"}}><input type="text" ref="editkecamatan" placeholder="Kecamatan" className="form-control form-control-sm" defaultValue={item.kecamatan} /></td>
                    <td className="align-middle" style={{maxWidth:"80px"}}><input type="text" ref="editkota" placeholder="Kota" className="form-control form-control-sm" defaultValue={item.kota} /></td>
                    <td className="align-middle" style={{maxWidth:"80px"}}><input type="text" ref="editprovinsi" placeholder="Provinsi" className="form-control form-control-sm" defaultValue={item.provinsi} /></td>
                    <td className="align-middle" style={{maxWidth:"80px"}}><input type="text" ref="editkodepos" placeholder="Kodepos" className="form-control form-control-sm" defaultValue={item.kodepos} /></td>
                    <td className="align-middle"></td>
                    <td className="align-middle"><button type="button" className="btn btn-sm btn-primary" onClick={() => this.onBtnSaveClick(item.id_customer)} ><i className="far fa-save"></i></button>{' '}
                    <button type="button" className="btn btn-sm btn-default border-primary" onClick={() => this.setState({selectedEditCustomer: 0})} ><i className="fas fa-undo-alt"></i></button></td>
                </tr>
            )
        })

        return listJSX;
    }
    renderPage=()=>{

        var { selectedOption } = this.state

        if(this.state.selectedEditCustomer==0){
            return(
                <div className="card border col-12 pt-2 pb-2">
                            <h5 className="text-secondary text-left mt-1"><i class="fas fa-cogs"></i> Manage Customer</h5><hr />
                            <form style={{boxShadow:"none"}} ref="formSearch">
                                <div className="form-row">
                                    <div className="form-group col-md-2">
                                        <input type="text" ref="searchNama" className="form-control form-control-sm" id="searchNama" placeholder="cari Nama" />                                                
                                    </div>
                                    <div className="form-group col-md-1">
                                        <button type="button" ref="btnSearch" className="btn btn-default orange btn-sm" id="searchIsbn" onClick={() => {this.onBtnSearchClick()}} ><i class="fas fa-search"></i> Search</button>                                                
                                    </div>
                                </div>                                        
                            </form>
                            <hr />
                            <table className="table table-hover text-secondary" style={{fontSize:"12px"}}>
                                <thead className='blue text-white'>
                                    <th>Nama Lengkap</th>
                                    <th>KTP</th>
                                    <th>NPWP</th>
                                    <th>Nomor Telepon</th>
                                    <th>Alamat</th>
                                    <th>Kecamatan</th>
                                    <th>Kota</th>
                                    <th>Provinsi</th>
                                    <th>Kodepos</th>
                                    {/* <th>Detail Pesanan</th> */}
                                    <th>Action</th>
                                </thead>
                                <tbody>
                                {this.renderListJSX()}
                                </tbody>
                            </table>
                        </div>
            )
        }else{
            var filterCustomer = this.state.listProduk.filter((item)=>{
                return item["id_customer"] == this.state.selectedEditCustomer
            })
            var data = filterCustomer.map(item=>{
                return(
                    <div className="card border col-12 pt-2 pb-2">
                                <h5 className="text-secondary text-left mt-1"><i class="fas fa-cogs"></i>Edit Customer {item.nama_lengkap}</h5>
                                <hr />
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label">Nama lengkap sesuai KTP</label>
                                    <div className="col-sm-9">
                                        <input type="text" ref="editNamaLengkap" placeholder="Nama Lengkap" className="form-control form-control-sm" defaultValue={item.nama_lengkap} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label">Nomor KTP</label>
                                    <div className="col-sm-9">
                                    <input type="number" ref="editktp" placeholder="KTP id" className="form-control form-control-sm" defaultValue={item.id_ktp} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label">Nomor NPWP (Optional)</label>
                                    <div className="col-sm-9">
                                    <input type="number" ref="editnpwp" placeholder="NPWP id" className="form-control form-control-sm" defaultValue={item.npwp} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label">Nomor yang bisa dihubungi (+62xxx)</label>
                                    <div className="col-sm-9">
                                    <input type="tel" ref="editnumber" placeholder="Nomor HP" className="form-control form-control-sm" defaultValue={item.number} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label">Alamat Tempat tinggal</label>
                                    <div className="col-sm-9">
                                    <textarea type="text" ref="editalamat" placeholder="Alamat" className="form-control form-control-sm" defaultValue={item.alamat} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label">Kecamatan</label>
                                    <div className="col-sm-9">
                                    <input type="text" ref="editkecamatan" placeholder="Kecamatan" className="form-control form-control-sm" defaultValue={item.kecamatan} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label">Kota</label>
                                    <div className="col-sm-9">
                                        <input type="text" ref="editkota" placeholder="Kota" className="form-control form-control-sm" defaultValue={item.kota} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label">Provinsi</label>
                                    <div className="col-sm-9">
                                        <Select
                                            value={selectedOption}
                                            onChange={this.handleChange}
                                            options={this.dataSelect()}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label">Kodepos</label>
                                    <div className="col-sm-9">
                                    <input type="text" ref="editkodepos" placeholder="Kodepos" className="form-control form-control-sm" defaultValue={item.kodepos} />
                                    </div>
                                </div>
                                <div className="row">
                                <div className="col-6">
                                <button type="button" className="btn btn-sm btn-primary w-100" onClick={() => this.onBtnSaveClick(item.id_customer)} ><i className="far fa-save"></i> Save</button>
                                </div>
                                <div className="col-6">
                                <button type="button" className="btn btn-sm btn-default border-primary w-100" onClick={() => this.setState({selectedEditCustomer: 0})} ><i className="fas fa-undo-alt"></i> Back</button>
                                </div>
                               
                                </div>
                                
                    </div>
                )
            })
            return data
        }
    }
    render(){
        
        var { selectedOption } = this.state

        const { username,  role } = this.props.user;
        if(username !== "" && role !== "Admin" ){
            return (
                <div className="container-fluid">
                    <div className="row">
                        <SidebarAgent customers="aktif"/>
                        
                        <div className="col-md-10 bg-light pl-3 pt-3">
                                <div className="blue alert media col-12">
                                    <div className="col-md-12 media-body">
                                        <h4 className="text-center text-white font-weight-bold">Masukan pelanggan</h4>
                                        {/* <p> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Beatae, cupiditate minima similique quaerat nulla iusto dolorem quam asperiores ratione ex tempore in nemo harum consequatur fuga necessitatibus voluptatem sint dolor. </p> */}
                                    </div>
                                </div>
                                {/* ------------------------------------------------------------------------------------------------ */}
                                <div className="row justify-content-sm-left mt-3 ml-1 text-left text-secondary" style={{fontSize:"14px"}} >
                                    <form ref="formLeft" style={{boxShadow:"none"}} className="col-md-6">                                        
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Nama lengkap sesuai KTP</label>
                                            <div className="col-sm-9">
                                                <input type="text" ref="addfullname" className="form-control form-control-sm" id="fullname" placeholder="Nama Lengkap" required />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Nomor KTP</label>
                                            <div className="col-sm-9">
                                                <input type="text" minLength="16" maxLength="16" ref="addIdKTP" className="form-control form-control-sm" id="nomer_ktp" placeholder="Nomor KTP" required />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Nomor NPWP (Optional)</label>
                                            <div className="col-sm-9">
                                                <input type="text" minLength="15" maxLength="15" ref="addNPWP" className="form-control form-control-sm" id="nomer_NPWP" placeholder="Nomor NPWP" required />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Nomor yang bisa dihubungi (+62xxx)</label>
                                            <div className="col-sm-9">
                                                <input type="tel" ref="addNumber" className="form-control form-control-sm" id="nomer_ktp" placeholder="Nomor Hp/ telepon" required />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Alamat Tempat tinggal</label>
                                            <div className="col-sm-9">
                                                <textarea ref="addAlamat" className="form-control form-control-sm" id="alamattempattinggal" placeholder="Alamat tempat tinggal" rows="3" required />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Kecamatan</label>
                                            <div className="col-sm-9">
                                                <input type="text" ref="addKecamatan" className="form-control form-control-sm" id="kecamatan" placeholder="Kecamatan" required />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Kota</label>
                                            <div className="col-sm-9">
                                                <input type="text" ref="addKota" className="form-control form-control-sm" id="kota" placeholder="Kota" required />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Provinsi</label>
                                            <div className="col-sm-9">
                                            <Select
                                                value={selectedOption}
                                                onChange={this.handleChange}
                                                options={this.dataSelect()}
                                            />
                                            </div>
                                        </div> 
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Kodepos</label>
                                            <div className="col-sm-9">
                                                <input type="text" ref="kodepos" className="form-control form-control-sm" id="kodepos" placeholder="Kodepos" required />
                                            </div>
                                        </div>   
                                        <div className="form-group row">
                                            <div className="col-sm-9 offset-sm-3">
                                                <button type="button" class="btn btn-default orange btn-sm col-12" onClick={this.onBtnAddClick} ><i class="fas fa-plus-circle"></i> Input Customer</button>
                                            </div>
                                        </div>                                         
                                    </form>
                                    
                                    <form ref="formRight" style={{boxShadow:"none"}} className="col-md-6">                                            
                                        {/* <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Foto KTP</label>
                                            <div className="col-sm-9">
                                                <CustomInput type="file" className="form-control form-control-sm" id="AddKTPImage" name="KTPImage" label={this.state.AddKTPImage} onChange={this.onAddFileImageChange} />
                                            </div>
                                        </div> */}
                                                                          
                                    </form>
                                </div>
                                <hr />
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

export default connect(mapStateToProps)(InputConsument);