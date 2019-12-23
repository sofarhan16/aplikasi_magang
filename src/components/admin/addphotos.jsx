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
class AddPhotos extends Component {
    state={
        dataImage:[],AddImage1:'Unggah Gambar Produk',AddImage2:'Gambar Produk belum diunggah',AddImage3:'Gambar Produk belum diunggah',AddImage4:'Gambar Produk belum diunggah ',loading1:'',loading2:'',loading3:'',loading4:''
    }
    componentDidMount(){
        var params = queryString.parse(this.props.location.search)
        var product = params.product;
        this.getDataImage(product)
    }
    getDataImage=(id)=>{
        axios.get(`${KONEKSI}/product/getproductdetail/${id}`)
        .then((res) => {
            console.log(res);
            this.setState({dataImage:res.data,
                AddImage1:res.data[0].gambar,
                AddImage2:res.data[0].gambar2,
                AddImage3:res.data[0].gambar3,
                AddImage4:res.data[0].gambar4
            })
            console.log(this.state.dataImage)
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
        axios.put(`${KONEKSI}/product/AddImage1/` + id, formData, headers)
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
            formData.append('gambar2', document.getElementById('AddImage2').files[0])
        }
        this.setState({loading2:true})
        axios.put(`${KONEKSI}/product/AddImage2/` + id, formData, headers)
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
    onBtnSavePhotos3 = (id) => {
        var formData = new FormData()
        var headers = {
            headers: 
            {'Content-Type': 'multipart/form-data'}
        }

        if(document.getElementById('AddImage3')){
            formData.append('gambar3', document.getElementById('AddImage3').files[0])
        }
        this.setState({loading3:true})
        axios.put(`${KONEKSI}/product/AddImage3/` + id, formData, headers)
        .then((res) => {
            this.setState({loading3:false})
            alert("Add Image 3 Success")
            window.location.reload();
        })
        .catch((err) =>{
            console.log(err)
        })
    }
    onAddFileImageChange4 = () => {
        if(document.getElementById("AddImage4").files[0] !== undefined) {
            this.setState({AddImage4: document.getElementById("AddImage4").files[0].name})
        }
        else {
            this.setState({AddImage4: 'Unggah Gambar Produk'})
        }
    }
    onBtnSavePhotos4 = (id) => {
        var formData = new FormData()
        var headers = {
            headers: 
            {'Content-Type': 'multipart/form-data'}
        }

        if(document.getElementById('AddImage4')){
            formData.append('gambar4', document.getElementById('AddImage4').files[0])
        }
        this.setState({loading4:true})
        axios.put(`${KONEKSI}/product/AddImage4/` + id, formData, headers)
        .then((res) => {
            this.setState({loading4:false})
            alert("Add Image 4 Success")
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
    putImageCarousell=()=>{
        var image = this.state.dataImage.map(item=>{
            var img2 =()=>{
                if(item.gambar2==null){
                    return  <img src={`/imagenotfound.png`} />  
                }
                return<img src={`${KONEKSI}/${item.gambar2}`} /> 
            }
            var img3 =()=>{
                if(item.gambar3==null){
                    return  <img src={`/imagenotfound.png`} />  
                }
                return<img src={`${KONEKSI}/${item.gambar3}`} /> 
            }
            var img4 =()=>{
                if(item.gambar4==null){
                    return  <img src={`/imagenotfound.png`} />  
                }
                return<img src={`${KONEKSI}/${item.gambar4}`} /> 
            }
            
            return(
                <Carousel className='col-md-4'> 
                <div>
                    <img src={`${KONEKSI}/${item.gambar}`} />    
                </div>
                <div>
                   {img2()}
                </div>
                <div>
                    {img3()}
                </div>
                <div>
                    {img4()}
                </div>
                </Carousel>
            )
        })
        return image
    }
    render(){
        const { username, role } = this.props.user;

        if(username !== "" && role === "Admin" ){
            return (
                <div className="container-fluid">
                    <div className="row">
                        <SidebarAdmin />

                        <div className="col-md-10 bg-light pl-3 pt-3">
                                <div className="alert alert-warning media col-12">
                                    <img className="img img-fluid" src="http://localhost:3000/images/flat/039-stadistics.png" width="100px" />
                                    <div className="col-md-10 media-body">
                                        <h4>Hallo Admin</h4>
                                        <p> Lengkapi foto produk disini</p>
                                    </div>
                                    
                                </div> 
                              <div className='row'>
                              {this.putImageCarousell()}
                               <div className='col-md-8'>
                                    <div className='p-5 border col-md-12 text-left mb-3'>
                                        <h5 className='bold'>Gambar 1</h5>
                                        <CustomInput type="file"  className="form-control form-control-sm" id="AddImage1" name="AddImage1" label={this.state.AddImage1} onChange={this.onAddFileImageChange1} />    
                                        <br/>
                                        {this.loading1()}
                                        <br/>
                                        <button className='btn btn-success mt-3' onClick={() => this.onBtnSavePhotos1(this.state.dataImage[0].id)}>Upload</button>
                                    </div>
                                    <div className='p-5 border col-md-12 text-left mb-3'>
                                        <h5 className='bold'>Gambar 2</h5>
                                        <CustomInput type="file"  className="form-control form-control-sm"  id="AddImage2" name="AddImage2" label={this.state.AddImage2} onChange={this.onAddFileImageChange2} />    
                                        <br/>
                                        {this.loading2()}
                                        <br/>
                                        <button className='btn btn-success mt-3' onClick={() => this.onBtnSavePhotos2(this.state.dataImage[0].id)}>Upload</button>
                                    </div>
                                    <div className='p-5 border col-md-12 text-left mb-3'>
                                        <h5 className='bold'>Gambar 3</h5>
                                        <CustomInput type="file"  className="form-control form-control-sm"  id="AddImage3" name="AddImage3" label={this.state.AddImage3} onChange={this.onAddFileImageChange3} /> 
                                        <br/>
                                        {this.loading3()}
                                        <br/>
                                        <button className='btn btn-success mt-3' onClick={() => this.onBtnSavePhotos3(this.state.dataImage[0].id)}>Upload</button>
                                    </div>
                                    <div className='p-5 border col-md-12 text-left mb-3'>
                                        <h5 className='bold'>Gambar 4</h5>
                                        <CustomInput type="file"  className="form-control form-control-sm"  id="AddImage4" name="AddImage4" label={this.state.AddImage4} onChange={this.onAddFileImageChange4} /> 
                                        <br/>
                                        {this.loading4()}
                                        <br/>
                                        <button className='btn btn-success mt-3' onClick={() => this.onBtnSavePhotos4(this.state.dataImage[0].id)}>Upload</button>
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

export default connect(mapStateToProps)(AddPhotos);