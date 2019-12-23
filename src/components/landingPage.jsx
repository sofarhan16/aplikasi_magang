import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import CarouselKu from './CarouselKu';
import ProductListKu from './ProductListKu';
import { Card, CardImg, CardText, CardTitle, CardImgOverlay  } from 'reactstrap';
import Negara from './fitur/negara';
import Pricing from './fitur/pricing';
import Footer from './fitur/footer';
import BestOffers from './BestOffers';
import NewArival from './NewArival';
import BestProduct from './bestProduct';
class LandingPage extends Component{
    state = {search: ""}
    searchSomething = () => {
        var keywords = this.refs.searchBook.value;
        console.log(keywords);
        this.setState({search: keywords})
    }

    renderOnKeyPress = (event) => {
        if (event.key === 'Enter'){
            // alert('Enter has been pressed')
            this.searchSomething()
        }
    }
    pricingfucntion =()=>{
        if(this.props.user.level == null && this.props.user.role == 'User'){
            return<Pricing/>
        }else if(this.props.user.username == ''){
            return<Pricing/>
        }
    }
    componentDidMount(){
        if(this.props.user.username !== ""){
            // window.location.reload()
            if(this.props.user.id_agent == undefined){
                window.location.reload()
            }
          }
    }
    render(){
        const { username, status,level } = this.props.user;
        console.log(this.props.user)
        // if( username !== "" && status === "Unverified" || level == null){
        //     return <Redirect to="/verify" />
        // }
        if (this.state.search !== "") {
            //var keywords = this.refs.searchBook.value;
            return <Redirect to={`/searchbook?keywords=${this.state.search}`} />
        }
        return(
            <div>
                <div className="w-100 bg-white"  style={{backgroundImage: `url(./images/lp2.png)`,backgroundRepeat:"no-repeat",backgroundSize:"100% 100%",height:"700px"}}>
                    <div className="container" style={{paddingTop:"100px"}}>
                    <h1 className="text-center text-white">Kemudahan Berbisnis Jastip Online <br/>
                        Kebutuhan Anda</h1>
                        <p className="text-white">Warehousenesia.id mendukung puluhan ribu bisnis kecil, menengah dan besar <br/>untuk menjalankan usaha jastip 
                        mulai usaha jastip yang dapat menjangkau berbagai negara<br/> hanya dengan platform warehousenesia.id

                        </p>
                        <div className="text-center">
                            <a href="/home" className="btn btn-default orange col-2 mt-4">Jelajahi</a>
                        </div>
                        <div style={{backgroundImage: `url(./images/lp1.png)`,backgroundRepeat:"no-repeat",backgroundSize:"100% 100%",height:"750px",marginTop:"-40px"}}/>
                    </div>
                </div>
                <div className="sectiondua">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-center">
                       <h2 className="font-weight-bold font-templates">Saatnya Memulai Bisnis Jastip Anda <br/>
Ke Arah Yang Lebih Baik !</h2>
                        <p className="my-4 font-weight-bold font-templates">
                        Warehousenesia.id adalah solusi mudah untuk memulai bisnis jastip. <br/> Platform kami memudahkan kamu 
untuk melakukan bisnis jastip mendapatkan<br/> barang-barang dari market overseas Menyediakan landing page atau tampilan website<br/> untuk membantu melakukan order serta shipping hingga ke tujuan secara otomatis dan dilengkapi dengan sistem manajemen <br/>order yang membuat semua kebutuhan menjalankan bisnis jastip Anda menjadi otomatis.
                        </p>
                        </div>
                    </div>
                </div>
                </div>
                <div className="container pt-5">
        <div className="row p-5">
          <div className="col-lg-4 text-center mb-3">
            <img className src="./images/Fitur-1.png" alt="Generic placeholder image" width={140} height={140} />
            <p><b>Bisnis dilakukan <br /> dari rumah</b></p>
          </div>
          <div className="col-lg-4 text-center mb-3" >
            <img className src="./images/Fitur-2.png" alt="Generic placeholder image" width={140} height={140} />
            <p><b>Tidak ada batas <br /> jumlah barang</b></p>
          </div>
          <div className="col-lg-4 text-center mb-3">
            <img className src="./images/fitur-3.png" alt="Generic placeholder image" width={140} height={140} />
            <p><b>Pengiriman cepat</b></p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 text-center mb-3">
            <img className src="./images/Fitur-4.png" alt="Generic placeholder image" width={140} height={140} />
            <p><b>Dilindungi <br />asuransi</b></p>
          </div>
          <div className="col-lg-4 text-center mb-3">
            <img className src="./images/Fitur-5.png" alt="Generic placeholder image" width={140} height={140} />
            <p><b>System yang <br /> friendly</b></p>
          </div>
          <div className="col-lg-4 text-center mb-3">
            <img className src="./images/Fitur-6.png" alt="Generic placeholder image" width={140} height={140} />
            <p><b>Jangkauan luas <br /> di berbagai negara </b></p>
          </div>
        </div>
      </div>
      <div className="container">
                        <div className="col-md-12 text-center my-5">
                       <h2 className="font-weight-bold font-templates pb-5">Apa kata mereka<br/> Tentang Warehousenesia</h2>
                        
                        </div>
                        <div className="row">
                            <div className="col-lg-4">
                            <img className="rounded-circle border border-danger p-1" src="./images/Review_1.jpeg" alt width={160} height={160} />
                            <p className="mt-3 p-3">Dari dulu pengen buka usaha jastip tapi ga tau harus mulainya gmn. Akhirnya ktmu Werehousenesia dpt deh solusinya. Menghasilkan uang tanpa harus cape kerja kantoran yess udh aku rasain skrg. Alhamdulillah kerja drmh bs mendpt penghasilan yg lumayan bgtt. Sistemnya gampang banget, dipermudahkan bgt, ga perlu harus kita yg capek2 nyari barang ke toko2. <br /> Diem drmh jg bs lwt hp udh bs dpt penghasilan donggg... canggih . <br /><br /><br /> </p><div><b className="font-weight-bold">- Ayu</b></div>
                            </div>
                            <div className="col-lg-4">
                            <img className="rounded-circle border border-danger p-1" src="./images/Zaidan_Karim.jpg" alt width={160} height={160} />
                            <p className="mt-3 p-3">Terima Kasih Warehousenesia.id, Happy Bisa Menjadi bagian dari  mitra bisnis. Sekarang bisa import & Export Barang Ke negara mana pun dengan mudah dan rate yang bersahabat. <br /><br /><br /> </p> <div className="zaidan"><b >- Zaidan Karim</b></div>
                            </div>
                            <div className="col-lg-4">
                            <img className="rounded-circle border border-danger p-1" src="./images/Faratissa_maaruf.jpg" alt width={160} height={160} />
                            <p className="mt-3 p-3">Ibu rumah tangga jadi punya penghasilan lebih dr kantoran <br /><br /><br /> </p> <div className="faratisa"><b>- Faratisa maaruf</b></div>
                            </div>
        
      </div>
                    </div>
                <div className="w-100 newArivval" style={{backgroundImage: `url(./images/newproduct.png)`,backgroundRepeat:"no-repeat",backgroundSize:"100% 100%",paddingTop:"265px",paddingBottom:"150px"}}>
                    <div className="container">
                    <center><h3 className="font-Head text-center mb-4 mt-5">Ingin Tahu Lebih Lanjut <br/>
tentang Warehousenesia?</h3></center>        
                        <p className="text-center text-white my-4">
                        Yuk, Menjadi Member Warehousenesia dan jadi yang pertama tahu tentang 
fitur terbaru dan kabar lainnya dari Warehousenesia!
                        </p>
                        <a href="/register" className="btn btn-default orange mt-5 col-2">Daftar</a>
                    </div>
                </div>
           <div className="" >
         
               </div>
           <div className="">
           <Footer/>
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

export default connect(mapStateToProps)(LandingPage);