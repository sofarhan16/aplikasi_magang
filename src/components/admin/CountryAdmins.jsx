import React, { Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { CustomInput } from 'reactstrap';
import SidebarAdmin from './SidebarAdmin';
import { KONEKSI } from '../../support/config';

class CountryAdmin extends Component {
    state = {AddImage: 'Unggah Gambar Negara', negara:[],kategori:[], listProduk: [], EditImage: 'Pilih Gambar', selectedEditCountry: 0, searchListProduk: [] }
    
    componentDidMount() {
        this.getCountry()
    }
    onBtnAddClick = () => {
        if(document.getElementById("AddImage").files[0] !== undefined) {
            var formData = new FormData()
            var headers = {
                headers: 
                {'Content-Type': 'multipart/form-data'}
            }

            var data = {
                id:this.refs.addIDNegara.value,
                negara: this.refs.addNamaNegara.value,
                kode: this.refs.addKodeNegara.value
            }

            console.log(data)

            if(document.getElementById('AddImage')){
                formData.append('gambar', document.getElementById('AddImage').files[0])
            }
            formData.append('data', JSON.stringify(data))
            console.log(data)
            axios.post(`${KONEKSI}/product/addnegara`, formData, headers)
            .then((res) => {
                
                alert("Negara Berhasil Ditambah!")
                console.log(res.data);
                this.refs.formLeft.reset();
                this.getCountry()
                //this.setState({ brandList: res.data })
                //this.setState({message:"Bukti Pembayaran Berhasil Diunggah"})
                //this.getListPayment();
            })
            .catch((err) =>{
                console.log(err)
            })
        }
        else {
            alert('Image harus diisi!')
        }
    }

    onBtnSaveClick = (id) => {
        
        var formData = new FormData()
        var headers = {
            headers: 
            {'Content-Type': 'multipart/form-data'}
        }

        var data = {
            id:this.refs.editIDNegara.value,
            negara: this.refs.editNamaNegara.value,
            kode: this.refs.editKodeNegara.value
        }

        if(document.getElementById('EditImage')){
            formData.append('gambar', document.getElementById('EditImage').files[0])
        }
        formData.append('data', JSON.stringify(data))

        axios.put(`${KONEKSI}/product/editcountry/` + id, formData, headers)
        .then((res) => {
            alert("Edit Negara berhasil")
            this.setState({ negara: res.data, selectedEditCountry: 0 })
        })
        .catch((err) =>{
            console.log(err)
        })
    }

    onBtnDeleteClick = (id) => {
        if(window.confirm('Are you sure to delete?')) {
            axios.delete(`${KONEKSI}/product/deletecountry/` + id)
            .then((res) => {
                alert('Delete Success');
                this.setState({ negara: res.data, searchListProduk: res.data })
                this.getCountry()
            })
            .catch((err) => {
                alert('Error')
                console.log(err);
            })
        }
    }

    renderListJSX = () => {
        //var srcgambar = `${KONEKSI}/images/book`;
        var listJSX = this.state.negara.map(item => {
            if(item.id !== this.state.selectedEditCountry){
                return (
                    <tr key={item.id} className="text-wrap" style={{fontSize:'12px'}}>
                        <td className="align-middle">{item.id}</td>
                        <td className="align-middle">{item.negara}</td> 
                        <td className="align-middle">{item.kode}</td> 
                        <td>{<img src={KONEKSI+item.gambar} width="60px" alt={item.negara} /> }</td>
                        <td className="align-middle"><button type="button" className="btn btn-sm btn-warning" onClick={() => this.setState({selectedEditCountry: item.id})} ><i className="fas fa-edit"></i></button> {' '}
                       </td>
                       {/* <button type="button" className="btn btn-sm btn-danger" onClick={() => this.onBtnDeleteClick(item.id)} ><i className="fas fa-trash-alt"></i></button> */}
                    </tr>
                )
            }
            return (
                <tr key={item.isbn} className="text-wrap"  style={{fontSize:'12px'}}>
                    <td className="align-middle"><input type="text" ref="editIDNegara" placeholder="ID Negara" className="form-control form-control-sm" defaultValue={item.id} /></td> 
                    <td className="align-middle"><input type="text" ref="editNamaNegara" placeholder="Nama Negara" className="form-control form-control-sm" defaultValue={item.negara} /></td>
                    <td className="align-middle"><input type="text" ref="editKodeNegara" placeholder="Kode Negara" className="form-control form-control-sm" defaultValue={item.kode} /></td>                
                    <td className="align-middle" ><CustomInput type="file" id="EditImage" name="EditImage" label={this.state.EditImage} onChange={this.onEditFileImageChange} /></td>
                    <td className="align-middle"><button type="button" className="btn btn-sm btn-primary" onClick={() => this.onBtnSaveClick(item.id)} ><i className="far fa-save"></i></button>{' '}
                    <button type="button" className="btn btn-sm btn-default border-primary" onClick={() => this.setState({selectedEditCountry: 0})} ><i className="fas fa-undo-alt"></i></button></td>
                </tr>
            )
        })

        return listJSX;
    }
    getCountry=()=>{
        axios.get(`${KONEKSI}/product/getallcountry`
        ).then((res) => {
            this.setState({negara: res.data});
            this.setState({selectedEditCountry:0})
        }).catch((err) => {
            console.log(err);
        })
    }
    onAddFileImageChange = () => {
        if(document.getElementById("AddImage").files[0] !== undefined) {
            this.setState({AddImage: document.getElementById("AddImage").files[0].name})
        }
        else {
            this.setState({AddImage: 'Unggah Gambar Produk'})
        }
    }
    onEditFileImageChange = () => {
        if(document.getElementById("EditImage").files[0] !== undefined) {
            this.setState({EditImage: document.getElementById("EditImage").files[0].name})
        }
        else {
            this.setState({EditImage: 'Unggah Gambar Produk'})
        }
    }
    render(){
        const { username, role } = this.props.user;

        if(username !== "" && role === "Admin" ){
            return (
                <div className="container-fluid">
                    <div className="row">
                        <SidebarAdmin country="aktif"/>
                        
                        <div className="col-md-10 bg-light pl-3 pt-3">
                                <div className="alert blue media col-12">
                                    {/* <img className="img img-fluid" src="http://localhost:3000/images/flat/046-accounting-1.png" width="90px" /> */}
                                    <div className="col-md-12 font-templates media-body">
                                        <h4>Input Product</h4>
                                        {/* <p> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Beatae, cupiditate minima similique quaerat nulla iusto dolorem quam asperiores ratione ex tempore in nemo harum consequatur fuga necessitatibus voluptatem sint dolor. </p> */}
                                    </div>
                                </div>
                                {/* ------------------------------------------------------------------------------------------------ */}
                                <div className="row justify-content-sm-left mt-3 ml-1 text-left text-secondary" style={{fontSize:"14px"}} >
                                    <form ref="formLeft" style={{boxShadow:"none"}} className="col-md-6"> 
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">ID Negara</label>
                                            <div className="col-sm-9">
                                                <input type="text" ref="addIDNegara" className="form-control form-control-sm" id="inputJudul" placeholder="ID Negara" required />
                                            </div>
                                        </div>                                       
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Nama Negara</label>
                                            <div className="col-sm-9">
                                                <input type="text" ref="addNamaNegara" className="form-control form-control-sm" id="inputJudul" placeholder="Nama negara" required />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Kode Negara</label>
                                            <div className="col-sm-9">
                                                <input type="text" ref="addKodeNegara" className="form-control form-control-sm" id="inputJudul" placeholder="Kode negara" required />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Foto produk</label>
                                            <div className="col-sm-9">
                                                <CustomInput type="file" className="form-control form-control-sm" id="AddImage" name="AddImage" label={this.state.AddImage} onChange={this.onAddFileImageChange} />
                                            </div>
                                        </div> 
                                        <div className="form-group row">
                                            <div className="col-sm-9 offset-sm-3">
                                                <button type="button" class="btn btn-success btn-sm col-12" onClick={this.onBtnAddClick} ><i class="fas fa-plus-circle"></i> Input Country</button>
                                            </div>
                                        </div>                                      
                                    </form>
                                </div>
                                {/* ------------------------------------------------------------------------------------------------ */}
                                
                                <hr />

                                <div className="card border col-12 pt-2 pb-2">
                                    <h5 className="text-secondary text-left mt-1"><i class="fas fa-cogs"></i> Manage Country</h5><hr />
                                    <table className="table table-hover text-secondary" style={{fontSize:"12px"}}>
                                        <thead className="blue text-white">
                                            <th>ID Negara</th>
                                            <th>Nama Negara</th>
                                            <th>Kode Negara</th>
                                            <th >Gambar</th>
                                            <th>Action</th>
                                        </thead>
                                        <tbody>
                                            {this.renderListJSX()}
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

export default connect(mapStateToProps)(CountryAdmin);