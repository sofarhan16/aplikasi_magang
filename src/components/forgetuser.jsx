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

const cookies = new Cookies();

class Forgetuser extends Component {
    state={
        user:[],
        reset:''
    }
    componentDidMount(){
        // this.getUser()
    }
    getUser=()=>{
        var email = this.refs.email.value;
        axios.post(`${KONEKSI}/auth/forgetuser`,{
            email
        }
        ).then((res) => {
            this.setState({ user: res.data});
            console.log(res.data)
        }).catch((err) => {
            console.log(err);
        })
    }
    renderOnKeyPress = (event) => {
        if (event.key === 'Enter'){
              this.getUser()
        }
    }
    sendEmailReset=(item)=>{
        var{id,email,username}= item
        axios.post(`${KONEKSI}/auth/resetpassword`,{
            id,email,username
        }
        ).then((res) => {
            this.setState({reset:`A password reset link has been sent to your email ${email}`})
        }).catch((err) => {
            console.log(err);
        })
        
    }
    putUsernameAndButton=()=>{
        var show = this.state.user.map(item=>{
            return(
                <div className="text-center card mt-5">
                    <p>Your username is</p>
                    <h6 className='font-weight-bold text-danger'>{item.username}</h6>
                    <p>forget your password? click this button bellow</p>
                    <button className="btn btn-success" onClick={()=>this.sendEmailReset(item)}>send email</button>
                </div>
            )
        })
        return show;
    }
    sendSuccess=()=>{
        if(this.state.reset != ''){
            return (
                <div className="card mt-2">
                    <p className="text-danger">{this.state.reset}</p>
                </div>
            )
        }
    }
    render(){
        if(this.props.username === ""){ 
            return(
            <div className="limiter">
            <div className="container-login100">
              <div className="wrap-login100">
                {/* <form className="login100-form validate-form"> */}
                  <p className="p-t-10 textinlogin">Forget your username/password? insert your email bellow</p>
                  <div className="wrap-input100 validate-input m-t-45 m-b-35" data-validate="Enter email">
                    <input className="input100" ref="email" type="email" name="email" placeholder="Email" onKeyPress={this.renderOnKeyPress}/>
                    {/* <span className="focus-input100" data-placeholder="Username" /> */}
                  </div>
                  <div className="container-login100-form-btn">
                  {/* {this.renderError()}
                  {this.renderButton()} */}
                  <button type="button" className="btn btn-default orange col-9" onClick={()=>this.getUser()}>Submit</button>
                  </div>
                {/* </form> */}
                {this.putUsernameAndButton()}
                  {this.sendSuccess()}
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

export default connect(mapStateToProps, {onUserLogin})(Forgetuser);