import React, { Component } from 'react'
import { KONEKSI } from '../../support/config';
import axios from 'axios';

class listSuperData extends Component {

    state = {
        listData: []
    }

    componentDidMount() {
        this.getSuperData()
    }

    getSuperData = () => {
        
        if(this.props.idnegara == 1){
            axios.get(`${KONEKSI}/transaction/getSuperdata/`+this.props.idnegara)
            .then((res) => {
                this.setState({listData: res.data})
                console.log(this.state.listData)
            }).catch((err) => {
                console.log(err)
            })
        }else if(this.props.idnegara == 2){
            
            axios.get(`${KONEKSI}/transaction/getSuperdata/`+this.props.idnegara)
            .then((res) => {
                this.setState({listData: res.data})
                console.log(this.state.listData)
            }).catch((err) => {
                console.log(err)
            })

        }

    }

    dataTable = () => {
        

            const listData = this.state.listData.map(item => {

                return(
                
                    <tr>
                        <td>{item.nama_produk}</td>
                        <td><img src={KONEKSI+item.gambar} alt="" width='50' height='50'/></td>
                        <td>${item.harga}</td>
                        <td>{item.jml}</td>
                        <td>${item.tot_harga}</td>
                        <td><input type="checkbox" className="form-control"/></td>
                    </tr>
                
                ) 

            }) 
            return listData
        
    }

    render() {
        return (
            <div>
                <table className="table table-bordered mt-2">
                    <tr>
                        <th>Nama Barang</th>
                        <th>Gambar Barang</th>
                        <th>Harga Satuan</th>
                        <th>Jumlah</th>
                        <th>Harga Total</th>
                        <th>Status</th>
                    </tr>
                    {this.dataTable()}
                </table>
            </div>
        )
    }
}

export default listSuperData
