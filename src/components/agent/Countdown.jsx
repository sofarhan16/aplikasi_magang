import React, { Component } from 'react';
import PropTypes from 'prop-types'
import axios from 'axios';
import { connect } from 'react-redux';
import { KONEKSI } from '../../support/config';
class Countdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      days: 0,
      hours: 0,
      min: 0,
      sec: 0,
      form:0,
      bronze:0,
      silver:0,
      gold:0,
      platinum:0,
      curency:0,
      news:''
    }
  }

  componentDidMount() {
    this.getCurency()
    this.getnews()
    // update every second
    this.interval = setInterval(() => {
      const date = this.calculateCountdown(this.props.date);
      date ? this.setState(date) : this.stop();
    }, 1000);
  }
  getnews=()=>{
    axios.get(`${KONEKSI}/customer/getnews`
    ).then((res) => {
        this.setState({news: res.data[0].news});        
    }).catch((err) => {
        console.log(err);
    })
}

  componentWillUnmount() {
    this.stop();
  }

  calculateCountdown(endDate) {
    let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date())) / 1000;

    // clear countdown when date is reached
    if (diff <= 0) return false;

    const timeLeft = {
      years: 0,
      days: 0,
      hours: 0,
      min: 0,
      sec: 0,
      millisec: 0,
    };

    // calculate time difference between now and expected date
    if (diff >= (365.25 * 86400)) { // 365.25 * 24 * 60 * 60
      timeLeft.years = Math.floor(diff / (365.25 * 86400));
      diff -= timeLeft.years * 365.25 * 86400;
    }
    if (diff >= 86400) { // 24 * 60 * 60
      timeLeft.days = Math.floor(diff / 86400);
      diff -= timeLeft.days * 86400;
    }
    if (diff >= 3600) { // 60 * 60
      timeLeft.hours = Math.floor(diff / 3600);
      diff -= timeLeft.hours * 3600;
    }
    if (diff >= 60) {
      timeLeft.min = Math.floor(diff / 60);
      diff -= timeLeft.min * 60;
    }
    timeLeft.sec = diff;

    return timeLeft;
  }

  stop() {
    clearInterval(this.interval);
  }

  addLeadingZeros(value) {
    value = String(value);
    while (value.length < 2) {
      value = '0' + value;
    }
    return value;
  }
  getEmail =()=>{
    var email = this.refs.email.value;
    var name = this.refs.name.value;
    if(name === '' || email === ''){
        alert('Form harus diisi dengan benar')
    } else {
        axios.post(`http://213.190.4.59:1997/auth/registeremailpromo`, { 
            email,name 
        }).then((res) => {
            console.log(res); 
            this.setState({form:1})           
        }).catch((err)=> {
            console.log(err);
        })
        
    }
  }
  member=()=>{
    const countDown = this.state;
      if(this.props.user.level == "SILVER"){
          return(
              <div>
               <span>{this.addLeadingZeros(countDown.days)} {countDown.days === 1 ? 'Day' : 'Days'}</span>
              </div>
          )
      }
      return(
        <div>
             <span>{countDown.years === 1 ? this.addLeadingZeros(countDown.years)  : '0'} Year </span>
               <span>{this.addLeadingZeros(countDown.days)} {countDown.days === 1 ? 'Day' : 'Days'}</span>
        </div>
    )
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

  render() {
 
    var limit = this.props.user.limit;
    var harga = limit
    if(limit==null){
        limit = "Unlimited"
        var harga = limit;
    }
    if(this.props.user.level == 'BRONZE'){
      var paket = ((this.state.curency*this.state.bronze)/100)+this.state.curency
    }else if(this.props.user.level == 'SILVER'){
      var paket = ((this.state.curency*this.state.silver)/100)+this.state.curency
    }else if(this.props.user.level == 'GOLD'){
        var paket = ((this.state.curency*this.state.gold)/100)+this.state.curency
    }else if(this.props.user.level == 'PLATINUM'){
        var paket = ((this.state.curency*this.state.platinum)/100)+this.state.curency
    }else if(this.props.user.role == 'Admin'){
        var paket = ((this.state.curency*this.state.platinum)/100)+this.state.curency
    }
    return (
      <div className="">
      {/* Coutdown */}
      <div className="row">
           <div className="col-md-4">
               <div className="merah h-100 card text-left pl-2 pt-1 blue text-white font-weight-bold">
              membership: {this.props.user.level}
              <div>  Limit:  <span>Rp {harga.toLocaleString()}</span></div>
            {this.member()}
               Remaining subscription period
               </div>
           </div>
           <div className="col-md-4 ">
               <div className="biru h-100 card text-left pl-2 pt-1 blue text-white font-weight-bold">
                Currency:
                <div className="pt-5 text-right pr-3 pb-2">
                $1 = Rp {paket.toLocaleString()}
                </div>
               </div>
           </div>
           <div className="col-md-4 ">
               <div className="card text-left pl-2 pt-1 pb-5 blue text-white font-weight-bold">
                News
                <p className="text-white">{this.state.news}</p>
               
               </div>
           </div>
     </div>      
    </div>
    );
  }
}
Countdown.propTypes = {
  date: PropTypes.string.isRequired
};

Countdown.defaultProps = {
  date: new Date()
};

const mapStateToProps = (state) => {
    return { 
        user: state.auth
    };
}

export default connect(mapStateToProps)(Countdown);