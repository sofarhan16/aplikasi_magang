import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux'
import { KONEKSI } from '../support/config';
import { select_produk } from '../actions'
import { loadOfCart } from '../actions';
import BannerKu from './BannerKu';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Cookies from "universal-cookie";
import ProductRecomendation from './fitur/ProductRecomendation';
import ReactImageMagnify from 'react-image-magnify'
import { anyTypeAnnotation } from '@babel/types';
import Slider from "react-slick";
import ImageZoom from 'react-medium-image-zoom';
import Select from 'react-select';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const cookies = new Cookies();
class ProductDetailKu extends Component {
    state = {
        selectedOption: null,
      };
      constructor(props) {
        super(props);
    
        this.toggle = this.toggle.bind(this);
        this.state = {
          dropdownOpen: false,
          customer:0,
          listCustomer:[],
          namaCostumer:'Choose Customer',
          dataImage:[],
          curency:0,
          selectedOption: null,
        level:'',
        bronze:0,
        silver:0,
        gold:0,
        platinum:0,
        };
      }

      dataSelect=()=>{
        const userList = this.state.listCustomer.map((item)=>{
            
            return { value: item.id_customer, label: `${item.nama_lengkap} | ${item.kecamatan}` } 
        
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
    
      toggle() {
        this.setState(prevState => ({
          dropdownOpen: !prevState.dropdownOpen
        }));
      }
    componentDidMount(){
        // this.getuser()
        this.getCurency()
        this.getListUser()
        var id = this.props.match.params.id;
     

        axios.get(`${KONEKSI}/product/getproductdetail/${id}`)
        .then((res) => {
            console.log(res);
            this.props.select_produk(res.data[0])
            this.setState({dataImage:res.data
            })
        }).catch((err) => {
            console.log(err)
        })
    }
   
    
    getCurency=()=>{
        axios.get(`${KONEKSI}/transaction/curency`
        ).then((res) => {
            this.setState({ 
                curency: res.data[0].dollar,                 
                bronze: res.data[0].bronze,
                silver:res.data[0].silver,

                gold:res.data[0].gold,
                platinum:res.data[0].platinum,
                selectedRow: 0 });
        }).catch((err) => {
            console.log(err);
        })
    }

    onAddToCart = () => {
        const { id, nama_produk, harga, berat } = this.props.produk;
        var id_customer = this.state.customer;
        var username = this.state.namaCostumer;
        var id_agent = this.props.user.id_agent
        var jumlah_beli = parseInt(this.refs.tbJumlah.value);
        var total_berat = parseInt(berat * jumlah_beli);
        var total_harga = harga * jumlah_beli;
        var id_produk = id;
        var catatan = this.refs.tCatatan.value;
        console.log(username, id, nama_produk, harga, berat, jumlah_beli, total_harga);

        axios.post(`${KONEKSI}/transaction/addtocart`, {
            id_customer,
            id_agent,
            id_produk,
            nama_produk,
            harga,
            berat,
            jumlah_beli,
            total_berat,
            total_harga,
            catatan
        }).then((res) => {
            console.log(res);
            alert(`produk ${nama_produk} \nberhasil ditambah ke cart sejumlah: ${jumlah_beli} untuk costumer: ${username}`)
            this.props.loadOfCart({id_customer})
        }).catch((err) => {
            alert("Pastikan Kembali Costumer anda");
        })
    }

    renderButtonBuy = () => {
      
        if (this.props.username === ""){
            return <a href="/login"><button className="btn btn-success col-md-11 disabled"><i class="fas fa-exclamation-triangle"></i> Sign in Now!</button></a>
        }else if(this.props.level !== null && this.state.namaCostumer != 'Choose Customer'){
            return <button onClick={this.onAddToCart} className="btn btn-default orange col-md-11">Add to Dashboard</button>
        }else if(this.props.level === null){
            return <a href='/verify'><button className="btn btn-success col-md-11 disabled"><i class="fas fa-exclamation-triangle"></i>Subscribe for buying</button></a>
        }else if(this.props.user.role == "Admin"){
            return <a  href="/admin/home" className="btn btn-default orange col-md-11">Hi admin</a>
        }else{
            return <button  className="btn btn-danger col-md-11">Choose Customer First</button>
        }
       
      
    }
    getListUser =()=>{
        var username = cookies.get('myPengguna');
    axios.post(`${KONEKSI}/customer/getcustomer`,{
        username
    }
        ).then((res) => {
            this.setState({listCustomer: res.data}); 
            console.log(this.state.listCustomer)  
        }).catch((err) => {
            console.log(err);
        })
    }
    listUser=()=>{
        const userList = this.state.listCustomer.map((item)=>{
            return(
               
                    <DropdownItem onClick={()=>this.setState({customer:item.id_customer, namaCostumer:item.nama_lengkap})}>{item.nama_lengkap}</DropdownItem>
                
            )
        })
        return userList
    }
    ReactImageMagnify=()=>{
        var settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
          };
        var image = this.state.dataImage.map(item=>{
            var img2 =()=>{
                if(item.gambar2==null){
                    
                    return  null
                }

                return<img src={`${KONEKSI}/${item.gambar2}`} className='rounded'/> 
            }
            var img3 =()=>{
                if(item.gambar3==null){
                    return  null
                }
                return<img src={`${KONEKSI}/${item.gambar3}`} className='rounded'/> 
            }
            var img4 =()=>{
                if(item.gambar4==null){
                    return  null 
                }
                return<img src={`${KONEKSI}/${item.gambar4}`} className='rounded'/> 
            }
            
            return( 
                <Slider {...settings}>
                <div>
                <ImageZoom
                    image={{
                    src: `${KONEKSI}/${item.gambar}`,
                    alt: 'Golden Gate Bridge',
                    className: 'img',
                    style: { width: '100%', height: '450px' }
                    }}
                    zoomImage={{
                    src: `${KONEKSI}/${item.gambar}`,
                    alt: 'Golden Gate Bridge'
                    }}
                />
                </div>
                <div>
                <ImageZoom
                    image={{
                    src: `${KONEKSI}/${item.gambar2}`,
                    alt: 'Golden Gate Bridge',
                    className: 'img',
                    style: { width: '100%' }
                    }}
                    zoomImage={{
                    src: `${KONEKSI}/${item.gambar2}`,
                    alt: 'Golden Gate Bridge'
                    }}
                />
                </div>
                <div>
                <ImageZoom
                    image={{
                    src: `${KONEKSI}/${item.gambar3}`,
                    alt: 'Golden Gate Bridge',
                    className: 'img',
                    style: { width: '100%' }
                    }}
                    zoomImage={{
                    src: `${KONEKSI}/${item.gambar3}`,
                    alt: 'Golden Gate Bridge'
                    }}
                />
                </div>
                <div>
                <ImageZoom
                    image={{
                    src: `${KONEKSI}/${item.gambar4}`,
                    alt: 'Golden Gate Bridge',
                    className: 'img',
                    style: { width: '100%' }
                    }}
                    zoomImage={{
                    src: `${KONEKSI}/${item.gambar4}`,
                    alt: 'Golden Gate Bridge'
                    }}
                />
                </div>
               
            </Slider>
            )
        })
        return image
    }
    customer=()=>{
        if(this.props.level != null && this.props.username != ''){
            return(
                
                                   
                                   
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} >
                    <DropdownToggle caret className="btn btn-light">
                    {this.state.namaCostumer}
                    </DropdownToggle>
                    <DropdownMenu>
                    {this.listUser()}
                    </DropdownMenu>
                </Dropdown>
                                   
                         
            )
        }
    }


    

    lmt=()=>{
        const { limited} = this.props.produk;
        if(limited=="Limited Edition"){
            return<img className="iconlim" src="../images/limited.png" width="180px"/>
        }
    }
    render() {

        console.log(this.state.gold)

        const { selectedOption } = this.state;
        const {  harga, berat, deskripsi, gambar,nama_produk,negara,kategori,limited} = this.props.produk;
     
        if(this.props.level == 'BRONZE'){
            var paket = ((this.state.curency*this.state.bronze)/100)+this.state.curency
        }else if(this.props.level == 'SILVER'){
            var paket = ((this.state.curency*this.state.silver)/100)+this.state.curency
        }else if(this.props.level == 'GOLD'){
            var paket = ((this.state.curency*this.state.gold)/100)+this.state.curency
        }else if(this.props.level == 'PLATINUM'){
            var paket = ((this.state.curency*this.state.platinum)/100)+this.state.curency
        }else if(this.props.role == 'Admin'){
            var paket = ((this.state.curency*this.state.platinum)/100)+this.state.curency
        }
        console.log(paket)
        if(paket!= undefined){
            var price = parseInt(harga*paket)
        }else{
            var price ='?';
        }
        
        
       
        return(
            <div className="product-detail">
                <div className="row mt-5" style={{margin:"10px"}}>
                    <div className="col-md-6" >{this.ReactImageMagnify()}</div>
                   
                    <div className="col-md-6 " >
                        <div className="alert" style={{textAlign:"left"}}>
                            
                           
                           
                           

                            <div style={{fontSize:"14px"}}>
                            <div className="row">
                                <div className="">
                                <h3 className="font-weight-bold">{nama_produk} </h3>
                                </div>
                                <div className="">
                                {this.lmt()} 
                                </div>
                            </div>
                                
                               <div className="col-md-6">
                                   <div className="row text-left">
                                       <div className="col-md-5 border-right">
                                       <h5 className="font-templates font-weight-bold">$ {harga.toLocaleString()},-</h5>
                                        </div>
                                       
                                        <div className="col-md-7">
                                        <h5 className="font-orange font-weight-bold">Rp {price.toLocaleString()},-</h5>
                                        </div>
                                   </div>
                               </div>
                               
                               
                             
                                <div class="dropdown-divider"></div>
                                <div className="row">
                                    <div className="col-md-5">Category:</div>
                                    <div className="col-md-7"><p>{kategori}</p></div>
                                </div>
                                <div className="row">
                                    <div className="col-md-5">Country:</div>
                                    <div className="col-md-7"><p>{negara}</p></div>
                                </div>
                                <div className="row">
                                    <div className="col-md-5">Weight:</div>
                                    <div className="col-md-7"><p>{berat} gr</p></div>
                                </div>
                                
                                <div className="row">
                                    {/* <div className="col-md-5 pt-1">Jumlah:</div> */}
                                    <div className="w-50 mb-3 mt-2 pl-3">
                                        <input type="number" min={1} className="form-control col-md-6 text-center" style={{padding: "0 12px"}} placeholder="Jumlah" ref="tbJumlah" defaultValue="1" />
                                    </div>
                                </div>
                               <div className="row">
                                   <div className="col-5 choose">
                                   <Select
                                        value={selectedOption}
                                        onChange={this.handleChange}
                                        options={this.dataSelect()}
                                    />
                               
                                   </div>
                                   <div className="col-5">
                                        {this.renderButtonBuy()}
                                   </div>
                                   <div className="col-6 mt-3">
                                       <input type="text" ref="tCatatan" placeholder="Contoh: 2 Merah: 23, 20 / Others" className="form-control"/>
                                   </div>
                               </div>
                               <div className="row mt-3">
                                    <div className="">
                                        <div className="card-body  text-justify">
                                        <h4 className="text-left pb-3">Description</h4>
                                            <p>{deskripsi}</p>
                                        </div>                      
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>

                    
                </div>
                {/* END ROW #1 */}

               
               <div className=" w-100 pb-5" style={{backgroundImage: `url(../images/newproduct.png)`,backgroundRepeat:"no-repeat",backgroundSize:"100% 100%",paddingTop:"265px"}} >
               <div className="container">
                  <div className='row'>
                      
                  <div className="col-md-3 mx-auto mt-5">
                  {/* <hr className="font-Head font-weight-bold"/> */}
                    <h3 className="font-Head text-center mb-5 ">Related Products</h3>
                  </div>
                  </div>
                <ProductRecomendation/>
                </div>
                </div>
            </div>
        );
        
    }
}

const mapStateToProps = (state) => {
    return { 
        produk: state.selectedProduk,
        load: state.loadOfCart,
        username: state.auth.username,
        user: state.auth,
        level:state.auth.level
    };
}

export default connect(mapStateToProps, { select_produk, loadOfCart })(ProductDetailKu);