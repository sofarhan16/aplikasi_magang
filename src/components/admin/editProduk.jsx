import React, { Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { CustomInput } from 'reactstrap';
import SidebarAdmin from './SidebarAdmin';
import { KONEKSI } from '../../support/config';
import queryString from 'query-string';
class EditProductAdmin extends Component {
    state = {
        AddImage: 'Unggah Gambar Produk', 
        negara:[],
        kategori:[], 
        listProduk: [], 
        EditImage: 'Pilih Gambar', 
        selectedEditBookId: 0, 
        activePage: 1, 
        tampilPerPage: 5, 
        totalItem: 0, 
        totalPage: 0, 
        startIndex: 0, 
        finishIndex: 0, 
        listPage: [],
        searchListProduk:[]
    }
    
    componentDidMount() {
        this.getListProduct();
        this.getCountry()
        this.getCategory()
    }

    getListProduct = () => {
        var params = queryString.parse(this.props.location.search)
        var product = params.product;
        axios.get(`${KONEKSI}/product/getproductdetail/${product}`)
        .then((res) => {
            console.log(res.data);
            this.setState({listProduk:res.data
            })
            console.log(this.state.listProduk)
        }).catch((err) => {
            console.log(err)
        })
    }
 

   
    onBtnSaveClick = () => {
        var params = queryString.parse(this.props.location.search)
        var product = params.product;
        if(this.refs.addNegara.value == 1 && this.refs.addKategori.value ==1){
            alert('Negara dan kategori tidak boleh kosong')
            window.location.reload()
        }
        var data = {
            id: this.refs.editId.value,
            nama_produk: this.refs.addJudul.value,
            harga: this.refs.addHarga.value,
            berat: this.refs.addBerat.value,
            deskripsi: this.refs.addDeskripsi.value,
            id_negara: this.refs.addNegara.value,
            id_kategori: this.refs.addKategori.value,
            limited:this.refs.addLimited.value,
            best:this.refs.addBest.value,
            offer:this.refs.addOffer.value
        }

      

        axios.post(`${KONEKSI}/product/editproduct/` + product,{
            data
        })
        .then((res) => {
            alert("Edit Produk Success")
            window.location="/admin/inputproduct"
        })
        .catch((err) =>{
            console.log(err)
        })
    }
    getCountry=()=>{
        axios.get(`${KONEKSI}/product/getallcountry`
        ).then((res) => {
            this.setState({negara: res.data});
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
    putCountryOption=()=>{
        const country = this.state.negara.map(item=>{
            return <option value={item.id}>{item.negara}</option>
        })
        return country
    }
    putCategoryOption=()=>{
        const category = this.state.kategori.map(item=>{
            return <option value={item.id}>{item.nama}</option>
        })
        return category
    }
    putForm=()=>{
       var data = this.state.listProduk.map(item=>{
        return(
            <form ref="formLeft" style={{boxShadow:"none"}} className="col-md-12">                                        
                                        
            <div className="form-group row">
                <label className="col-sm-3 col-form-label">id produk</label>
                <div className="col-sm-9">
                    <input type="text" ref="editId" className="form-control form-control-sm" id="inputID" placeholder="Id Produk" defaultValue={item.id} required />
                </div>
            </div>
            <div className="form-group row">
                <label className="col-sm-3 col-form-label">Nama produk</label>
                <div className="col-sm-9">
                    <input type="text" ref="addJudul" className="form-control form-control-sm" id="inputJudul" placeholder="Judul Produk" defaultValue={item.nama_produk} required />
                </div>
            </div>

            <div className="form-group row">
                <label className="col-sm-3 col-form-label">Harga</label>
                <div className="col-sm-9">
                    <input type="number" ref="addHarga" className="form-control form-control-sm" id="inputHarga" placeholder="$ " defaultValue={item.harga} required />
                </div>
            </div>

            <div className="form-group row">
                <label className="col-sm-3 col-form-label">Berat</label>
                <div className="col-sm-9">
                    <input type="number" ref="addBerat" className="form-control form-control-sm" id="inputBerat" placeholder="Weight (gram)" defaultValue={item.berat} required />
                </div>
            </div>

            {/* <div className="form-group row">
                <label className="col-sm-3 col-form-label">Halaman</label>
                <div className="col-sm-9">
                    <input type="number" ref="addJumlahHalaman" className="form-control form-control-sm" id="inputJumlahHalaman" placeholder="Jumlah Halaman" required />
                </div>
            </div> */}
            <div className="form-group row">
                <label className="col-sm-3 col-form-label">Deskripsi</label>
                <div className="col-sm-9">
                    <textarea ref="addDeskripsi" className="form-control big-desc" id="inputDeskripsi" placeholder="Deskripsi" rows="3" defaultValue={item.deskripsi} required />
                </div>
            </div>                                        
            <div className="form-group row">
                <label className="col-sm-3 col-form-label">Limited Edition</label>
                <div className="col-sm-9">
                    <select class="custom-select" ref="addLimited" id="inputGroupSelect01">
                        <option value="Limited Edition" selected>Limited Edition</option>
                        <option value="No" selected>No</option>
                       
                    </select>
                </div>
            </div>
            <div className="form-group row">
                <label className="col-sm-3 col-form-label">Set Best Product</label>
                <div className="col-sm-9">
                    <select class="custom-select" ref="addBest" id="inputGroupSelect01">
                        <option value="Best">Best Product</option>
                        <option value="No" selected>No</option>
                       
                    </select>
                </div>
            </div>
            <div className="form-group row">
                <label className="col-sm-3 col-form-label">Set Best Offer This Week</label>
                <div className="col-sm-9">
                    <select class="custom-select" ref="addOffer" id="inputGroupSelect01">
                        <option value="Best">Best Offer This Week</option>
                        <option value="No" selected>No</option>
                       
                    </select>
                </div>
            </div>
            <div class="form-group row">
                <label className="col-sm-3 col-form-label">Negara</label>
                <div className="col-sm-9">
                    <select class="custom-select" ref="addNegara" id="inputGroupSelect01">
                        <option value="1" selected>Pilih Negara</option>
                        {this.putCountryOption()}
                    </select>
                </div>
            </div>        

            <div class="form-group row">
                <label className="col-sm-3 col-form-label">Kategori</label>
                <div className="col-sm-9">
                    <select class="custom-select" ref="addKategori" id="inputGroupSelect01">
                        <option value="1" selected>Pilih Kategori</option>
                        {this.putCategoryOption()}
                    </select>
                </div>
            </div> 

            
   
            <div className="form-group row">
                <div className="col-sm-9 offset-sm-3">
                    <button type="button" class="btn btn-success btn-sm col-12" onClick={()=>this.onBtnSaveClick()} ><i class="fas fa-plus-circle"></i> Edit product</button>
                </div>
            </div>                                    
        </form>
        )
       })
        return data
    }
    render(){
        const { username, role } = this.props.user;

        if(username !== "" && role === "Admin" ){
            return (
                <div className="container-fluid">
                    <div className="row">
                        <SidebarAdmin />
                        
                        <div className="col-md-10 bg-light pl-3 pt-3">
                                
                                {/* ------------------------------------------------------------------------------------------------ */}
                                
                                <hr />

                                <div className="card border col-12 pt-2 pb-2">
                                    <h5 className="text-secondary text-left mt-1"><i class="fas fa-cogs"></i> Manage Products</h5><hr />
                                    
                                    <hr />
                                   
                                    <div className="row justify-content-sm-left mt-3 ml-1 text-left text-secondary" style={{fontSize:"14px"}} >
                                    {this.putForm()}
                                    </div>
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

export default connect(mapStateToProps)(EditProductAdmin);