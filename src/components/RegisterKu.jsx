import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import { Alert } from 'reactstrap';
import { onUserRegister } from '../actions';

const cookies = new Cookies();

class RegisterKu extends Component {
    
    componentWillReceiveProps(newProps) {
        if(newProps.username !== '') {
            cookies.set('myPengguna', newProps.username, {path: '/'})
            cookies.set('myKey', newProps.password, {path: '/'})
        }
    }
    onBtnRegisterClick = () => {
        var username = this.refs.username.value;
        var email = this.refs.email.value;
        var phone = this.refs.phone.value;
        var password = this.refs.password.value;
        var verifypassword = this.refs.verifypassword.value;
        if(password != verifypassword){
            alert('Password did not same!')
        }else{
            this.props.onUserRegister({username, email, phone, password});
        }
        
    }

    renderButton = () => {
        if(this.props.loading){
            return <center><div className="loader"></div></center>
        }
        return <button type="button" className="login100-form-btn"  onClick={this.onBtnRegisterClick} style={{width:"300px"}}>
        Register
      </button>
    }
    renderError = () => {
        if(this.props.error.length > 0){
            return <Alert color="danger">{this.props.error}</Alert>
        }
    }
    renderOnKeyPress = (event) => {
        if (event.key === 'Enter'){
            // alert('Enter has been pressed')
            this.onBtnRegisterClick()
        }
    }

    render() {
        if(this.props.username === ""){ 
            return(
                // <div className="container myBody " style={{minHeight:"600px"}}>
                //     <div className="row justify-content-sm-center ml-auto mr-auto mt-3">
                        
                //         <form className="border mb-3" style={{padding:"20px", borderRadius:"5%"}} ref="formLogin">
                //             <fieldset>
                //                 <legend><img src="./images/flat/007-advertising.png" width="60px"/><p>Let's Get Connected!</p></legend>
                                
                //                 <div className="form-group row">
                //                     <label className="col-sm-3 col-form-label">Username</label>
                //                     <div className="col-sm-9">
                //                     <input type="text" ref="username" className="form-control" id="inputUsername" placeholder="Username" required autoFocus/>
                //                     </div>
                //                 </div>

                //                 <div className="form-group row">
                //                     <label className="col-sm-3 col-form-label">Password</label>
                //                     <div className="col-sm-9">
                //                     <input type="password" ref="password" className="form-control" id="inputPassword" placeholder="Password" required />
                //                     </div>
                //                 </div>

                //                 <div className="form-group row">
                //                     <label className="col-sm-3 col-form-label">Email</label>
                //                     <div className="col-sm-9">
                //                     <input type="email" ref="email" className="form-control" id="inputEmail" placeholder="Email@mail.com" required />
                //                     </div>
                //                 </div>

                //                 <div className="form-group row">
                //                     <label className="col-sm-3 col-form-label">Phone</label>
                //                     <div className="col-sm-9">
                //                     <input type="phone" ref="phone" className="form-control" id="inputPhone" placeholder="Ex: 0857xxxxxxxx" onKeyPress={this.renderOnKeyPress} required />
                //                     </div>
                //                 </div>
                                
                //                 <div className="form-group row">
                //                     <div className="col-12">
                //                         {this.renderButton()}
                //                     </div>
                                        
                //                 </div>
                //                 {this.renderError()}
                //                 <div className="btn my-auto"><p>Already have Account? <Link to="/login" className="border-bottom">Login</Link></p></div>
                                
                //             </fieldset>
                //         </form>
                        
                //     </div>                
                // </div>
                <div className="limiter">
            <div className="container-login100 p-b-100">
              <div className="wrap-login100">
                <form className="login100-form validate-form">
                  <span className="font-underline">
                    Register
                  </span>
                  <p className="p-t-50 textinlogin">Tidak Punya akun?</p>
                  <p className=" textinlogin"><span className="txt2">Buat akunmu disini</span>, hanya sebentar</p>
                  <div className="wrap-input100 validate-input m-t-45 m-b-35" data-validate="Enter username">
                    <input className="input100" ref="email" type="email" name="email" placeholder="Email"/>
                    {/* <span className="focus-input100" data-placeholder="Username" /> */}
                  </div>
                  <div className="wrap-input100 validate-input m-t-45 m-b-35" data-validate="Enter username">
                    <input className="input100" ref="username" type="text" name="username" placeholder="Username"/>
                    {/* <span className="focus-input100" data-placeholder="Username" /> */}
                  </div>
                  <div className="wrap-input100 validate-input m-t-45 m-b-35" data-validate="Enter username">
                    <input className="input100" ref="phone" type="number" name="phone" placeholder="Phone"/>
                    {/* <span className="focus-input100" data-placeholder="Username" /> */}
                  </div>
                  <div className="wrap-input100 validate-input m-b-50" data-validate="Enter password">
                    <input className="input100" type="password" ref="password" name="pass" placeholder="Password" />
                    {/* <span className="focus-input100" data-placeholder="Password" /> */}
                  </div>
                  <div className="wrap-input100 validate-input m-b-50" data-validate="Enter password">
                    <input className="input100" type="password" ref="verifypassword" name="verifypassword" placeholder="Verify Password" />
                    {/* <span className="focus-input100" data-placeholder="Password" /> */}
                  </div>
                  <div className="container-login100-form-btn">
                  {this.renderError()}
                  {this.renderButton()}
                  </div>
                  <ul className="login-more p-t-50">
                   
                    <li>
                      <span className="txt1">
                       sudah memiliki akun?
                      </span>
                      <a href="/login" className="txt2">
                        Masuk
                      </a>
                    </li>
                  </ul>
                </form>
              </div>
            </div>
          </div>
            );
        }
        return <Redirect to="/registeragentdata" />
        
    }
}

const mapStateToProps = (state) => {
    return { 
        username: state.auth.username, 
        error: state.auth.error, 
        loading: state.auth.loading ,
        password: state.auth.password
    };
}

export default connect(mapStateToProps, {onUserRegister})(RegisterKu);