import React, { Component } from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import  SidebarShopper from './sidebarShopper';
import { KONEKSI } from '../../support/config';
import moment from 'moment';


class shippinglabel extends Component {

    constructor(props){
        super(props);
        this.state = {
            janio: [],
            PJT: []
        }
    }

    componentDidMount() {

        this.getCustomerJanio()
        this.getCustomerPJT()
        
    }

    getCustomerJanio = () => {

        axios.get(`${KONEKSI}/transaction/getJanioShopper/`+ this.props.user.id_agent)
        .then((res) => {
            this.setState({janio: res.data})
        }).catch((err) => {
            console.log(err)
        })

    }

    getCustomerPJT = () => {

        axios.get(`${KONEKSI}/transaction/getPJTShopper/`+ this.props.user.id_agent)
        .then((res) => {
            this.setState({PJT: res.data})
        }).catch((err) => {
            console.log(err)
        })

    }

    displayCustomerJanio = () => {

        const listUser = this.state.janio.map((item) => {

            return(

                <tr>
                    <td>{item.id_transaksi}</td>
                    <td>{moment(item.waktu).format('DD/MM/YYYY HH:mm:ss')}</td>
                    <td><a href={`/shopper/detailShipping?transaksi=${item.id_transaksi}&ship=Janio`} className="btn btn-success"><i className="fa fa-search"></i></a></td>
                </tr>

            )

        })

        return listUser

    }

    displayCustomerPJT = () => {

        const listUser = this.state.PJT.map((item) => {

            return(

                <tr>
                    <td>{item.id_transaksi}</td>
                    <td>{moment(item.waktu).format('DD/MM/YYYY HH:mm:ss')}</td>
                    <td><a href={`/shopper/detailShipping?transaksi=${item.id_transaksi}&ship=PJT`} className="btn btn-success"><i className="fa fa-search"></i></a></td>
                </tr>

            )

        })

        return listUser

    }


    render() {
        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <SidebarShopper shipping="aktif"/>
                    <div className="col-md-10">

                        <div className="alert blue media col-12">
                            <div className="col-md-12 font-templates font-weight-bold media-body">
                                <h4>Shipping Label</h4>
                            </div>
                        </div>

                        
                        <div className="row justify-content-center">
                            <div className="col-md-6 col-12">
                                <center>
                                    <p className="mb-2 h3">PJT</p>
                                    <table className="table table-bordered text-center">
                                        <tr>
                                            <th>ID Transaksi</th>
                                            <th>Waktu</th>
                                            <th>Customer</th>
                                        </tr>
                                        {this.displayCustomerPJT()}
                                    </table>
                                </center>
                            </div>
                            <div className="col-md-6">
                                <center>
                                    <p className="mb-2 h3">Janio</p>
                                    <table className="table table-bordered text-center">
                                        <tr>
                                            <th>ID Transaksi</th>
                                            <th>Waktu</th>
                                            <th>Customer</th>
                                        </tr>
                                        {this.displayCustomerJanio()}
                                    </table>
                                </center>
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

export default connect(mapStateToProps)(shippinglabel);