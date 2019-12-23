import React, { Component} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import SidebarAdmin from './SidebarAdmin';
import { KONEKSI } from '../../support/config';
import axios from 'axios';
class CategoryAdmin extends Component {
    state = {kategori:[],selectedEdit:0}
    componentDidMount(){
        this.getListCategory();
    }
    getListCategory = () => {
        axios.get(`${KONEKSI}/product/getallcategory`
        ).then((res) => {
            this.setState({kategori: res.data});   
            console.log(this.state.kategori)        
        }).catch((err) => {
            console.log(err);
        })
    }
    onBtnAddClick=()=>{
        var nama= this.refs.addNama.value
        var kode= this.refs.addKode.value
        axios.post(`${KONEKSI}/product/addcategory`,{
            nama, kode
        }).then((res) => {
            alert("Kategori Berhasil Ditambah!")
            this.getListCategory()
        })
        .catch((err) =>{
            console.log(err)
        })
    }
    onBtnSaveClick = (id) => {
        var nama= this.refs.editNama.value
        var kode = this.refs.editKode.value
        axios.put(`${KONEKSI}/product/editcategory/`+ id,{
            nama, kode
        }).then((res) => {
            alert("Kategori Berhasil Diedit!")
            this.getListCategory()
            this.setState({selectedEdit:0})
        })
        .catch((err) =>{
            console.log(err)
        })
    }
    onBtnDeleteClick = (id) => {
        if(window.confirm('Are you sure to delete?')) {
            axios.delete(`${KONEKSI}/product/deletecategory/` + id)
            .then((res) => {
                alert('Delete Success');
                this.setState({ kategori: res.data, selectedEdit:0 })
                this.getListCategory()
            })
            .catch((err) => {
                alert('Error')
                console.log(err);
            })
        }
    }
    renderListJSX = () => {
        //var srcgambar = `${KONEKSI}/images/book`;
        var listJSX = this.state.kategori.map(item => {
            if(item.id !== this.state.selectedEdit){
                return (
                    <tr key={item.id} className="text-wrap" style={{fontSize:'12px'}}>                        
                        <td className="align-middle">{item.id}</td>
                        <td className="align-middle">{item.nama}</td>
                        <td className="align-middle">{item.kode}</td>
                        <td className="align-middle"><button type="button" className="btn btn-sm btn-warning" onClick={() => this.setState({selectedEdit: item.id})} ><i className="fas fa-edit"></i></button> {' '}
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => this.onBtnDeleteClick(item.id)} ><i className="fas fa-trash-alt"></i></button></td>
                    </tr>
                )
            }
            return (
                <tr key={item.isbn} className="text-wrap"  style={{fontSize:'12px'}}>                    
                    <td className="align-middle">{item.id}</td>
                    <td className="align-middle"><input type="text" ref="editNama" placeholder="Category Name" className="form-control form-control-sm" defaultValue={item.nama} /></td>
                    <td className="align-middle"><input type="text" ref="editKode" placeholder="Category Kode" className="form-control form-control-sm" defaultValue={item.kode} /></td>
                    <td className="align-middle"><button type="button" className="btn btn-sm btn-primary" onClick={() => this.onBtnSaveClick(item.id)} ><i className="far fa-save"></i></button>{' '}
                    <button type="button" className="btn btn-sm btn-default border-primary" onClick={() => this.setState({selectedEdit: 0})} ><i className="fas fa-undo-alt"></i></button></td>
                </tr>
            )
        })

        return listJSX;
    }

    makeSeed = () => {
        
        // for(let i = 0; i<15; i++){

        // }

        var datas = [
            {kode: "BJ", nama:"Baju"},
            {kode: "BJW", nama:"Baju Wanita"},
            {kode: "SPT", nama:"Sepatu"},
            {kode: "TP", nama:"Topi"},
            {kode: "KMJ", nama:"Kemeja"}
        ]

        axios.post(`${KONEKSI}/product/addcategory`, {datas})
        .then((res) => {
            alert("DUMMY INSERTED")
        }).catch((err) => {
            console.log(err)
        })

    }


    render(){
        const { username, role } = this.props.user;

        if(username !== "" && role === "Admin" ){
            return (
                <div className="container-fluid">
                    <div className="row">
                        <SidebarAdmin category="aktif"/>

                        <div className="col-md-10 bg-light pl-3 pt-3">
                                <div className="alert blue media col-12">
                                    {/* <img className="img img-fluid" src="http://localhost:3000/images/flat/039-stadistics.png" width="100px" /> */}
                                    <div className="col-md-12 font-templates media-body">
                                        <h4>Kategori</h4>
                                        {/* <p> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Beatae, cupiditate minima similique quaerat nulla iusto dolorem quam asperiores ratione ex tempore in nemo harum consequatur fuga necessitatibus voluptatem sint dolor. </p> */}
                                    </div>
                                </div> 
                                <button onClick={this.makeSeed}>Seeder</button>
                                <div className="row justify-content-sm-left mt-3 ml-1 text-left text-secondary" style={{fontSize:"14px"}} >
                                    <form ref="formLeft" style={{boxShadow:"none"}} className="col-md-6">                                        
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Nama kategori</label>
                                            <div className="col-sm-9">
                                                <input type="text" ref="addNama" className="form-control form-control-sm" id="inputIsbn" placeholder="Nama Kategori" required autoFocus/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Kode kategori</label>
                                            <div className="col-sm-9">
                                                <input type="text" ref="addKode" className="form-control form-control-sm" id="inputIsbn" placeholder="Kode Kategori" required autoFocus/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="col-sm-9 offset-sm-3">
                                                <button type="button" class="btn btn-default orange btn-sm col-12" onClick={this.onBtnAddClick} ><i class="fas fa-plus-circle"></i> Input Kategori</button>
                                            </div>
                                        </div>                                      
                                    </form>
                                    <div className="card border col-12 pt-2 pb-2">
                                    <h5 className="text-secondary text-left mt-1"><i class="fas fa-cogs"></i> Manage Category</h5>
                                    <hr />
                                    <table className="table table-hover text-secondary" style={{fontSize:"12px"}}>
                                        <thead className="blue text-white">
                                            <th>ID KATEGORI</th>
                                            <th>Nama Kategori</th>
                                            <th>Kode Kategori</th>
                                            <th>action</th>
                                        </thead>
                                        <tbody>
                                           {this.renderListJSX()}
                                        </tbody>
                                    </table>
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

export default connect(mapStateToProps)(CategoryAdmin);