import React, { Component } from 'react'
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import  SidebarAdmin from './SidebarAdmin'
import { KONEKSI } from '../../support/config';
import CustomerJanio from './listCustomerJanio'

class listCustomerJanio extends Component {


    constructor(props){
        super(props)

        this.state = {
            customer: [],
            batch: [],
            janio: []
        }
    }

    componentDidMount() {
        this.getCustomer()
        this.shippingLabel()
    }

    getCustomer = () => {

        axios.get(`${KONEKSI}/transaction/getAllJanio/`+this.props.transaksi)
        .then((res) => {
            this.setState({customer: res.data})
            var obj = res.data
            for(var i = 0; i < obj.length; i ++){
                var hasil =obj[Object.keys(obj)[i]]
                this.setState({batch: this.state.batch.concat(hasil.batchNo)})
                
                axios.get(`https://janio-api-int.herokuapp.com/api/order/order/?secret_key=XfApV4khF1goVdRgUiKhQZB06wqu7xSh&upload_batch_no=${hasil.batchNo}`)
                .then((res2) => {
                    this.setState({janio: this.state.janio.concat(res2.data.results)})
                }).catch((err) => {
                    console.log(err)
                })

            }
        }).catch((err) => {
            console.log(err)
        })

    }

    shippingLabel = (id) => {
        
        var hello = this.state.batch.map((item) => {
            return alert(item)
        })

        return hello
    }

    

    displayCustomer = () => {

        const cus = this.state.janio.map((item) => {
            return (
                <tr>
                    <td>{item.consignee_name}</td>
                    <td>{item.tracker_status_code}</td>
                    <td><a href={item.order_label_url} className="btn btn-success" target="_blank"><i className="fa fa-print"></i></a></td>
                </tr>
            )
        })

        return cus

    }

    render() {
        console.log(this.state.batch)
        console.log(this.state.janio)
        return (
            <table className="table table-bordered">
                <tr className="blue">
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Shipping Label</th>
                </tr>
                <tbody>
                    {this.displayCustomer()}
                </tbody>
            </table>
        )
    }
}

export default listCustomerJanio
