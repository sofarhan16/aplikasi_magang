import React, { Component } from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import  SidebarShopper from './sidebarShopper';
import { KONEKSI } from '../../support/config';
import queryString from 'query-string';
import moment from 'moment';

class detailShipping extends Component {

    constructor(props){
        super(props)

        this.state = {

            customer: [],
            batch: []

        }

    }

    componentDidMount() {

        this.getCustomer()

    }

    getCustomer = () => {

        var params = queryString.parse(this.props.location.search);

        if(params.ship == 'Janio'){
            axios.get(`${KONEKSI}/transaction/getAllJanio/`+params.transaksi)
            .then((res) => {
                var obj = res.data
                for(var i = 0; i < obj.length; i ++){
                    var hasil =obj[Object.keys(obj)[i]]
                    this.setState({batch: this.state.batch.concat(hasil.batchNo)})
                    
                    axios.get(`https://janio-api-int.herokuapp.com/api/order/order/?secret_key=XfApV4khF1goVdRgUiKhQZB06wqu7xSh&upload_batch_no=${hasil.batchNo}`)
                    .then((res2) => {
                        console.log(res2.data)
                        this.setState({customer: this.state.customer.concat(res2.data.results)})
                    }).catch((err) => {
                        console.log(err)
                    })

                }
            }).catch((err) => {
                console.log(err)
            })
        }else if(params.ship == 'PJT'){
            axios.get(`${KONEKSI}/transaction/getCustPjt/`+params.transaksi)
            .then((res) => {
                this.setState({customer:res.data})
            }).catch((err) => {
                console.log(err)
            })
        }else{
            alert("Ship Not Found")
        }

    }

    displayCustomer = () => {

        var params = queryString.parse(this.props.location.search);

        if(params.ship == 'Janio'){
            const cus = this.state.customer.map((item) => {
                return (
                    <tr>
                        <td>{item.consignee_name}</td>
                        <td><a href={item.order_label_url} className="btn btn-success" target="_blank"><i className="fa fa-print"></i></a></td>
                    </tr>
                )
            })
            return cus

        }else if(params.ship == 'PJT'){
            const cus = this.state.customer.map((item) => {
                return (
                    <tr>
                        <td>{item.nama_lengkap}</td>
                        <td><a href={item.nama_lengkap} className="btn btn-success" target="_blank"><i className="fa fa-print"></i></a></td>
                    </tr>
                )
            })

            return cus
        }

        

    }


    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <SidebarShopper shipping="aktif"/>
                    <div className="col-md-10">

                        <div className="alert blue media col-12">
                            <div className="col-md-12 font-templates font-weight-bold media-body">
                                <h4>Shipping Label</h4>
                            </div>
                        </div>
                        
                        <div className="alert blue media col-12">
                            <div className="col-md-12">
                                <a href="/shopper/shippingLabel" className="btn btn-default orange float-left btn-sm">Back</a>
                            </div>
                        </div>

                        <table className="table table-bordered">
                            <tr className="blue">
                                <th>Customer</th>
                                <th>Shipping Label</th>
                            </tr>
                            <tbody>
                                {this.displayCustomer()}
                            </tbody>
                        </table>
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

export default connect(mapStateToProps)(detailShipping);