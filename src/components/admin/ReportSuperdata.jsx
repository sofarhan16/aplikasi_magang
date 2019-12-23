import React, { Component } from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import SidebarAdmin from './SidebarAdmin';
import { KONEKSI } from '../../support/config';
import Shopperhistory from './shopperHistory';


class ReportSuperdata extends Component {

    constructor(props){
        super(props)

        this.state = {
            listHistory: [],
            tampil: 0
            
        }

    }


    componentDidMount(){
        this.getHistoryOrder()
    }

    getHistoryOrder = () => {

        axios.get(`${KONEKSI}/transaction/getHistoryatShopper`)
        .then((res) => {
            this.setState({listHistory: res.data})
        }).catch((err) => {
            console.log(err)
        })

    }

    eachHistory = () => {

        const listdata = this.state.listHistory.map((item) => {

            return (

                <tr>
                    <td>{item.id_transaksi}</td>
                    <td>{item.waktu}</td>
                    <td><button className="btn btn-success btn-sm" onClick={() => this.setState({tampil: item.id_transaksi})}><i className="fa fa-search"></i></button></td>
                </tr>

            )

        })

        return listdata

    }

    displayHistory = () => {

        if(this.state.tampil == 0){
            return (
                <table className="table table-bordered">
                    <tr className="blue">
                        <th>ID Transaksi</th>
                        <th>Waktu</th>
                        <td>Detail</td>
                    </tr>
                    {this.eachHistory()}
                </table>
            )
        }else{
            return <Shopperhistory transaksi={this.state.tampil}/>
        }

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

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <SidebarAdmin rSD="aktif" />
                    <div className="col-md-10">

                        <div className="alert blue media col-12">
                            <div className="col-md-12 font-templates font-weight-bold media-body">
                                <h4>Super Data</h4>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                {this.backButton()}
                                {this.displayHistory()}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return { 
        user: state.auth
    };
}

export default connect(mapStateToProps)(ReportSuperdata);