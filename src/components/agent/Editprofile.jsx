import React, { Component} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { KONEKSI } from '../../support/config';
import { CustomInput } from 'reactstrap';
import queryString from 'query-string';
import axios from 'axios';
import SidebarAgent from './SidebarAgent'
import SidebarAdmin from '../admin/SidebarAdmin';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class EditProfile extends Component {
    state = {
        listUser: []  
    }

    componentDidMount() {
        this.getListUser();
    }

    getListUser = () => {
        axios.get(`${KONEKSI}/auth/getUser/`+ this.props.user.id_agent)
        .then((res) => {
            this.setState({listUser: res.data})
        }).catch((err) => {
            console.log(err)
        })
    }

    onEditFileImageChange = () => {
        if(document.getElementById("EditImage").files[0] !== undefined) {
            this.setState({EditImage: document.getElementById("EditImage").files[0].name})
        }
        else {
            this.setState({EditImage: 'Unggah Gambar Produk'})
        }
    }

onBtnSaveClick = (id) => {

    var ugambar = document.getElementById('EditImage')

    var formData = new FormData()

    var data = {
        username: this.refs.editNama.value,
        email: this.refs.editEmail.value,
        phone: this.refs.editPhone.value
    }

    var kotak = {
        fullname: this.refs.editFullname.value,
        companyName: this.refs.editCompany.value
    }

    cookies.set('myPengguna', data.username, {path: '/'})

    var headers = {
        headers: {'Content-Type': 'multipart/form-data'}
    }
    
    if(document.getElementById('EditImage')){
        formData.append('gambar', document.getElementById('EditImage').files[0])
    }
    
    formData.append('data', JSON.stringify(data))
    formData.append('kotak', JSON.stringify(kotak))

    axios.post(`${KONEKSI}/auth/editprofile/`+ id, formData, headers)
    .then((res) => {
        window.location.reload()
    })
    .catch((err) =>{
        console.log(err)
    })
}

putForm=()=>{
var data = this.state.listUser.map(item=>{
return(
<form ref="formLeft" style={{boxShadow:"none"}} className="col-md-12">
    <div className="form-group row">
        <label className="col-sm-3 col-form-label">Username</label>
        <div className="col-sm-9">
            <input type="text" ref="editNama" className="form-control form-control-sm" id="inputUsername"
                placeholder="Judul Produk" defaultValue={item.username} required />
        </div>
    </div>
    <div className="form-group row">
        <label className="col-sm-3 col-form-label">Phone Number</label>
        <div className="col-sm-9">
            <input type="text" ref="editPhone" className="form-control form-control-sm" id="inputUsername"
                placeholder="Judul Produk" defaultValue={item.phone} required />
        </div>
    </div>
    <div className="form-group row">
        <label className="col-sm-3 col-form-label">Email</label>
        <div className="col-sm-9">
            <input type="text" ref="editEmail" className="form-control form-control-sm" id="inputUsername"
                placeholder="Judul Produk" defaultValue={item.email} required />
        </div>
    </div>

    <div className="form-group row">
        <label className="col-sm-3 col-form-label">Full Name</label>
        <div className="col-sm-9">
            <input type="text" ref="editFullname" className="form-control form-control-sm" id="inputUsername"
                placeholder="Judul Produk" defaultValue={item.fullname} required />
        </div>
    </div>
    <div className="form-group row">
        <label className="col-sm-3 col-form-label">Company Name</label>
        <div className="col-sm-9">
            <input type="text" ref="editCompany" className="form-control form-control-sm" id="inputUsername"
                placeholder="Judul Produk" defaultValue={item.companyName} required />
        </div>
    </div>

    <div className="form-group row">
        <label className="col-sm-3 col-form-label">Tambahkan Gambar</label>
        <div className="col-sm-9">
        <CustomInput type="file" id="EditImage" xname="EditImage" label={this.state.EditImage} onChange={this.onEditFileImageChange} />
        </div>
    </div>


    <div className="form-group row">
        <div className="col-sm-9 offset-sm-3">
            <button type="button" class="btn btn-success btn-sm col-12" onClick={()=>this.onBtnSaveClick(this.props.user.id_agent)} ><i
                    class="fas fa-plus-circle"></i> Edit product</button>
        </div>
    </div>
</form>
)
})
return data
}

render(){
    
    const { username, role } = this.props.user;
    

    console.log(this.state.listUser)
    if(username !== "" && role !== "Admin" ){
        return (
            <div className="container-fluid">
                <div className="row">
                <SidebarAgent />
                    
                    <div className="col-md-10 bg-light pl-3 pt-3">
                            
                            {/* ------------------------------------------------------------------------------------------------ */}
                            <div className="card border col-12 pt-2 pb-2">
                                <h5 className="text-secondary text-left mt-1"><i class="fas fa-cogs"></i> Edit Profile Member</h5><hr />
                                
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

export default connect(mapStateToProps)(EditProfile);