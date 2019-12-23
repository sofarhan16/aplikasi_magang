import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import { Alert } from 'reactstrap';
import { Col, Row, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import axios from 'axios';
import { KONEKSI } from '../support/config';
import Select from 'react-select';
// const cookies = new Cookies();

class DataAgent extends Component {
    constructor(props){
        super(props)
        this.state={
            submit:0,
            state: [],
            selectedOption: null
        }
    }


    componentDidMount(){
        this.getState()

    }

    onBtnRegisterClick = () => {
        var id_agent = this.props.id_agent;
        var fullname = this.refs.fullname.refs.tbfullname.value;
        var companyName = this.refs.company.refs.tbcompany.value;
        var address = this.refs.address.refs.tbaddress.value;
        var Provinsi = this.state.selectedOption.value;
        var kota = this.refs.City.refs.tbCity.value;
        var kodepos = this.refs.zipcode.refs.tbzipcode.value;
        console.log(id_agent, fullname)
        axios.post(`${KONEKSI}/auth/addagentdata`,{
            id_agent,fullname,companyName, address, Provinsi, kota, kodepos
        })
        .then((res) => {
            alert("data saved!")
            console.log(res.data);
            this.setState({submit:1})
        })
        .catch((err) =>{
            console.log(err)
            this.setState({submit:0})
        })
    }

    getState = () => {

        axios.get(`https://janio-api.herokuapp.com/api/location/states/?countries=Indonesia`)
        .then((res) => {
            this.setState({state: res.data})
        }).catch((err) => {
            console.log(err)
        })

    }

    renderButton = () => {
        if(this.props.loading){
            return <center><div className="loader"></div></center>
        }
        return <button type="button" onClick={this.onBtnRegisterClick} className="btn btn-primary" style={{width:"200px"}} >Submit</button>
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

    dataSelect=()=>{
        const userList = this.state.state.map((item)=>{
            
            return { value: item.state_name, label: `${item.state_name}` } 
        
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

    render() {

        const { selectedOption } = this.state;
        if(this.props.id_agent == 0||this.props.id_agent == null||this.props.id_agent == undefined){
            window.location.reload()
        }
        if(this.state.submit === 0){
            if(this.props.username !== ''){
                return(
                    <div className="container">
                         <div className="page">
                            <h1 className='text-center'>Register Agent Store</h1>
                            <div className="text-left">
                            <FormGroup>
                                <Label for="exampleAddress">Your Full Name</Label>
                                <Input type="text" ref="fullname" innerRef="tbfullname" name="fullname" id="exampleAddress" placeholder="Full Name"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleAddress">Your Store Name</Label>
                                <Input type="text" ref="company" innerRef="tbcompany" name="address" id="exampleAddress" placeholder="Store Name"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleAddress2">Your Address</Label>
                                <Input type="text" ref="address" innerRef="tbaddress" name="address2" id="exampleAddress2" placeholder="Address"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleAddress2">Your Province</Label>
                                <Select
                                    value={selectedOption}
                                    onChange={this.handleChange}
                                    options={this.dataSelect()}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleAddress2">Your City</Label>
                                <Input type="text" ref="City" innerRef="tbCity" name="address2" id="exampleAddress2" placeholder="City"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleAddress2">Your postal code</Label>
                                <Input type="number" ref="zipcode" innerRef="tbzipcode" name="address2" id="exampleAddress2" placeholder="postal code"/>
                            </FormGroup>
                                <div className='text-center'>
                                    {this.renderButton()}
                                </div>
                            </div>
                         </div>
                    </div>
                );  
            }
            return <Redirect to='/'/>
        }
        return <Redirect to='/verify'/>
    }
}

const mapStateToProps = (state) => {
    return { 
        username: state.auth.username, 
        error: state.auth.error, 
        loading: state.auth.loading ,
        password: state.auth.password,
        id_agent:state.auth.id_agent
    };
}

export default connect(mapStateToProps)(DataAgent);