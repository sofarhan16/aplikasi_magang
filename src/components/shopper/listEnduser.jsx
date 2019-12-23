import React, { Component } from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import  SidebarShopper from './sidebarShopper'
import Select from 'react-select';
import { KONEKSI } from '../../support/config';
import queryString from 'query-string';
import ReactLoading from 'react-loading';
import moment from 'moment'


class listEnduser extends Component {


    constructor(props){
        super(props)
        this.state = {
            data: [],
            negara: '',
            batch: '',
            url: '',
            kode: '',
            loading: 'false'
        }
    }

    componentDidMount(){

        this.getListenduser()
        this.getShopperinfo()

    }

    getShopperinfo = () => {
        
        var id = this.props.user.id_agent
        axios.post(`${KONEKSI}/transaction/getShopperNegara`, {ps: id})
        .then((res) => {

            var obj = res.data
            var hasil =obj[Object.keys(obj)[0]]
            this.setState({negara: hasil.id_negara})

        }).catch((err) => {
            console.log(err)
        })
        
    }
    

    getListenduser = () => {
        var params = queryString.parse(this.props.location.search)
        var tanggal = params.tanggal
        var parser = tanggal.replace('%20', ' ');
        axios.post(`${KONEKSI}/transaction/getListEnduser`, {waktu: parser})
        .then((res) => {
            this.setState({data: res.data})
            console.log(res.data)
        }).catch((err) => {
            console.log(err)
        })


    }



    readyShipping = (item) => {
        // if(this.state.loading){
        //     return<ReactLoading type='cylon' color="black" height={20} width={45} />
        // }
        var shipper = item.ship
        var {negara} = this.state
        var valid = window.confirm("Pastikan semua barang customer telah di lengkapi")
        if(valid){
            alert("Mohon tunggu shipping label sedang di proses")   

            if(shipper == 1){
                var bt = document.querySelectorAll(".btn_confirm"); 
                for (var i=0;i<bt.length;i++) {
                    bt[i].onClick = `${bt[i].value = "Waiting...", bt[i].disabled = "on"}`;
                }
                axios.get(`${KONEKSI}/transaction/getCustomerInfo/`+item.id_customer+'/'+negara+'/'+item.id_transaksi)
                .then((res) => {
                        let random = Math.random().toString(36).substring(7);

                        // pembulatan
                        var obj = res.data
                        var berat = 0
                        for(var i = 0; i < obj.length; i++){
                            berat += obj[i].berat * obj[i].item_quantity
                            console.log(berat)
                        }
                        console.log(berat)

                        var angka = `${berat / 1000}`;

                        if(angka.length > 4){
                            var angka = angka.slice(0,4)
                        }
                        console.log(angka)
                        

                        // EkVe2MUgS9FngB6nh3F7QoG3a7Mg3TvW
                        var janio = 
                        {
                            secret_key: "XfApV4khF1goVdRgUiKhQZB06wqu7xSh",
                            blocking: true,
                            orders: [
                                {
                                    service_id: `${negara == '2' ? 11
                                                : negara == '4' ? 4
                                                : negara == '5' ? 1
                                                : negara == '7' ? 34
                                                : 1}`,
                                    tracking_no: "",
                                    shipper_order_id: "WN"+random,
                                    order_length: 12,
                                    order_width: 12,
                                    order_height: 12,
                                    order_weight: angka,
                                    // COD || PrePaid
                                    payment_type: "PrePaid",
                                    // cod_amt_to_collect: 0,
                                    consignee_name: item.nama_lengkap,
                                    consignee_address: item.alamat,
                                    consignee_postal: item.kodepos,
                                    consignee_country: "Indonesia",
                                    consignee_city: item.kota,
                                    consignee_state: "West Java",
                                    consignee_province: item.provinsi,
                                    consignee_number: item.number,
                                    consignee_email: "support@warehousenesia.id",
                                    // pickup_country: "Malaysia",
                                    pickup_country: `${negara == '2' ? "Hongkong"
                                                    : negara == '4' ? "Malaysia"
                                                    : negara == '5' ? "Singapore"
                                                    : negara == '7' ? "Thailand"
                                                    : "Singapore"}`,
                                    pickup_contact_name: item.nama,
                                    pickup_contact_number: `${negara == '2' ? "Hongkong"
                                                            : negara == '4' ? "+60109106548"
                                                            : negara == '5' ? "Singapore"
                                                            : negara == '7' ? "+66953204878"
                                                            : "Singapore"}`,
                                    pickup_state: "",
                                    pickup_city: null,
                                    pickup_province: null,
                                    pickup_postal: "640534",
                                    pickup_address: "Jurong West Ave 1",
                                    items: res.data
                                    // items: [
                                    //     {
                                    //       item_desc: "Blue Male T-Shirt",
                                    //       item_category: "Fashion Apparel",
                                    //       item_product_id: "PROD123",
                                    //       item_sku: "ITEMSKU123",
                                    //       item_quantity: 3,
                                    //       item_price_value: 23.55,
                                    //       item_price_currency: "IDR"
                                    //     }
                                    // ]
                                },
                            ]
                        }
                        // console.log(janio)
                        if(res.data.length > 0){
                            axios.post(`https://janio-api-int.herokuapp.com/api/order/orders/`, janio)
                            .then((res2) => {
                                // console.log(res2.data.orders[0].order_label_url)
                                console.log(res2.data)
                                this.setState({batch: res2.data.upload_batch_no})
                                this.setState({url: res2.data.orders[0].order_label_url})
                                this.setState({kode: res2.data.orders[0].tracking_no})
                                this.updateSD(item.id_customer, item.id_transaksi)
                            }).catch((err) => {
                                // alert("Please reload the page and try again or contact customer service")
                                console.log(err)
                            })
                        }else{
                            alert("Semua barang customer masih kurang")
                            window.location.reload()
                        }
    
                }).catch((err) => {
                    alert("Please reload the page and try again")
                    console.log(err)
                })
    
            }else if(shipper == 2){
                var bt = document.querySelectorAll(".btn_confirm"); 
                for (var i=0;i<bt.length;i++) {
                    bt[i].onClick = `${bt[i].value = "Waiting...", bt[i].disabled = "on"}`;
                }
                this.updateSD(item.id_customer, item.id_transaksi)

            }
        }else{
            return false
        }

    }

    buttonConfirm = (item) => {
        console.log(item)

        var { negara } = this.state

        if(item.status >= 4 && item.urlorder != null){
            if(item.ship == 1){
                return <a href={item.urlorder} className="btn btn-success" target="_blank"><i className="fa fa-print"></i></a>
            }else{
                return <a href={`/shopper/shipping?transaksi=${item.id_transaksi}&customer=${item.id_customer}&negara=${negara}`} className="btn btn-success" target="_blank"><i className="fa fa-print"></i></a>
            }
        }else{
            // return <button className="btn btn-success" onClick={item.status == 2 ?() =>  alert("Harap tekumpul semua") :() => this.readyShipping(item)} disabled={item.status == 2 ? "true": ""}>Confirmation</button>
            // return <button className="btn btn-success" onClick={() => this.readyShipping(item)} disabled={item.status == 2 ? "true": ""}>Confirmation</button>
            return <input type="button" className="btn btn-success btn_confirm" onClick={() => this.readyShipping(item)} value="Confirmation"/>
        }

    }


    updateSD = (id, tr) => {

        // console.log(id)
        // console.log(this.state.batch)
        // console.log(this.state.kode)
        // console.log(this.state.url)

        var { kode, batch, url } = this.state
        
        axios.post(`${KONEKSI}/transaction/updateSD`, {
            batch: batch,
            track: kode,
            url: url,
            id_customer: id,
            id_transaksi: tr
        })
        .then((res) => {
            alert("Proses Selesai")
            window.location.reload()
        }).catch((err) => {
            console.log(err)
        })

    }


    renderTable = () => {

        const table = this.state.data.map((item) => {

            return (
                <tr>
                    <td>{item.nama_lengkap}</td>
                    <td><a href={`/shopper/listPurchaseUser?user=${item.id_customer}&transaksi=${item.id_transaksi}`} className="btn btn-success"><i className="fa fa-search"></i></a></td>
                    <td>{this.buttonConfirm(item)}</td>
                </tr>
            )

        })
        return table

    }

    loading1=()=>{
        if(this.state.loading){
            return<ReactLoading type='cylon' color="black" height={20} width={45} />
        }
    }

    allclear = () => {

        var { data } = this.state

        var id_ps = this.props.user.id_agent

        var valid = window.confirm("Apakah semua sudah selesai?")
        if(valid){
            for(var i = 0; i < data.length; i++){

                axios.post(`${KONEKSI}/transaction/allClear`,{
                    customer: data[i].id_customer,
                    id_ps: id_ps,
                    transaksi: data[i].id_transaksi
                }).then((res) => {
                    window.history.go(-1)
                }).catch((err) => {
                    console.log(err)
                })
    
            }
        }else{
            return false;
        }

    }

    render() {
        var { negara } = this.state
        return (
            <div className="container-fluid">
                <div className="row">
                    <SidebarShopper listC="aktif"/>
                    <div className="col-md-10">
                        <button className="btn btn-success mb-2" onClick={() => this.allclear()}>All Clear</button>
                        <table className="table table-bordered">
                            <tr>
                                <td>Customer</td>
                                <td>Detail Customer</td>
                                <td>Confirmation</td>
                            </tr>
                            {this.renderTable()}
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { 
        user: state.auth,
        loading: state.auth.loading 
    };
}

export default connect(mapStateToProps)(listEnduser);
