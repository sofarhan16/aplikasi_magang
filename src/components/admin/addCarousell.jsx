import React, { Component} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { KONEKSI } from '../../support/config';
import SidebarAdmin from './SidebarAdmin';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import queryString from 'query-string';
import { CustomInput } from 'reactstrap';
import ReactLoading from 'react-loading';
class addCarousell extends Component {
    state={
        dataImage:[],
        AddImage1:'Unggah Gambar Carousell',
        AddImage2:'Gambar Carousell belum diunggah',
        AddImage3:'Gambar Carousell belum diunggah',
        AddImage4:'Gambar Carousell belum diunggah ',
        AddImage5:'Gambar Carousell belum diunggah ',
        AddImage6:'Gambar Carousell belum diunggah ',
        loading1:'',
        loading2:'',
        loading3:'',
        loading4:'',
        loading5:'',
        loading6:'',
    }
    componentDidMount(){
        axios.get(`${KONEKSI}/product/getcarousell`)
        .then((res) => {
            console.log(res.data);
            this.setState({     
                AddImage1:res.data[0].gambar,
                AddImage2:res.data[1].gambar,
                AddImage3:res.data[2].gambar,
                AddImage4:res.data[3].gambar,
                AddImage5:res.data[4].gambar,
                AddImage6:res.data[5].gambar
               
            })
        }).catch((err) => {
            console.log(err)
        })
      }
    
    onAddFileImageChange1 = () => {
        if(document.getElementById("AddImage1").files[0] !== undefined) {
            this.setState({AddImage1: document.getElementById("AddImage1").files[0].name})
        }
        else {
            this.setState({AddImage1: 'Unggah Gambar Produk'})
        }
    }
    onBtnSavePhotos1 = (id) => {
        var formData = new FormData()
        var headers = {
            headers: 
            {'Content-Type': 'multipart/form-data'}
        }

        if(document.getElementById('AddImage1')){
            formData.append('gambar', document.getElementById('AddImage1').files[0])
        }
        this.setState({loading1:true})
        axios.put(`${KONEKSI}/product/AddImagecarousell1/` + id, formData, headers)
        .then((res) => {
            this.setState({loading1:false})
            alert("Add Image 1 Success")
            window.location.reload();
        })
        .catch((err) =>{
            console.log(err)
        })
    }
    onAddFileImageChange2 = () => {
        if(document.getElementById("AddImage2").files[0] !== undefined) {
            this.setState({AddImage2: document.getElementById("AddImage2").files[0].name})
        }
        else {
            this.setState({AddImage2: 'Unggah Gambar Produk'})
        }
    }
    onBtnSavePhotos2 = (id) => {
        var formData = new FormData()
        var headers = {
            headers: 
            {'Content-Type': 'multipart/form-data'}
        }

        if(document.getElementById('AddImage2')){
            formData.append('gambar', document.getElementById('AddImage2').files[0])
        }
        this.setState({loading2:true})
        axios.put(`${KONEKSI}/product/AddImagecarousell2/` + id, formData, headers)
        .then((res) => {
            this.setState({loading2:false})
            alert("Add Image 2 Success")
            window.location.reload();
        })
        .catch((err) =>{
            console.log(err)
        })
    }
    onAddFileImageChange3 = () => {
        if(document.getElementById("AddImage3").files[0] !== undefined) {
            this.setState({AddImage3: document.getElementById("AddImage3").files[0].name})
        }
        else {
            this.setState({AddImage3: 'Unggah Gambar Produk'})
        }
    }

    onAddFileImageChange4 = () => {
        if(document.getElementById("AddImage4").files[0] !== undefined) {
            this.setState({AddImage4: document.getElementById("AddImage4").files[0].name})
        }
        else {
            this.setState({AddImage4: 'Unggah Gambar Produk'})
        }
    }

    onAddFileImageChange5 = () => {
        if(document.getElementById("AddImage5").files[0] !== undefined) {
            this.setState({AddImage5: document.getElementById("AddImage5").files[0].name})
        }
        else {
            this.setState({AddImage5: 'Unggah Gambar Produk'})
        }
    }

    onAddFileImageChange6 = () => {
        if(document.getElementById("AddImage6").files[0] !== undefined) {
            this.setState({AddImage6: document.getElementById("AddImage6").files[0].name})
        }
        else {
            this.setState({AddImage6: 'Unggah Gambar Produk'})
        }
    }
    onBtnSavePhotos3 = (id) => {
        var formData = new FormData()
        var headers = {
            headers: 
            {'Content-Type': 'multipart/form-data'}
        }

        if(document.getElementById('AddImage3')){
            formData.append('gambar', document.getElementById('AddImage3').files[0])
        }
        this.setState({loading3:true})
        axios.put(`${KONEKSI}/product/AddImagecarousell3/` + id, formData, headers)
        .then((res) => {
            this.setState({loading3:false})
            alert("Add Image 3 Success")
            window.location.reload();
        })
        .catch((err) =>{
            console.log(err)
        })
    }

    onBtnSavePhotos4 = (id) => {
        var formData = new FormData()
        var headers = {
            headers: 
            {'Content-Type': 'multipart/form-data'}
        }

        if(document.getElementById('AddImage4')){
            formData.append('gambar', document.getElementById('AddImage4').files[0])
        }
        this.setState({loading4:true})
        axios.put(`${KONEKSI}/product/AddImagecarousell3/` + id, formData, headers)
        .then((res) => {
            this.setState({loading4:false})
            alert("Add Image 4 Success")
            window.location.reload();
        })
        .catch((err) =>{
            console.log(err)
        })
    }

    onBtnSavePhotos5 = (id) => {
        var formData = new FormData()
        var headers = {
            headers: 
            {'Content-Type': 'multipart/form-data'}
        }

        if(document.getElementById('AddImage5')){
            formData.append('gambar', document.getElementById('AddImage5').files[0])
        }
        this.setState({loading5:true})
        axios.put(`${KONEKSI}/product/AddImagecarousell3/` + id, formData, headers)
        .then((res) => {
            this.setState({loading5:false})
            alert("Add Image 5 Success")
            window.location.reload();
        })
        .catch((err) =>{
            console.log(err)
        })
    }

    onBtnSavePhotos6 = (id) => {
        var formData = new FormData()
        var headers = {
            headers: 
            {'Content-Type': 'multipart/form-data'}
        }

        if(document.getElementById('AddImage6')){
            formData.append('gambar', document.getElementById('AddImage6').files[0])
        }
        this.setState({loading6:true})
        axios.put(`${KONEKSI}/product/AddImagecarousell3/` + id, formData, headers)
        .then((res) => {
            this.setState({loading6:false})
            alert("Add Image 6 Success")
            window.location.reload();
        })
        .catch((err) =>{
            console.log(err)
        })
    }
  
    loading1=()=>{
        if(this.state.loading1){
            return<ReactLoading type='cylon' color="black" height={20} width={45} />
        }
    }
    loading2=()=>{
        if(this.state.loading2){
            return<ReactLoading type='cylon' color="black" height={20} width={45} />
        }
    }
    loading3=()=>{
        if(this.state.loading3){
            return<ReactLoading type='cylon' color="black" height={20} width={45} />
        }
    }
    loading4=()=>{
        if(this.state.loading4){
            return<ReactLoading type='cylon' color="black" height={20} width={45} />
        }
    }
    loading5=()=>{
        if(this.state.loading5){
            return<ReactLoading type='cylon' color="black" height={20} width={45} />
        }
    }
    loading6=()=>{
        if(this.state.loading6){
            return<ReactLoading type='cylon' color="black" height={20} width={45} />
        }
    }
    
    render(){
        const { username, role } = this.props.user;

        if(username !== "" && role === "Admin" ){
            return (
                <div className="container-fluid">
                    <div className="row">
                        <SidebarAdmin carousell="aktif"/>

                        <div className="col-md-10 bg-light pl-3 pt-3">
                                <div className="alert blue media col-12">
                                    {/* <img className="img img-fluid" src="http://localhost:3000/images/flat/039-stadistics.png" width="100px" /> */}
                                    <div className="col-md-12 media-body">
                                        <h4>Hallo Admin</h4>
                                        <p>Buat iklan disini</p>
                                    </div>
                                    
                                </div> 
                              <div className='row'>
                               <div className='col-md-8'>
                                    <div className='p-5 border col-md-12 text-left mb-3'>
                                        <h5 className='bold'>Gambar 1</h5>
                                        <CustomInput type="file"  className="form-control form-control-sm" id="AddImage1" name="AddImage1" label={this.state.AddImage1} onChange={this.onAddFileImageChange1} />    
                                        <br/>
                                        {this.loading1()}
                                        <br/>
                                        <p>1722 x 566 px</p>
                                        <button className='btn btn-success mt-3' onClick={() => this.onBtnSavePhotos1(1)}>Upload</button>
                                    </div>
                                    <div className='p-5 border col-md-12 text-left mb-3'>
                                        <h5 className='bold'>Gambar 2</h5>
                                        <CustomInput type="file"  className="form-control form-control-sm"  id="AddImage2" name="AddImage2" label={this.state.AddImage2} onChange={this.onAddFileImageChange2} />    
                                        <br/>
                                        {this.loading2()}
                                        <br/>
                                        <p>1722 x 566 px</p>
                                        <button className='btn btn-success mt-3' onClick={() => this.onBtnSavePhotos2(2)}>Upload</button>
                                    </div>
                                    <div className='p-5 border col-md-12 text-left mb-3'>
                                        <h5 className='bold'>Gambar 3</h5>
                                        <CustomInput type="file"  className="form-control form-control-sm"  id="AddImage3" name="AddImage3" label={this.state.AddImage3} onChange={this.onAddFileImageChange3} /> 
                                        <br/>
                                        {this.loading3()}
                                        <br/>
                                        <p>1722 x 566 px</p>
                                        <button className='btn btn-success mt-3' onClick={() => this.onBtnSavePhotos3(3)}>Upload</button>
                                    </div>
                                    <div className='p-5 border col-md-12 text-left mb-3'>
                                        <h5 className='bold'>Gambar 4</h5>
                                        <CustomInput type="file"  className="form-control form-control-sm"  id="AddImage4" name="AddImage4" label={this.state.AddImage4} onChange={this.onAddFileImageChange4} /> 
                                        <br/>
                                        {this.loading4()}
                                        <br/>
                                        <p>1722 x 566 px</p>
                                        <button className='btn btn-success mt-3' onClick={() => this.onBtnSavePhotos4(4)}>Upload</button>
                                    </div>
                                    <div className='p-5 border col-md-12 text-left mb-3'>
                                        <h5 className='bold'>Gambar 5</h5>
                                        <CustomInput type="file"  className="form-control form-control-sm"  id="AddImage5" name="AddImage5" label={this.state.AddImage5} onChange={this.onAddFileImageChange5} /> 
                                        <br/>
                                        {this.loading5()}
                                        <br/>
                                        <p>1722 x 566 px</p>
                                        <button className='btn btn-success mt-3' onClick={() => this.onBtnSavePhotos5(5)}>Upload</button>
                                    </div>
                                    <div className='p-5 border col-md-12 text-left mb-3'>
                                        <h5 className='bold'>Gambar 6</h5>
                                        <CustomInput type="file"  className="form-control form-control-sm"  id="AddImage6" name="AddImage6" label={this.state.AddImage6} onChange={this.onAddFileImageChange6} /> 
                                        <br/>
                                        {this.loading6()}
                                        <br/>
                                        <p>1722 x 566 px</p>
                                        <button className='btn btn-success mt-3' onClick={() => this.onBtnSavePhotos6(6)}>Upload</button>
                                    </div>
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

export default connect(mapStateToProps)(addCarousell);