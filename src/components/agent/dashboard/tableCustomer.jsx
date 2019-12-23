import React, { Component} from 'react';
import { connect } from 'react-redux';
import Cookies from "universal-cookie";
import axios from 'axios';
import { KONEKSI } from '../../../support/config';
import { CustomInput } from 'reactstrap';
import ReactLoading from 'react-loading';
const cookies = new Cookies();

class Customer extends Component {
    state={
        customer:[],
        request:[],
        AddImage:"",
        loading:'',
        activePage2: 1, 
        tampilPerPage2: 5, 
        totalItem2: 0, 
        totalPage2: 0, 
        startIndex2: 0, 
        finishIndex2: 0, 
        listPage2: [],
        negara: 0,
    }
   componentDidMount(){
    this.customer();
    this.getRequestUser()
   }

   handleChange = (event) => {

    var pilih = event.target.value;
    this.setState({negara: pilih})

   }

   onBtnAddClick = () => {
        this.setState({loading:true})
        if(document.getElementById("AddImage").files[0] !== undefined) {
            var formData = new FormData()
            var headers = {
                headers: 
                {'Content-Type': 'multipart/form-data'}
            }

            var data = {
                nama_barang:this.refs.addname.value,
                deskripsi:this.refs.adddesc.value,
                kategori:this.refs.addkategori.value,
                id_user:this.props.user.id_agent,
                id_negara: this.state.negara
            }

            console.log(data)

            if(document.getElementById('AddImage')){
                formData.append('gambar', document.getElementById('AddImage').files[0])
            }
            
            formData.append('data', JSON.stringify(data))
            console.log(data)
            console.log(formData)
            axios.post(`${KONEKSI}/product/addrequestproduct`, formData, headers)
            .then((res) => {
                
                alert("Produk Request Berhasil Diunggah!")
                this.setState({loading:false})
                console.log(res.data);
                this.getRequestUser()
            })
            .catch((err) =>{
                console.log(err)
                this.setState({loading:false})
                alert("Gagal merequest produk, bantu kami dengan cara laporkan hal ini ke kontak kami \n"+err)
            })
        }
        else {
            alert('Image harus diisi!')
            this.setState({loading:false})
        }
    }
   customer=()=>{
    var username = cookies.get('myPengguna');
    axios.post(`${KONEKSI}/customer/getcustomer`,{
        username
    }
    ).then((res) => {
        this.setState({customer: res.data});          
    }).catch((err) => {
        console.log(err);
    })
   }
   getRequestUser=()=>{
    var id_user = this.props.user.id_agent;
    if(id_user !=0){
        axios.get(`${KONEKSI}/product/getproductrequestbyuser/`+id_user
        ).then((res) => {
            this.setState({request: res.data}); 
            this.setState({totalItem2: this.state.request.length});
                this.setState({totalPage2: Math.ceil(this.state.totalItem2 / this.state.tampilPerPage2)})                       
        }).catch((err) => {
            console.log(err);
        })
    }else{
        window.location.reload()
    }
    
   }
   table=()=>{
       return(
        <table className="table table-hover text-secondary" style={{fontSize:"12px"}}>
        <thead className="blue text-white">
            <th>Nama Lengkap</th>
            <th>KTP</th>
            <th>NPWP</th>
            <th>Nomor Telepon</th>
            <th>Alamat</th>
            <th>Kecamatan</th>
            <th>Kota</th>
            <th>Provinsi</th>
            <th>Kodepos</th>
        </thead>
        <tbody>
        {this.tablelist()}
        </tbody>
    </table>
       )
   }
   tablelist=()=>{
    var listJSX = this.state.customer.map(item => {
      
           
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
            </tr>
        )
   })

return listJSX;
   }
renderListJSX = () => {
    if(this.state.customer.length==0){
        return <h1 className="text-secondary text-center">
        Your customer list still empty </h1>
    }else{
        return this.table()
    }
   
}
table2=()=>{
    return(
     <table className="table table-hover text-secondary" style={{fontSize:"12px"}}>
     <thead className="blue text-white">
         <th>Nama Barang</th>
         <th>Gambar Barang</th>
         <th>Deskripsi Barang</th>
         <th>Kategori Barang</th>
         <th>status</th>
     </thead>
     <tbody>
     {this.tablelist2()}
     </tbody>
 </table>
    )
}
renderPagination3 = () => {
    //this.setState({listPage: []})
    for (let i = 0; i < this.state.totalPage2; i++) {
            //listPageNumb += <li className="page-item"><a className="page-link" href="#">{i+1}</a></li>
            this.state.listPage2[i] = i+1;
    }
    var listPageJSX = this.state.listPage2.slice(this.state.activePage2-1,this.state.activePage2+3 ).map((item) => {
        return <li className="page-item" onClick={() => this.setState({activePage2: item})}><a className="page-link">{item}</a></li>
    }) 
    //console.log(listPageNumb)
    return listPageJSX;
}
renderPagination4=()=>{
    if(this.state.activePage2==1){
        
        return(
            <ul className="pagination"> 
               
                             {this.renderPagination3()}
                             <li className="page-item">
                                 <a className="page-link" onClick={() => this.setState({activePage2: this.state.activePage2+1})} aria-label="Next"><span aria-hidden="true">&raquo;</span></a>
                             </li>
            </ul>
         )
    }else if(this.state.totalPage2==this.state.activePage2  ){
        return(
            <ul className="pagination"> 
                 <li class="page-item">
                                 <a className="page-link" onClick={() => this.setState({activePage2: this.state.activePage2-1})} aria-label="Previous" ><span aria-hidden="true">&laquo;</span></a>
                             </li>
                             {this.renderPagination3()}
                             
            </ul>
         )
    }else{

        return(
            <ul className="pagination"> 
                 <li class="page-item">
                                 <a className="page-link" onClick={() => this.setState({activePage2: this.state.activePage2-1})} aria-label="Previous" ><span aria-hidden="true">&laquo;</span></a>
                             </li>
                             {this.renderPagination3()}
                             <li className="page-item">
                                 <a className="page-link" onClick={() => this.setState({activePage: this.state.activePage2+1})} aria-label="Next"><span aria-hidden="true">&raquo;</span></a>
                             </li>
            </ul>
         )
    }
}
tablelist2=()=>{
    var { activePage2, tampilPerPage2 } = this.state
    var listJSX = this.state.request.slice( (activePage2-1)*tampilPerPage2, (activePage2*tampilPerPage2)).map(item => {
   
        
     return (
         <tr key={item.id_customer} className="text-wrap" style={{fontSize:'12px'}}>                        
             <td className="align-middle">{item.nama_barang}</td>
             <td className="align-middle text-truncate" style={{maxHeight:"20px", maxWidth:"100px"}}><a href={`${KONEKSI}/${item.gambar}`} target="_blank"><img src={`${KONEKSI}/${item.gambar}`} width="50"/></a></td>
             <td className="align-middle text-truncate" style={{maxHeight:"20px", maxWidth:"100px"}}>{item.deskripsi}</td>
             <td className="align-middle text-truncate" style={{maxHeight:"20px", maxWidth:"100px"}}>{item.kategori}</td>
             <td className="align-middle text-truncate" style={{maxHeight:"20px", maxWidth:"100px"}}>{item.status}</td>
                         
         </tr>
     )
})

return listJSX;
}
renderListJSX2 = () => {
    if(this.state.loading == true){
        return(
            <div className="row loading" style={{borderRadius: "5px"}}>
            <ReactLoading type='cylon' color="#065286" height={100} width={190} />
        </div>
        )
    }else{
        if(this.state.request.length==0){
            return <h1 className="text-secondary text-center">
            Your Request list still empty </h1>
        }else{
            return(
                <div>
                    {this.table2()}
            <center>

                <div className="row justify-content-md-center align-center mb-4">
                    {/* pagination */}
                    <nav aria-label="Page navigation example">
                    
                            {this.renderPagination4()}
                            
                        
                    </nav>
                </div>
                </center>
                </div>
            )
        }
    }
}
onAddFileImageChange = () => {
    if(document.getElementById("AddImage").files[0] !== undefined) {
        this.setState({AddImage: document.getElementById("AddImage").files[0].name})
    }
    else {
        this.setState({AddImage: 'Unggah Gambar Produk'})
    }
}
    render(){
        
            return (
               <div>
                    <div className="card border col-12 pt-2 pb-2 mt-4">
                <h5 className="text-secondary text-left mt-1"><svg class="feather feather-users sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> List Customer</h5><hr />
               
                {this.renderListJSX()}
               
            </div>
            <div className="card border col-12 pt-2 pb-2 mt-4">
                <h5 className="text-secondary text-left mt-1">
                Special Request
                </h5><hr />
               
                {this.renderListJSX2()}
                
                <div className="my3 ">
                <hr />
                <form>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Nama Barang</label>
                        <div className="col-sm-9">
                            <input type="text" ref="addname" className="form-control form-control-sm" id="fullname" placeholder="Nama Barang" required />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Gambar Barang</label>
                        <div className="col-sm-9">
                        <CustomInput type="file"  className="form-control form-control-sm" id="AddImage" name="AddImage" label={this.state.AddImage} onChange={this.onAddFileImageChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Deskripsi Barang</label>
                        <div className="col-sm-9">
                            <input type="text" minLength="15" ref="adddesc" className="form-control form-control-sm" id="nomer_NPWP" placeholder="Deskripsi" required />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Kategori Barang</label>
                        <div className="col-sm-9">
                            <input type="tel" ref="addkategori" className="form-control form-control-sm" id="nomer_ktp" placeholder="Kategori Barang" required />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Pilih Negara</label>
                        <div className="col-sm-9">
                            <select class="form-control" onChange={this.handleChange}>
                                <option selected disabled hidden>Pilih Negara</option>
                                <option value="1">Japan</option>
                                <option value="2">Hongkong</option>
                                <option value="3">Australia</option>
                                <option value="4">Malaysia</option>
                                <option value="5">Singapore</option>
                                <option value="6">Korea Selatan</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-9 offset-sm-3">
                            <button type="button" class="btn btn-success btn-sm col-12" onClick={this.onBtnAddClick} ><i class="fas fa-plus-circle"></i>Request Barang</button>
                        </div>
                    </div>
                </form>
                </div>
            </div>
               </div>
                            
                  
            );
            }
}

const mapStateToProps = (state) => {
    return { 
        user: state.auth
    };
}

export default connect(mapStateToProps)(Customer);