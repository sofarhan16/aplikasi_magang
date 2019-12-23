import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Alert } from 'reactstrap';
import { onUserLogin } from '../actions';
import '../support/css-login/vendor/animate/animate.css';
import '../support/css-login/css/main.css';
import '../support/css-login/css/util.css';
import axios from 'axios';
import { KONEKSI } from '../support/config/index';
import queryString from 'query-string';
const cookies = new Cookies();

class ResetPass extends Component {
    
   
    renderOnKeyPress = (event) => {
        if (event.key === 'Enter'){
            // alert('Enter has been pressed')
            this.onBtnLoginClick()
        }
    }
    onReset=()=>{
        var password = this.refs.password.value;
        var repassword = this.refs.repassword.value;
        var params = queryString.parse(this.props.location.search);
        var id = params.id;
        if(password == repassword){
            axios.post(`${KONEKSI}/auth/changepassword`,{
                id,password
            }
            ).then((res) => {
                alert("Your new password has been changed")
                window.location="/login"
            }).catch((err) => {
                console.log(err);
            })
        }else{
            alert("your password input did not same!")
            window.location.reload()
        }
    }
    
    render(){
        if(this.props.username === ""){ 
            return(
            <div className="limiter">
            <div className="container-login100">
              <div className="wrap-login100">
                
                  <p className="p-t-50 textinlogin">Reset your password</p>
                  <div className="wrap-input100 validate-input m-t-45 m-b-35" data-validate="Enter username">
                    <input className="input100" ref="password" type="password" name="password" placeholder="password"/>
                    {/* <span className="focus-input100" data-placeholder="Username" /> */}
                  </div>
                  <div className="wrap-input100 validate-input m-b-50" data-validate="Enter password">
                    <input className="input100" type="password" ref="repassword" name="repassword" placeholder="repassword"  onKeyPress={this.renderOnKeyPress}/>
                    {/* <span className="focus-input100" data-placeholder="Password" /> */}
                  </div>
                  <div className="container-login100-form-btn">
                    <button className="btn btn-default orange" onClick={()=>this.onReset()}>Reset</button>
                  </div>
              </div>
            </div>
          </div>
            );
        }
        return <Redirect to="/" />
    }
}
const mapStateToProps = (state) => {
    return { 
        username: state.auth.username, 
        error: state.auth.error, 
        loading: state.auth.loading ,
        password: state.auth.password,
    };
}

export default connect(mapStateToProps, {onUserLogin})(ResetPass);