import React, { Component } from 'react'
import axios from 'axios';
import { KONEKSI } from '../../support/config';
import queryString from 'query-string';
import moment from 'moment';

class shippingPJT extends Component {

    constructor(props){
        super(props)

        this.state = {
            barang: [],
            customer: []
        }

    }


    componentDidMount(){
        this.getCustomer()
        this.getAllItem()
    }


    getCustomer = () => {

        var params = queryString.parse(this.props.location.search)
        var customer  = params.customer

        axios.post(`${KONEKSI}/transaction/getOneCustomer`, {customer: customer})
        .then((res) => {
            this.setState({customer: res.data})
        }).catch((err) => {
            console.log(err)
        })

    }


    getAllItem = () => {

        var params = queryString.parse(this.props.location.search)
        
        var transaksi = params.transaksi
        var customer  = params.customer
        var negara    = params.negara

        axios.get(`${KONEKSI}/transaction/getCustomerInfo/`+customer+'/'+negara+'/'+transaksi)
        .then((res) => {
            this.setState({barang:res.data})
        }).catch((err) => {
            console.log(err)
        })


    }

    renderItem = () => {
        
        const renderi = this.state.barang.map((item) => {

            return (
                <div className="row col-md-12">
                    <div className="col-md-5 border border-dark p-2">
                        {item.item_desc}
                    </div>
                    <div className="col-md-3 border border-dark text-center p-2">
                        {item.item_quantity}
                    </div>
                    <div className="col-md-4 border border-dark text-center p-2">
                        {item.item_price_value}
                    </div>
                </div>
            )

        })

        return renderi

    }

    renderTo = () => {

        const rendert = this.state.customer.map((item) => {
            return (

                <div className="col-md-6 border border-dark">
                    <div className="font-weight-bold mt-2">TO: </div>
                    <div>{item.nama_lengkap}</div>
                    <div>Contact: {item.number}</div>
                    <div>{item.alamat}</div>
                    <div>{item.kodepos}</div>
                    <div className="font-weight-bold mb-3">{item.provinsi}, {item.kota}</div>
                </div>
    
            )
        })   
        return rendert  

    }

    renderCon = () => {
        
        const renderC = this.state.customer.map((item) => {

            return (
                <div className="row col-md-12">
                    <div className="col-md-3 border border-dark p-2">
                        Consignee Name
                    </div>
                    <div className="col-md-9 border border-dark p-2">
                        {item.nama_lengkap}
                    </div>
    
                    <div className="col-md-3 border border-dark p-2">
                        Consignee No.
                    </div>
                    <div className="col-md-9 border border-dark p-2">
                        {item.number}
                    </div>
                </div>
            )

        })

        return renderC

    }

    renderBottom = () => {

        const renderB = this.state.customer.map((item) => {

            return (
                <div className="row col-md-12">
                    <div className="col-md-3 border border-dark p-2">
                        Postal Code
                    </div>
                    <div className="col-md-3 border border-dark p-2">
                        {item.kodepos}
                    </div>
                    <div className="col-md-3 border border-dark p-2">
                        Country
                    </div>
                    <div className="col-md-3 border border-dark p-2">
                        Indonesia
                    </div>
                </div>
            )

        })

        return renderB

    }

    renderA = () => {

        const renderA = this.state.customer.map((item) => {

            return(
                <div className="row col-md-12">
                    <div className="col-md-12 border border-dark p-3">
                        <div className="font-weight-bold">Address: </div>
                        <div className="mb-3">{item.alamat}</div>
                    </div>
                </div>
            )

        })

        return renderA

    }


    printShipping = () => {

        window.print()

    }

    render() {

        var { barang } = this.state
        if(barang.length != 0){
            var qty = 0
            var gram = 0.0
            for(let i = 0; i< barang.length; i++){
                qty += barang[i].item_quantity
                gram += barang[i].berat * barang[i].item_quantity
            }
            console.log("TOTAL GRAM: "+ gram)
            console.log("TOTAL QUANTITY: "+qty)

            var kilo = `${gram / 1000}`;

            if(kilo.length > 4){
                var kilo = kilo.slice(0,4)
            }

            var negara = this.state.barang[0].negara
            
            var kode_negara = this.state.barang[0].k_negara
            var waktu = this.state.barang[0].waktu

            var kode_barcode = kode_negara+moment(waktu).format('DD')

        }
        return (

            <div className="container">
                <div className="row">
                    <div className="col-md-12 m-0">
                        <button className="btn btn-success" onClick={() => this.printShipping()}><i className="fa fa-print"></i></button>
                    </div>
                </div>
                <div className="row justify-content-center my-5">
                    <div className="col-md-8">

                        <div className="row text-left">
                            
                            <div className="row col-md-12">
                                <div className="col-md-12 border border-dark p-2">
                                    <div className="row">
                                        <div className="col-md-2">
                                            <img src={KONEKSI+`/images/logowh.svg`} alt="" width="100"/>
                                        </div>
                                        <div className="col-md-1 mt-auto ml-2">
                                            www.warehousenesia.id
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row col-md-12">
                                <div className="col-md-6 border border-dark">

                                    <div className="font-weight-bold mt-2">FROM: {negara}</div>
                                    <div>warehousenesiaid</div>
                                    <div>Jurong West Ave 1</div>

                                </div>
                                
                                {this.renderTo()}
            
                            </div>
                            
                            <div className="row col-md-12">
                                <div className="col-md-12 border border-dark">
                                    
                                    <div className="row my-3">
                                        <div className="col-md-6">
                                            <div className="font-weight-bold">ITEM DESCRIPTION: </div>
                                            <div>Others</div>
                                            <br/>
                                            <div className="font-weight-bold">NOTES: </div>
                                            <div>NA</div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="font-weight-bold">ITEM QUANTITY: </div>
                                            <div>{qty}</div>
                                            <br/>
                                            <div className="font-weight-bold">TOTAL WEIGHT: </div>
                                            <div>{kilo} KG</div>
                                            <br/>
                                            <div className="font-weight-bold">PAYMENT TYPE: </div>
                                            <div>Prepaid</div>
                                        </div>

                                    </div>

                                </div>
                            </div>

                            <div className="row col-md-12">
                                <div className="col-md-12 border border-bottom-0 border-dark p-2 text-center">
                                    <img src={`https://barcode.tec-it.com/barcode.ashx?data=${kode_barcode}&code=Code128&dpi=83`} alt="BarCode"/>
                                </div>
                            </div>


                            <div className="row col-md-12">
                                <div className="col-md-12 border-right border-left border-dark" style={{borderTop: "2px dotted black"}}>
                                    <div className="row my-3">
                                        <div className="col-md-6">
                                            <div>Waybill Number</div>
                                            <div className="mb-2">{kode_barcode}</div>
                                        </div>
                                        <div className="col-md-6 text-right">
                                            <img src={`https://barcode.tec-it.com/barcode.ashx?data=${kode_barcode}&code=Code128&dpi=83`} alt="BarCode"/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row col-md-12">
                                <div className="col-md-5 border border-dark text-left font-weight-bold">
                                    Category Item
                                </div>
                                <div className="col-md-3 border border-dark text-center font-weight-bold">
                                    No. Of Pieces
                                </div>
                                <div className="col-md-4 border border-dark text-center font-weight-bold">
                                    Unit Value (IDR)
                                </div>
                            </div>

                            {/* List Item */}

                            {this.renderItem()}
                            
                            {/* /List Item */}

                            {this.renderCon()}

                            {this.renderA()}

                            {this.renderBottom()}

                            <div className="row col-md-12">
                                <div className="col-md-12 border border-dark p-2">
                                    <span className="font-weight-bold">Shipper Name: </span><span>warehousenesiaid</span>
                                </div>
                            </div>


                        </div>

                    </div>
                </div>
            </div>
        )
    }
}
export default shippingPJT