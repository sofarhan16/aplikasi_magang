import React, { Component } from 'react';
import '../../support/css-tambahan/pricing.css';
import { KONEKSI } from '../../support/config';
import axios from 'axios';
import { connect } from 'react-redux';
class Pricing extends Component{
  state={
    pricing:[],
    store:[],
    payment: []
  }
  componentDidMount(){
    this.getPricing()
    console.log(this.props.user.id_agent)
    if(this.props.user.id_agent!=null){
      this.getAgentStore(this.props.user.id_agent)
      this.CheckPayment(this.props.user.id_agent)
    }
  }
  getPricing=()=>{
    axios.get(`${KONEKSI}/product/getpricing`
    ).then((res) => {
        this.setState({pricing: res.data});
    }).catch((err) => {
        console.log(err);
    })
  }
  getAgentStore=(id)=>{
    if(id != null){
      axios.get(`${KONEKSI}/auth/getagentstoredata/${id}`
      ).then((res) => {
          this.setState({store: res.data});
          console.log(res.data)
      }).catch((err) => {
          console.log(err);
      })
    }else{
      id=0;
      axios.get(`${KONEKSI}/auth/getagentstoredata/${id}`
      ).then((res) => {
          this.setState({store: res.data});
          console.log(res.data)
      }).catch((err) => {
          console.log(err);
      })
    }
}

CheckPayment = (id) => {

  axios.get(`${KONEKSI}/auth/getPayment/${id}`
  ).then((res) => {
      this.setState({payment: res.data});
      console.log(res.data)
  }).catch((err) => {
      console.log(err);
  })

}

  putDataPricing=()=>{
    
    if(this.state.payment.length > 0 && this.props.user.username != ''){
      const pricing = this.state.pricing.map(item=>{
        if(item.nama=="SILVER" || item.nama=="BRONZEd"){
          var time = 'Bulan'
        }else{
          var time = 'Tahun'
        }
        return(
          <div className="col-lg-4 mb-2">
                <div className="card mb-5 mb-lg-0">
                  <div className="card-body">
                    <h5 className="card-title text-muted text-uppercase text-center">{item.nama} + Buyer</h5>
                    <h6 className="card-price text-center">{item.price} <span className="period">/{time}</span></h6>
                    <hr />
                    <ul className="fa-ul">
                      <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail1}</li>
                      <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail2}</li>
                      <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail5}</li>
                      <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail3}</li>
                      <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail4}</li>
                    </ul>
                    <button className="btn btn-block btn-danger text-uppercase" disabled>Subscribe</button>
                  </div>
                </div>
              </div>
        );
      })
      return pricing;
    }else if(this.state.store.length > 0 && this.props.user.username != ''){
      const pricing = this.state.pricing.map(item=>{
        if(item.nama=="SILVER" || item.nama=="BRONZEd"){
          var time = 'Bulan'
        }else{
          var time = 'Tahun'
        }
        return(
          <div className="col-lg-4 mb-2">
                <div className="card mb-5 mb-lg-0">
                  <div className="card-body">
                    <h5 className="card-title text-muted text-uppercase text-center">{item.nama} + Buyer</h5>
                    <h6 className="card-price text-center">{item.price} <span className="period">/{time}</span></h6>
                    <hr />
                    <ul className="fa-ul">
                      <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail1}</li>
                      <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail2}</li>
                      <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail5}</li>
                      <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail3}</li>
                      <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail4}</li>
                    </ul>
                    <a href={`/cartorderagent?pricing=${item.id}`} className="btn btn-block btn-primary text-uppercase">Subscribe</a>
                  </div>
                </div>
              </div>
        );
      })
      return pricing;
    }else if(this.state.store.length==0 && this.props.user.username != ''){
      const pricing = this.state.pricing.map(item=>{
        if(item.nama=="SILVER" || item.nama=="BRONZEd"){
          var time = 'Bulan'
        }else{
          var time = 'Tahun'
        }
        return(
          <div className="col-lg-4 mb-2">
                <div className="card mb-5 mb-lg-0">
                  <div className="card-body">
                    <h5 className="card-title text-muted text-uppercase text-center">{item.nama} + Buyer</h5>
                    <h6 className="card-price text-center">{item.price} <span className="period">/{time}</span></h6>
                    <hr />
                    <ul className="fa-ul">
                      <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail1}</li>
                      <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail2}</li>
                      <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail5}</li>
                      <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail3}</li>
                      <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail4}</li>
                    </ul>
                    <a href={`/registeragentdata`} onClick={()=>alert('Fill your store data first')} className="btn btn-block btn-primary text-uppercase">Subscribe</a>
                  </div>
                </div>
              </div>
        );
      })
      return pricing;
    }else{
      const pricing = this.state.pricing.map(item=>{
        if(item.nama=="SILVER" || item.nama=="BRONZEd"){
          var time = 'Bulan'
        }else{
          var time = 'Tahun'
        }
        return(
          <div className="col-lg-4 mb-2">
                <div className="card mb-5 mb-lg-0">
                  <div className="card-body h-100">
                    <h5 className="card-title text-muted text-uppercase text-center">{item.nama} + Buyer</h5>
                    <h6 className="card-price text-center">{item.price} <span className="period">/{time}</span></h6>
                    <hr />
                    <ul className="fa-ul h-100 pb-5">
                      <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail1}</li>
                      <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail2}</li>
                      <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail3}</li>
                      <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail4}</li>
                      <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail5}</li>
                    </ul>
                    <a href={`/register`} onClick={()=>alert('Daftar sebagai agent terlebih dahulu')} className="mt-3 btn btn-block btn-primary text-uppercase">Subscribe</a>
                  </div>
                </div>
              </div>
        );
      })
      return pricing;
    }
  }
    render(){
        return(
            <div>
    <section className="pricing py-5" style={{backgroundImage: `url(./images/pricing.png)`,backgroundRepeat:"no-repeat",backgroundSize:"100% 100%"}}>
        <div className="container pricing-top">
          <div className="row justify-content-center">
            {this.putDataPricing()}    
          </div>
        </div>
      </section>
        </div>
        );
    }
}
const mapStateToProps = (state) => {
  return { 
      user: state.auth
  };
}
export default connect(mapStateToProps)(Pricing);