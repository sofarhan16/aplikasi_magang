import React, { Component } from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import  SidebarAdmin from './SidebarAdmin'
import Select from 'react-select';
import { KONEKSI } from '../../support/config';
import CustomerJanio from './listCustomerJanio';
import moment from 'moment'

class trackingJanio extends Component {

    constructor(props){
        super(props)
        
        this.state = {
            tampil: 0,
            listTrans: [],
            allTrans: []
        }

    }

    componentDidMount () {
        this.getAllTransactionJanio()
    }

    getAllTransactionJanio  = () => {

        axios.get(`${KONEKSI}/transaction/getAllTrans`)
        .then((res) => {
            this.setState({allTrans: res.data, listTrans: res.data})
        }).catch((err) => {
            console.log(err)
        })

    }

    eachTransJanio = () => {
        
        const all = this.state.allTrans.map((item) => {
            return (
                <tr>
                    <td>{item.id_transaksi}</td>
                    <td>{moment(item.waktu).format('DD/MM/YYYY HH:mm:ss')}</td>
                    <td><button className="btn btn-success" onClick={() => this.setState({tampil: item.id_transaksi})}><i className="fa fa-search"></i></button></td>
                </tr>
            )
        })

        return all

    }

    backButton=()=>{
        if(this.state.tampil != 0){
            return (
                <div className="alert blue media col-12">
                    <div className="col-md-12">
                    <button className="btn btn-default orange float-left btn-sm" onClick={()=>this.setState({tampil:0})}>back</button>
                    </div>
                </div>
            )
        }
    }

    

    displayTransJanio = () => {

        var { tampil } = this.state

        if(tampil == 0){
            return (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID Transaction</th>
                            <th>Waktu</th>
                            <th>See Customer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.eachTransJanio()}
                    </tbody>
                </table>
            )
        }else{
            return <CustomerJanio transaksi={this.state.tampil}/>
        }

    }

    searchProses = () => {

        var nama  = this.refs.search.value;

        var arrSearch = this.state.listTrans.filter((item) => {
            return item.id_transaksi == nama;   
        })
        this.setState({allTrans: arrSearch})

        console.log(this.state.listTrans)

    }

    searchForm = () => {
        var { tampil } = this.state
        if(tampil == 0){
            return (
                <form className="mb-3">
                    <div className="row">
                        <div className="col-md-3">
                             <input type="text" className="form-control" placeholder="Search ID Transaction" ref="search"/>
                        </div>
                        <div className="col-md-1">
                            <button type="button" className="btn btn-success" onClick={() => {this.searchProses()}}><i className="fa fa-search"></i></button>
                        </div>
                    </div>
                </form>
            )
        }else{
            return ''
        }

    }
    


    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <SidebarAdmin track="aktif"/>
                    <div className="col-md-10">

                        <div className="alert blue media col-12">
                            <div className="col-md-12 font-templates font-weight-bold media-body">
                                <h4>Tracking Janio</h4>
                            </div>
                        </div>

                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    {this.backButton()}
                                    {this.searchForm()}
                                    {this.displayTransJanio()}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    console.log(state)
    return { 
        user: state.auth
    };
}

export default connect(mapStateToProps)(trackingJanio);
