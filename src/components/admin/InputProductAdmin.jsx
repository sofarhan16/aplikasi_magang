import React, { Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { CustomInput } from 'reactstrap';
import SidebarAdmin from './SidebarAdmin';
import { KONEKSI } from '../../support/config';
import ReactLoading from 'react-loading';
import Compressor from 'compressorjs';

class InputProductAdmin extends Component {
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

        activePage2: 1, 
        tampilPerPage2: 5, 
        totalItem2: 0, 
        totalPage2: 0, 
        startIndex2: 0, 
        finishIndex2: 0, 
        listPage2: [],

        searchListProduk:[],
        loading:'',
        request:[],
        verify: [],
        kode: '',
        kategoris: '',

        id_kategori: '',
        id_negara: ''

    }
    
    componentDidMount() {
        this.getListProduct();
        this.getCountry()
        this.getCategory()
        this.getRequest()
        this.getRequestToverify()
    }
    getRequest=()=>{

       
            axios.get(`${KONEKSI}/product/getproductrequest`
            ).then((res) => {
                this.setState({request: res.data}); 
                this.setState({totalItem2: this.state.request.length});
                this.setState({totalPage2: Math.ceil(this.state.totalItem2 / this.state.tampilPerPage2)})              
            }).catch((err) => {
                console.log(err);
            })
        
        
       }

    getRequestToverify = () => {

        axios.get(`${KONEKSI}/product/getProduktoVerified`)
        .then((res) => {
            this.setState({verify: res.data})
            console.log(res.data)
        }).catch((err) => {

        })

    }

    getListProduct = () => {
        axios.get(`${KONEKSI}/product/getproduct`
        ).then((res) => {
            this.setState({listProduk: res.data, searchListProduk: res.data}); 
            console.log(res.data)
            this.setState({totalItem: this.state.listProduk.length});
            this.setState({totalPage: Math.ceil(this.state.totalItem / this.state.tampilPerPage)})     
        }).catch((err) => {
            console.log(err);
        })
    }
    renderPagination = () => {
        //this.setState({listPage: []})
        for (let i = 0; i < this.state.totalPage; i++) {
                //listPageNumb += <li className="page-item"><a className="page-link" href="#">{i+1}</a></li>
                this.state.listPage[i] = i+1;
        }
        console.log(this.state.listPage);
        var listPageJSX = this.state.listPage.slice(this.state.activePage-1,this.state.activePage+3 ).map((item) => {
            return <li className="page-item" onClick={() => this.setState({activePage: item})}><a className="page-link">{item}</a></li>
        }) 
        //console.log(listPageNumb)
        return listPageJSX;
    }
    renderPagination2=()=>{
        if(this.state.activePage==1){
            
            return(
                <ul className="pagination"> 
                   
                                 {this.renderPagination()}
                                 <li className="page-item">
                                     <a className="page-link" onClick={() => this.setState({activePage: this.state.activePage+1})} aria-label="Next"><span aria-hidden="true">&raquo;</span></a>
                                 </li>
                </ul>
             )
        }else if(this.state.totalPage==this.state.activePage  ){
            return(
                <ul className="pagination"> 
                     <li class="page-item">
                                     <a className="page-link" onClick={() => this.setState({activePage: this.state.activePage-1})} aria-label="Previous" ><span aria-hidden="true">&laquo;</span></a>
                                 </li>
                                 {this.renderPagination()}
                                 
                </ul>
             )
        }else{
            console.log(this.state.totalPage)
            return(
                <ul className="pagination"> 
                     <li class="page-item">
                                     <a className="page-link" onClick={() => this.setState({activePage: this.state.activePage-1})} aria-label="Previous" ><span aria-hidden="true">&laquo;</span></a>
                                 </li>
                                 {this.renderPagination()}
                                 <li className="page-item">
                                     <a className="page-link" onClick={() => this.setState({activePage: this.state.activePage+1})} aria-label="Next"><span aria-hidden="true">&raquo;</span></a>
                                 </li>
                </ul>
             )
        }
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
    onBtnAddClick = () => {
        this.setState({loading:true})
        if(document.getElementById("AddImage").files[0] !== undefined) {
            var formData = new FormData()
            var headers = {
                headers: 
                {'Content-Type': 'multipart/form-data'}
            }
            var ids= this.refs.addIsbn.value;
            var nama_produk= this.refs.addJudul.value;
           var  harga= this.refs.addHarga.value;
           var  berat= this.refs.addBerat.value;
           var  deskripsi= this.refs.addDeskripsi.value;
           var  id_negara= this.refs.addNegara.value;
           var  id_kategori= this.refs.addKategori.value;
           if(ids==""||nama_produk==""||harga==""||berat==""||deskripsi==""||id_negara==""||id_kategori==""){
               alert("semua data pada form wajib diisi dan dipilih")
               this.setState({loading:false})
           }else{
            var data = {
                id: this.refs.addIsbn.value,
                nama_produk: this.refs.addJudul.value,
                harga: this.refs.addHarga.value,
                berat: this.refs.addBerat.value,
                deskripsi: this.refs.addDeskripsi.value,
                id_negara: this.state.id_negara,
                id_kategori: this.state.id_kategori,
                limited:this.refs.addLimited.value
            }

            // var warna = this.refs.addWarna.value
            // var warna = warna.replace(/ /g, "");
            // var arrW = new Array()
            // arrW = warna.split(',')
            // // console.log(arr)
            // var warnas = {
            //     id_produk: data.id,
            //     nama: arrW
            // }

            // console.log(arrW.length)


            console.log(data)

            if(document.getElementById('AddImage')){
                formData.append('gambar', document.getElementById('AddImage').files[0])
            }
            
            formData.append('data', JSON.stringify(data))
            // formData.append('warna', JSON.stringify(warnas))
            console.log(data)
            console.log(formData)
            axios.post(`${KONEKSI}/product/addproduct`, formData, headers)
            .then((res) => {
                
                alert("Produk Berhasil Diunggah!")
                this.setState({loading:false})
                console.log(res.data);
                this.refs.formLeft.reset();
                this.refs.formRight.reset(); 
                this.getListProduct()

                // for(let i = 0; i < arrW.length; i++){

                //     axios.post(`${KONEKSI}/product/addWarna`, {
                //         id_produk: data.id,
                //         nama: arrW[i]
                //     }).then((res) => {  
                        
                //     }).catch((err) => {
                //         console.log(err)
                //     })

                // }

                //this.setState({ brandList: res.data })
                //this.setState({message:"Bukti Pembayaran Berhasil Diunggah"})
                //this.getListPayment();
               
            })
            .catch((err) =>{
                console.log(err)
                alert("Gagal menginput tolong muat ulang page")
                this.setState({loading:false})
            })
           }
            
        }
        else {
            alert('Image harus diisi!')
            this.setState({loading:false})
        }
    }

    onBtnSaveClick = (id) => {
        
        var formData = new FormData()
        var headers = {
            headers: 
            {'Content-Type': 'multipart/form-data'}
        }

        var data = {
            id: this.refs.editId.value,
            nama_produk: this.refs.editName.value,
            harga: this.refs.editHarga.value,
            berat: this.refs.editBerat.value,
            deskripsi: this.refs.editDeskripsi.value,
            id_negara: this.refs.editNegara.value,
            id_kategori: this.refs.editKategori.value
        }

        if(document.getElementById('EditImage')){
            formData.append('gambar', document.getElementById('EditImage').files[0])
        }
        formData.append('data', JSON.stringify(data))

        axios.put(`${KONEKSI}/product/editproduct/` + id, formData, headers)
        .then((res) => {
            alert("Edit Produk Success")
            this.setState({ listProduk: res.data, searchListProduk: res.data, selectedEditBookId: 0 })
            this.getListProduct()
        })
        .catch((err) =>{
            console.log(err)
        })
    }

    onBtnDeleteClick = (id) => {
        if(window.confirm('Are you sure to delete?')) {
            axios.delete(`${KONEKSI}/product/deleteproduct/` + id)
            .then((res) => {
                alert('Delete Success');
                this.setState({ listProduk: res.data, searchListProduk: res.data })
                this.getListProduct()
            })
            .catch((err) => {
                alert('Error')
                console.log(err);
            })
        }
    }

    onBtnSearchClick = () => {
        var idP  = this.refs.searchId.value;
        // var nama_produk = this.refs.searchName.value;

        var arrSearch = this.state.listProduk.filter((item) => {
            return item.id.toLowerCase().includes(idP.toLowerCase())
        })
        this.setState({searchListProduk: arrSearch})
    }
    editProduct=(item)=>{
        return <Redirect to="/admin/editproduk" produk={item}/>
    }
    renderListJSX = () => {
        //var srcgambar = `${KONEKSI}/images/book`;
        var { activePage, tampilPerPage } = this.state
        var listJSX = this.state.searchListProduk.slice( (activePage-1)*tampilPerPage, (activePage*tampilPerPage)).map(item => {
            if(item.id !== this.state.selectedEditBookId){
                return (
                    <tr key={item.id} className="text-wrap" style={{fontSize:'12px'}}>                        
                        <td>{<img src={KONEKSI+item.gambar} width="60px" alt={item.nama_produk} /> }</td>
                        <td className="align-middle">{item.id}</td>
                        <td className="align-middle text-truncate" style={{maxHeight:"20px", maxWidth:"100px"}}>{item.nama_produk}</td>
                        <td className="align-middle text-danger">$ {item.harga.toLocaleString()}</td>
                        <td className="align-middle">{item.berat} gr</td>
                        <td className="align-middle text-truncate" style={{maxHeight:"20px", maxWidth:"100px"}}>{item.deskripsi}</td>
                       
                        <td className="align-middle">{item.nama_negara}</td>
                        <td className="align-middle">{item.limited}</td>
                        <td className="align-middle">{item.nama_kategori}</td>
                        <td className="align-middle">{item.best}</td>
                        <td className="align-middle">{item.offer}</td>
                        <td className='align-middle'><a href={`/admin/addphotos?product=${item.id}`}><button type="button" className='btn btn-sm  btn-default orange'><i class="far fa-images"></i></button></a></td>
                        <td className="align-middle"><a href={`/admin/editproduct?product=${item.id}`}  className="btn btn-sm btn-warning"><i className="fas fa-edit"></i></a> {' '}
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => this.onBtnDeleteClick(item.id)} ><i className="fas fa-trash-alt"></i></button></td>
                    </tr>
                )
            }
            
        })

        return listJSX;
    }
    onBtnActionRequest=(id,status)=>{
        var request = window.confirm(`Apakah Kamu Yakin `+status);
        if(request){
            axios.post(`${KONEKSI}/product/editrequestproduct`,{
                id,status
            })
            .then((res) => {
                alert("Produk Request Berhasil Diupdate!")
                this.getRequest()
            })
            .catch((err) =>{
                console.log(err)
                alert("Gagal update request produk, bantu kami dengan cara laporkan hal ini ke kontak kami \n"+err)
            })
        }

    }

    onBtnActionRequestAdmin=(id,status)=>{
        var request = window.confirm(`Apakah Kamu Yakin `+status);
        if(request){
            axios.post(`${KONEKSI}/product/editrequestproductAdmin`,{
                id,status
            })
            .then((res) => {
                alert("Produk Request Berhasil Diupdate!")
                window.location.reload()
                this.getRequest()
            })
            .catch((err) =>{
                console.log(err)
                alert("Gagal update request produk, bantu kami dengan cara laporkan hal ini ke kontak kami \n"+err)
            })
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
                    <td className="align-middle text-truncate" >{item.status}</td>
                    <td className="align-middle text-truncate" ><button className="btn btn-default orange" onClick={()=>this.onBtnActionRequest(item.id,"Barang Di katalog")}>Barang Di katalog</button>{` `} 
                    <button className="btn btn-danger" onClick={()=>this.onBtnActionRequest(item.id,"Tolak Request")}>Tolak Request</button>
                    </td>
                                
                </tr>
            )
       })
       
       return listJSX;
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
            return <option value={item.kode}>{item.negara}</option>
        })
        return country
    }
    putCategoryOption=()=>{
        const category = this.state.kategori.map(item=>{
        return <option value={item.kode}>{item.nama} | {item.kode}</option>
        })
        return category
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


    renderToVerify = () => {

        const all = this.state.verify.map((item) => {
            return (
                <tr key={item.id_customer} className="text-wrap" style={{fontSize:'12px'}}>    
                    <td><a href={`${KONEKSI}/${item.gambar}`} target="_blank"><img src={`${KONEKSI}/${item.gambar}`} width="50"/></a></td>                    
                    <td className="align-middle">{item.nama_produk}</td>
                    <td className="align-middle">$ {item.harga}</td>
                    <td className="align-middle text-truncate" >{item.berat} gram</td>
                    <td className="align-middle text-truncate" style={{maxHeight:"20px", maxWidth:"100px"}}>{item.deskripsi}</td>
                    <td className="align-middle text-truncate" style={{maxHeight:"20px", maxWidth:"100px"}}>{item.nama}</td>
                    <td className="align-middle text-truncate" ><button className="btn btn-success btn-sm" onClick={()=>this.onBtnActionRequestAdmin(item.kode_barang,"Barang Di katalog")}><i className="fa fa-check"></i></button>{` `} 
                    <button className="btn btn-danger  btn-sm" onClick={()=>this.onBtnActionRequestAdmin(item.kode_barang,"Tolak Request")}><i className="fa fa-close"></i></button>
                    </td>         
                </tr>
            )
        })
        return all

    }



    changeNegara = () => {
        

        document.getElementById('Ikategori').disabled=""
        var n = this.refs.addNegara.value 
        
        axios.get(`${KONEKSI}/product/getoneCountry/`+n)
        .then((res) => {
            var obj = res.data
            var hasil =obj[Object.keys(obj)[0]]
            this.setState({id_negara: hasil.id})
            console.log(hasil)
        }).catch((err) => {
            console.log(err)
        })

        var { kode } = this.state
        this.setState({kode: n})
        

    }

    changeKategori = () => {

        var random  = Math.floor(500 + Math.random() * 2000)
        var k = this.refs.addKategori.value 
        
        axios.get(`${KONEKSI}/product/getoneCategory/`+k)
        .then((res) => {
            var obj = res.data
            var hasil =obj[Object.keys(obj)[0]]
            this.setState({id_kategori: hasil.id})
        }).catch((err) => {
            console.log(err)
        })

        var { kode } = this.state
        var kate = k
        console.log(kate)
        var gabung = kate+random
        this.setState({kategoris: gabung})
        

    }



    render(){
        console.log(this.state.totalPage)
        const { username, role } = this.props.user;
        console.log(this.state.kode)
        
        var { kode, kategoris } = this.state

        var kodes = kode + kategoris

        if(this.state.loading == true){
            return(
                <div className="row loading" style={{borderRadius: "5px"}}>
                <ReactLoading type='cylon' color="#065286" height={100} width={190} />
            </div>
            )
        }
        if(username !== "" && role === "Admin" ){
            return (
                <div className="container-fluid">
                    <div className="row">
                        <SidebarAdmin produk="aktif"/>
                        
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
                                    <form ref="formLeft" style={{boxShadow:"none"}} className="col-md-12">                                        

                                    <div class="form-group row">
                                            <label className="col-sm-3 col-form-label">Negara</label>
                                            <div className="col-sm-9">
                                                <select class="custom-select" ref="addNegara" id="Inegara" required onChange={() => { this.changeNegara() }}>
                                                    <option value="" selected>Pilih Negara</option>
                                                    {this.putCountryOption()}
                                                </select>
                                            </div>
                                        </div>        

                                        <div class="form-group row">
                                            <label className="col-sm-3 col-form-label">Kategori</label>
                                            <div className="col-sm-9">
                                                <select class="custom-select" ref="addKategori" required id="Ikategori" disabled="true" onChange={() => { this.changeKategori() }}>
                                                    <option value="" selected>Pilih Kategori</option>
                                                    {this.putCategoryOption()}
                                                </select>
                                            </div>
                                        </div> 

                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">ID Produk</label>
                                            <div className="col-sm-9">
                                                <input type="text" ref="addIsbn" maxLength="11" className="form-control form-control-sm" id="inputIsbn" placeholder="ID Produk" value={kodes} required autoFocus readOnly/>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Judul</label>
                                            <div className="col-sm-9">
                                                <input type="text" ref="addJudul" className="form-control form-control-sm" id="inputJudul" placeholder="Judul Produk" required />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Harga</label>
                                            <div className="col-sm-9">
                                                <input type="number" ref="addHarga" className="form-control form-control-sm" id="inputHarga" placeholder="$ " required />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Berat</label>
                                            <div className="col-sm-9">
                                                <input type="number" ref="addBerat" className="form-control form-control-sm" id="inputBerat" placeholder="Weight (gram)" required />
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
                                                <textarea ref="addDeskripsi" className="form-control big-desc" id="inputDeskripsi" placeholder="Deskripsi" rows="3" required />
                                            </div>
                                        </div>  
                                        {/* <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Warna</label>
                                            <div className="col-sm-9">
                                                <input type="text" ref="addWarna" className="form-control form-control-sm" id="inputBerat" placeholder="Weight (gram)" required />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Ukuran</label>
                                            <div className="col-sm-9">
                                                <input type="number" ref="addUkuran" className="form-control form-control-sm" id="inputBerat" placeholder="Weight (gram)" required />
                                            </div>
                                        </div>                                       */}
                                    </form>
                                    
                                    <form ref="formRight" style={{boxShadow:"none"}} className="col-md-12">    
                                    <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Limited Edition</label>
                                            <div className="col-sm-9">
                                                <select class="custom-select" ref="addLimited" id="inputGroupSelect01">
                                                    <option value="Limited Edition">Limited Edition</option>
                                                    <option value="No" selected>No</option>
                                                
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Foto produk</label>
                                            <div className="col-sm-9">
                                                <CustomInput type="file"  className="form-control form-control-sm" id="AddImage" name="AddImage" label={this.state.AddImage} onChange={this.onAddFileImageChange} />
                                            </div>
                                        </div>
                                        {/* <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Foto produk</label>
                                            <div className="col-sm-9">
                                                <CustomInput type="file" className="form-control form-control-sm" id="AddImage2" name="AddImage" label={this.state.AddImage} onChange={this.onAddFileImageChange} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Foto produk</label>
                                            <div className="col-sm-9">
                                                <CustomInput type="file" className="form-control form-control-sm" id="AddImage3" name="AddImage" label={this.state.AddImage} onChange={this.onAddFileImageChange} />
                                            </div>
                                        </div> */}
                                        {/* <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Penulis</label>
                                            <div className="col-sm-9">
                                                <input type="text" ref="addPenulis" className="form-control form-control-sm" id="inputPenulis" placeholder="Nama Penulis" required />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Penerbit</label>
                                            <div className="col-sm-9">
                                                <input type="text" ref="addPenerbit" className="form-control form-control-sm" id="inputPenerbit" placeholder="Nama Penerbit" required />
                                            </div>
                                        </div> */}
                                        <div className="form-group row">
                                            <div className="col-sm-9 offset-sm-3">
                                                <button type="button" class="btn btn-success btn-sm col-12" onClick={this.onBtnAddClick} ><i class="fas fa-plus-circle"></i> Input Catalog</button>
                                            </div>
                                        </div>                                    
                                    </form>
                                </div>
                                {/* ------------------------------------------------------------------------------------------------ */}
                                
                                <hr />
                                <div className="card border col-12 pt-2 pb-2 mb-3">
                                <h5 className="text-secondary text-left mt-1"><i class="fas fa-cogs"></i> Request Products</h5>
                                    <hr />
                                    <table className="table table-hover text-secondary" style={{fontSize:"12px"}}>
                                        <thead className="blue text-white">
                                            <th>Nama Barang</th>
                                            <th>Gambar Barang</th>
                                            <th>Deskripsi Barang</th>
                                            <th>Kategori Barang</th>
                                            <th>status</th>
                                            <th>Action</th>
                                        </thead>
                                        <tbody>
                                            {this.tablelist2()}
                                        </tbody>
                                        
                                    </table>
                                    <center>
                                        <div className="row justify-content-md-center align-center mb-4">
                                            {/* pagination */}
                                            <nav aria-label="Page navigation example">
                                                    {this.renderPagination4()} 
                                            </nav>
                                        </div>
                                    </center>
                                </div>
                                <div className="card border col-12 pt-2 pb-2 mb-3">
                                <h5 className="text-secondary text-left mt-1"><i class="fas fa-cogs"></i> Request to Verify</h5>
                                    <hr />
                                    <table className="table table-hover text-secondary" style={{fontSize:"12px"}}>
                                        <thead className="blue text-white">
                                            <th>Cover</th>
                                            <th>Nama</th>
                                            <th>Harga</th>
                                            <th>Berat (gram)</th>
                                            <th>Deskripsi</th>
                                            <th>Kategori</th>
                                            <th>Action</th>
                                        </thead>
                                        <tbody>
                                            {this.renderToVerify()}
                                        </tbody>
                                        
                                    </table>
                                    <center>

                                        <div className="row justify-content-md-center align-center mb-4">
                                            {/* pagination */}
                                            <nav aria-label="Page navigation example">
                                               
                                                    {this.renderPagination2()}
                                                    
                                                  
                                            </nav>
                                        </div>
                                    </center>
                                </div>


                                <div className="card border col-12 pt-2 pb-2">
                               
                                    <h5 className="text-secondary text-left mt-1"><i class="fas fa-cogs"></i> Manage Products</h5><hr />
                                    <form style={{boxShadow:"none"}} ref="formSearch">
                                        <div className="form-row">
                                            <div className="form-group col-md-2">
                                                <input type="text" ref="searchId" className="form-control form-control-sm" id="searchId" placeholder="product Id" />                                                
                                            </div>
                                            {/* <div className="form-group col-md-3">
                                                <input type="text" ref="searchName" className="form-control form-control-sm" id="searchName" placeholder="Product name" />                                                
                                            </div> */}
                                            <div className="form-group col-md-1">
                                                <button type="button" ref="btnSearch" className="btn btn-success btn-sm" id="searchIsbn" onClick={() => {this.onBtnSearchClick()}} ><i class="fas fa-search"></i> Cari</button>                                                
                                            </div>
                                        </div>                                        
                                    </form>
                                    
                                    <hr />
                                    <table className="table table-hover text-secondary" style={{fontSize:"12px"}}>
                                        <thead className="blue text-white">
                                            <th>Cover</th>
                                            <th>ID Produk</th>
                                            <th>Nama</th>
                                            <th>Harga</th>
                                            <th>Berat (gram)</th>
                                            <th>Deskripsi</th>
                                            <th>Origin</th>
                                            <th>limited</th>
                                            <th>Kategori</th>
                                            <th>Best Product</th>
                                            <th>Offer</th>
                                            <th>add photos</th>
                                            <th>Action</th>
                                        </thead>
                                        <tbody>
                                            {this.renderListJSX()}
                                        </tbody>
                                        
                                    </table>
                                    <center>

                                        <div className="row justify-content-md-center align-center mb-4">
                                            {/* pagination */}
                                            <nav aria-label="Page navigation example">
                                               
                                                    {this.renderPagination2()}
                                                    
                                                  
                                            </nav>
                                        </div>
                                    </center>
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

export default connect(mapStateToProps)(InputProductAdmin);