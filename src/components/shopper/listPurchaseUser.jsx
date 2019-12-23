import React, { Component } from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import  SidebarShopper from './sidebarShopper'
import Select from 'react-select';
import { KONEKSI } from '../../support/config';
import queryString from 'query-string';
import moment from 'moment'


class listPurchaseUser extends Component {


    constructor(props){
        super(props)

        this.state = {
            barang: []
        }

    }

    componentDidMount(){
        this.getListBarang()
    }

    getListBarang = () => {

        var params = queryString.parse(this.props.location.search)


        axios.post(`${KONEKSI}/transaction/getBarangEnduser`, {
            transaksi: params.transaksi, 
            id_cu: params.user
        })
        .then((res) => {
            this.setState({barang: res.data})
            console.log(res.data)
        }).catch((err) => {
            console.log(err)
        })

    }

    renderTable = () => {

        const list = this.state.barang.map((item) => {
            return (

                <tr>
                    <td>{item.nama_produk}</td>
                    <td><img src={KONEKSI+item.gambar} alt="" width='75' height='75'/></td>
                    <td>{item.pembagian < -item.jumlah ? '0' : item.jumlah_barang}</td>
                    <td>{item.catatan}</td>
                </tr>

            )
        })
        return list

    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <SidebarShopper listC="aktif"/>
                    <div className="col-md-10">
                        <div className="alert blue media col-12">
                            <div className="col-md-12 font-templates font-weight-bold media-body">
                                <h4>List Item Customer</h4>
                            </div>
                        </div>

                        <table className="table table-bordered">
                            <tr className="blue">
                                <td>Nama Barang</td>
                                <td>Gambar</td>
                                <td>Jumlah</td>
                                <td>Catatan</td>
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
        user: state.auth
    };
}

export default connect(mapStateToProps)(listPurchaseUser);
