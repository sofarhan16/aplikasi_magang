import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Alert } from 'reactstrap';
import { onUserLogin } from '../actions';
import '../support/css-login/vendor/animate/animate.css';
import '../support/css-login/css/main.css';
import '../support/css-login/css/util.css';
import Recaptcha from 'react-recaptcha';


const cookies = new Cookies();

class LoginKu extends Component {
    
    constructor(props){
      super(props)

      this.recapthaLoad = this.recapthaLoad.bind(this)
      this.verifyCallback = this.verifyCallback.bind(this)
      this.renderButton = this.renderButton.bind(this)

      this.state = {
          isVerified: false
      }

    }

    componentWillReceiveProps(newProps) {
        if(newProps.username !== '') {
            console.log(newProps)
            cookies.set('myPengguna', newProps.username, {path: '/'})
            //localStorage.setItem("username", this.props.user.username )
        }
    }

    onBtnLoginClick = () => {
        var username = this.refs.username.value;
        var password = this.refs.password.value;
        this.props.onUserLogin({username, password});
       
    }

    renderError = () => {
        if(this.props.error.length > 0){
            return <Alert color="danger">{this.props.error}</Alert>
        }
    }

    renderButton = () => {

      if(this.state.isVerified){
        
        if(this.props.loading){
          return <center><div className="loader"></div></center>
        }
        return <button type="button" className="login100-form-btn mt-5" onClick={this.onBtnLoginClick} style={{width:"300px"}}>
        Masuk
      </button>

      }else{
        
      }

    }

    renderOnKeyPress = (event) => {
        // if(this.state.isVerified){
            if (event.key === 'Enter'){
              // alert('Enter has been pressed')
              this.onBtnLoginClick()
          }
        // }
    }

    verifyCallback(resp) {

      if(resp){
        this.setState({
          isVerified: true
        })
      }else{
        alert("toolol")
      }

    }

    recapthaLoad(){
      console.log("Success Load the Captcha")
    }


    render(){
        if(this.props.username === ""){ 
            return(
            <div className="limiter">
            <div className="container-login100">
              <div className="wrap-login100">
                <form className="login100-form validate-form">
                  <span className="font-underline">
                    Login
                  </span>
                
                  <p className="p-t-50 textinlogin">Selamat Datang kembali! Masuk untuk mengakses warehousenesia.id</p>
                  <div className="wrap-input100 validate-input m-t-45 m-b-35" data-validate="Enter username">
                    <input className="input100" ref="username" type="text" name="username" placeholder="username"/>
                    {/* <span className="focus-input100" data-placeholder="Username" /> */}
                  </div>
                  <div className="wrap-input100 validate-input m-b-50" data-validate="Enter password">
                    <input className="input100" type="password" ref="password" name="pass" placeholder="password"  onKeyPress={this.renderOnKeyPress}/>
                    {/* <span className="focus-input100" data-placeholder="Password" /> */}
                  </div>
                  <div className="container-login100-form-btn">
                  {this.renderError()}
                  <Recaptcha
                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                    render="explicit"
                    onloadCallback={this.recapthaLoad}
                    verifyCallback={this.verifyCallback}
                  />
                  {this.renderButton()}
                  </div>
                  <ul className="login-more p-t-50">
                    <li className="m-b-8">
                      <span className="txt1">
                      Lupa 
                      </span>
                      <a href="/forget" className="txt2">
                         Username / Password?
                      </a>
                    </li>
                    <li>
                      <span className="txt1">
                      Tidak Punya akun?
                      </span>
                      <a href="/register" className="txt2">
                        Daftar
                      </a>
                    </li>
                  </ul>
                </form>
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

export default connect(mapStateToProps, {onUserLogin})(LoginKu);