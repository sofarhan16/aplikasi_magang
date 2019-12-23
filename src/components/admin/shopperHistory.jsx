import React, { Component } from 'react'
import { KONEKSI } from '../../support/config';
import axios from 'axios';

class shopperHistory extends Component {

    constructor(props){
        super(props)
        
        this.state = {
            detail: []
        }

    }

    componentDidMount() {
        this.getDetail()
    }

    getDetail = () => {

        axios.get(`${KONEKSI}/transaction/getDetailHistoryShopper/`+this.props.transaksi)
        .then((res) => {
            this.setState({detail: res.data})
        }).catch((err) => {
            console.log(err)
        })

    }


    displayDetail = () => {

        const listDetail = this.state.detail.map((item) => {

            return (

                <tr>
                    <td width="400">{item.nama_lengkap}</td>
                    <td width="400">{item.nama_produk}</td>
                    <td width="50"><img src={KONEKSI+item.gambar} alt="" width='75' height='75'/></td>
                    <td>{item.jml}/{item.terkumpul}</td>
                    <td>{item.status == 2 ? "Sedang di proses" : item.status >= 3  ? "Selesai" : "Selesai" }</td>
                </tr>

            )

        })
        
        return listDetail

    }


    render() {

        return (
            
            <table className="table table-bordered">
                <tr className="blue">
                    <th>Nama Customer</th>
                    <th>Nama Barang</th>
                    <th>Gambar</th>
                    <th>Jumlah</th>
                    <th>Status</th>
                </tr>
                <tbody>
                    {this.displayDetail()}
                </tbody>
            </table>
        )
    }
}

export default shopperHistory;
