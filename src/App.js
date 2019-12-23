import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import axios from 'axios';
import  Idle  from 'react-idle'
import { KONEKSI } from './support/config';

import { keepLogin, cookieChecked, onUserLogin, loadOfCart } from './actions';
import './App.css';
import HeaderKu from './components/HeaderKu';
import HomeKu from './components/HomeKu';
import LoginKu from './components/LoginKu';
import RegisterKu from './components/RegisterKu';
import VerifiyWaitingKu from './components/VerifyWaitingKu';
import VerifiedKu from './components/VerifiedKu';
import ProductDetailKu from './components/ProductDetailKu';
import KeranjangKu from './components/KeranjangKu';
import ConfirmPaymentKu from './components/ConfirmPaymentKu';
import HomeAdmin from './components/admin/HomeAdmin';
import InputProductAdmin from './components/admin/InputProductAdmin';
import VerifyOrderAdmin from './components/admin/VerifyOrderAdmin';
import HistoryBelanjaKu from './components/HistoryBelanjaKu';
import CariBukuKu from './components/CariBukuKu';
import CartAgent from './components/agent/CartAgent';
import InputConsument from './components/agent/InputConsument';
import ManageAgent from './components/admin/ManageAgent';
import HomeAgent from './components/agent/HomeAgent';
import OrderAgent from './components/agent/OrderAgent';
import ConfirmOrderAgent from './components/agent/ConfirmOrderAgent';
import ProdukNegara from './components/ProdukNegara';
import ReportsAdmin from './components/admin/ReportsAdmin';
import CategoryAdmin from './components/admin/CategoryAdmin';
import CountryAdmins from './components/admin/CountryAdmins';
import Agentsubscribe from './components/Agentsubscribe';
import KonfirmasiPembayaran from './components/KonfirmasiPembayaran';
import registerAgentData from './components/registerAgentData';
import pricing from './components/admin/pricing';
import CartCustomer from './components/agent/CartCustomer';
import historyAdmin from './components/admin/historyAdmin';
import DetailOrderMonth from './components/admin/detaliorderthismonth';
import orderdetail from './components/agent/orderdetail';
import underConstruction from './components/underConstruction';
import ordercustomer from './components/agent/ordercustomer';
import addphotos from './components/admin/addphotos';
import ReactLoading from 'react-loading';
import searchProduk from './components/searchProduk';
import NegaraAll from './components/fitur/negaraAll';
import forgetuser from './components/forgetuser';
import reset from './components/reset';
import editProduk from './components/admin/editProduk';
import addCarousell from './components/admin/addCarousell';
import invoiceCustomer from './components/agent/invoiceCustomer';
import landingPage from './components/landingPage';
import homeShopper from './components/shopper/HomeShopper';
import AdminSuperD from './components/admin/superData';
import ShopperSuperD from './components/shopper/superDataShopper';
import shippingLabel from './components/shopper/shippinglabel';
import detailShipping from './components/shopper/detailShipping';
import reportSuperdata from './components/admin/ReportSuperdata';
import EditProfile from './components/agent/Editprofile';
import AutoConvert from './components/AutoConvert';
import trackingJanio from './components/admin/trackingJanio';
import listcustomer from './components/shopper/listCustomer';
import listEnduser from './components/shopper/listEnduser';
import listPurchaseUser from './components/shopper/listPurchaseUser'
import shippingPJT from './components/shopper/shippingPJT'


const cookies = new Cookies();

class App extends Component {

  constructor(props){
    super(props)
    
    this.state ={
      janio: [],
      batch: []
    }
  }
  
  componentDidMount() {
    this.AutoJanio()
      const username = cookies.get('myPengguna');
      //console.log(username);
      if(username !== undefined){
          this.props.keepLogin(username);
          this.props.loadOfCart({username});
      } else {
        this.props.cookieChecked();
      }
  }

  logout = () => {
    cookies.remove('myPengguna', { path: '/' }) 
    window.location.reload()  
  }
  
  autologout = () => {
    
    // if(cookies.get('myPengguna') !== undefined){
    //   return (
    //     <Idle
    //       timeout={600000}
    //       onChange={({ idle }) => console.log({ idle })}
    //       render={({ idle }) =>
    //         <h1>
    //           {idle
    //             ? this.logout()
    //             : ""
    //           }
    //         </h1>
    //       }
    //     />
    //   )
    // }

  }

  AutoJanio = () => {

    axios.get(`${KONEKSI}/transaction/getAllUploadBatch`)
    .then((res) => {
      
      var panjang = res.data.length
      
      for(let i = 0; i < panjang; i++){

          let batch = res.data[i].batchNo
          axios.get(`https://janio-api-int.herokuapp.com/api/order/order/?secret_key=XfApV4khF1goVdRgUiKhQZB06wqu7xSh&upload_batch_no=${batch}`)
          .then((res) => {
            let data = res.data.results
            let status = data[0].tracker_status_code

            axios.post(`${KONEKSI}/transaction/getTrans`, {batch: batch, status: status})
            .then((res) => {
              console.log("SUCCESS")
            }).catch((err) => {
              console.log(err)
            })

          }).catch((err) => {
            console.log(err)
          })
          
      }


    }).catch((err) => {
      console.log(err)
    })
    
    // axios.get(`https://janio-api-int.herokuapp.com/api/order/order/?secret_key=XfApV4khF1goVdRgUiKhQZB06wqu7xSh&with_items=true`)
    // .then((res) => {
    //   this.setState({janio: res.data})
      
    //   var obj = res.data.results;
    //   for(var i = 0; i < obj.length; i++){

    //       var data = obj[Object.keys(obj)[i]]

    //       axios.post(`${KONEKSI}/transaction/getTrans`, {batch: data.upload_batch_no, status: data.tracker_status_code})
    //       .then((res2) => {
    //         // this.setState({batch: this.state.batch.concat(res2.data)})
    //       }).catch((err) => {
    //         console.log(err)
    //       })

    //   }
      

    // })

  }


 underConstraction =()=>{
   var comingsoon = 'no';
   if(comingsoon == 'yes'){
     if(this.props.user.role != 'Admin' && this.props.user.role !='User'){
       
      return<Route exact path="/" component={underConstruction} />
     }else{
      
      return  <div>
      <HeaderKu />
      <Route exact path="/" component={landingPage} />
    </div>
     }
    
   }else{
     
    return(<div>
       <HeaderKu />
    <Route exact path="/" component={landingPage} />
    </div>)
   }
 }
  render() {
    if(this.props.cookie){ 
      return (
        <div className="App">
          {this.autologout()}
          
         
          {/* <Route exact path="/" component={HomeKu} /> */}
          {this.underConstraction()}
          <Route path="/login" component={LoginKu} />
          <Route path="/register" component={RegisterKu} />
          <Route path="/forget" component={forgetuser}/>
          <Route path="/reset" component={reset}/>
          <div className=" myBody  bg-white" >
          {/* style={{borderRadius: "5px"}} */}
          
          <Route path="/home" component={HomeKu} />
            <Route path="/product" component={searchProduk} />
            <Route path="/allcountry" component={NegaraAll}/>
           
            <Route path="/registeragentdata" component={registerAgentData} />
            <Route path="/verify" component={VerifiyWaitingKu} />
            <Route path="/verified" component={VerifiedKu} />
            <Route path="/productdetail/:id" component={ProductDetailKu} />
            <Route path="/cart" component={KeranjangKu} />
            <Route path="/confirmpayment" component={ConfirmPaymentKu} />
            <Route path="/historytrx" component={HistoryBelanjaKu} />
            <Route path="/searchbook" component={CariBukuKu} />
            <Route path="/admin/home" component={HomeAdmin} />
            <Route path="/admin/inputproduct" component={InputProductAdmin} />
            <Route path="/admin/editproduct" component={editProduk} />
            <Route path="/admin/verifyorder" component={VerifyOrderAdmin} />
            <Route path="/admin/manageagent" component={ManageAgent} />
            <Route path="/admin/report" component={ReportsAdmin} />
            <Route path="/admin/history" component={historyAdmin} />
            <Route path="/admin/pricing" component={pricing} />
            <Route path="/admin/category" component={CategoryAdmin} />
            <Route path="/admin/country" component={CountryAdmins} />
            <Route path="/admin/carousell" component={addCarousell} />
            <Route path="/admin/reportmonth" component={DetailOrderMonth} />
            <Route path="/admin/addphotos" component={addphotos} />
            <Route path="/agent/home" component={HomeAgent} />
            <Route path="/agent/cart" component={CartAgent} />
            <Route path="/agent/cartcustomer" component={CartCustomer} />
            <Route path="/agent/ordercustomer" component={ordercustomer} />
            <Route path="/agent/inputConsument" component={InputConsument} />
            <Route path="/agent/order" component={OrderAgent} />
            <Route path="/agent/orderdetail" component={orderdetail} />
            <Route path="/agent/confirmpayment" component={ConfirmOrderAgent} />
            <Route path="/invoicecustomer" component={invoiceCustomer} />
            <Route path="/negara" component={ProdukNegara} />
            <Route path="/cartorderagent" component={Agentsubscribe} />
            <Route path="/konfirmasipembayaran" component={KonfirmasiPembayaran} />
            <Route path="/shopper/home" component={homeShopper} />
            <Route path="/shopper/superdata" component={ShopperSuperD} />
            <Route path="/shopper/ShippingLabel" component={shippingLabel} />
            <Route path="/shopper/detailShipping" component={detailShipping} />
            <Route path="/admin/superdata" component={AdminSuperD} />
            <Route path="/admin/reportsuperdata" component={reportSuperdata} />
            <Route path="/editprofile" component={EditProfile} />
            <Route path="/admin/trackingJanio" component={trackingJanio} />
            <Route path="/shopper/listcustomer" component={listcustomer} />
            <Route path="/shopper/listenduser" component={listEnduser} />
            <Route path="/shopper/listPurchaseUser" component={listPurchaseUser} />
            <Route path="/shopper/shipping/" component={shippingPJT} />
            {/* <Route path="" component={} /> */}
          </div>

        </div>
      );
    }
    return (  
      <div className="App">
        <HeaderKu />
        <div className="row loading" style={{borderRadius: "5px"}}>
            <ReactLoading type='cylon' color="#065286" height={100} width={190} />
        </div>
      </div>
    );
  }
}



const mapStateToProps = (state) => {
  
  return {  cookie: state.auth.cookie,
            user: state.auth,
            cart: state.loadOfCart }
}
export default withRouter(connect(mapStateToProps, {keepLogin, cookieChecked, onUserLogin, loadOfCart})(App));
