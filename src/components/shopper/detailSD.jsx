import React, { Component } from 'react'
import axios from 'axios';
import  SidebarShopper from './sidebarShopper'
import { KONEKSI } from '../../support/config';

class detailSD extends Component {

    constructor(props){
        super(props)

        this.state = {
            detail: []
        }
    }

    componentDidMount(){
        this.getAllDetail()
    }

    getAllDetail = () => {

        var { waktu, produk } = this.props
        
        axios.post(`${KONEKSI}/transaction/allDetailsuperdata`, {
            waktu,
            produk
        })
        .then((res) => {
            this.setState({detail: res.data})
        }).catch((err) => {
            console.log(err)
        })

    }


    dataList = () => {

        const data = this.state.detail.map((item) => {

            return (
                <tr>
                    <td>{item.nama_lengkap}</td>
                    <td>{item.catatan}</td>
                </tr>
            )

        })
        return data
    }

    
    render() {
        return (
            <div className="row mt-4">
                <div className="col-md-12">
                    
                    <table className="table table-bordered">
                        <tr>
                            <th>Customer</th>
                            <th>Catatan</th>
                        </tr>
                        {this.dataList()}
                    </table>

                </div>
            </div>
        )
    }
}

export default detailSD;
