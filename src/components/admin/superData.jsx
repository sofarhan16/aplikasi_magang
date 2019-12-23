import React, { Component } from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import  SidebarAdmin from './SidebarAdmin'
import Select from 'react-select';
import { KONEKSI } from '../../support/config';
import ListSuperData from './listSuperData';
import moment from 'moment'

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

class superData extends Component {

    constructor(props){
        super(props);
        this.state = {
            negara: 1,
            selectedOption: 0,
            selectPS: 0,
            listData: [],
            haveSend: [],
            listPS: [],
            checkO: [],
            shopper: 0,
            shipper: 0,
            customer: [],
            kode: []
            
        }
    }

    selectNegara = () => {

        return [
            { value: 1, label: 'Japan' },
            { value: 2, label: 'Hongkong' },
            { value: 3, label: 'Australia' },
            { value: 4, label: 'Malaysia' },
            { value: 5, label: 'Singapore' },
            { value: 6, label: 'Korea Selatan' }
        ]
    }

    changeNegara = selectedOption => {
        this.setState({ selectedOption });
        
    };

    selectPshopper = () => {
        const PSlist = this.state.listPS.map((item) => {

            return { value: item.id_ps, label: item.nama_ps }

        })
        return PSlist
    }

    changePshopper = selectPS => {

        this.setState({ selectPS });
        this.setState({ shopper: selectPS.value })

    }

    test = () => {

        var { checkO, shopper, shipper, selectedOption } = this.state

        var check = document.getElementsByClassName('check')

        // console.log(this.state.customer)

        const each = this.state.customer.map((item) => {            
            axios.get(`${KONEKSI}/transaction/getAllItem/`+item.id_customer+'/'+selectedOption)
            .then((res) => {
                
                // console.log(res.data)
                console.log(res)
                if(shipper == 1){
                    this.updatePS(item.id_customer)
                }else{
                    this.updatePS(item.id_customer)
                }

            }).catch((err) => {
                console.log(err)
            })
        })

    return each
}

updatePS = ( id ) => {

    var { checkO, shopper, shipper, selectedOption, kode, batch } = this.state

    var check = document.getElementsByClassName('check')
    for(var i = 0; i < check.length; i++){

        console.log(check.length)
        console.log("Checked "+checkO[i])

        if(check[i].checked === true){
            // this.setState({checkO: this.state.checkO.concat(check[i].value)})

            axios.post(`${KONEKSI}/transaction/updatePS`, { 
                id_produk: check[i].value,
                id_shopper: shopper,
                ship: shipper,
                trackNo: null,
                batchNo: null,
                id_customer: id,
                waktu: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            }).then((res3) => {
                window.location.reload()
            }).catch((err) => {
                console.log(err)
            })

        }

    }
}

    getCheck = () => {

        var check = document.getElementsByClassName('check')

        var { checkO, shopper, shipper } = this.state


        for(var i = 0; i < this.state.listData.length; i++){

            if(check[i].checked === true){
                this.setState({checkO: this.state.checkO.concat(check[i].value)})

                axios.post(`${KONEKSI}/transaction/getAllcustomer`, { 
                    id_produk: check[i].value,
                    id_shopper: shopper,
                    ship: shipper
                }).then((res) => {
                    this.setState({customer: res.data})
                    this.test()
                }).catch((err) => {
                    console.log(err)
                })

            }

        }
        
    }


    displayTableproses = () => {
        var { selectedOption } = this.state
        
        if(selectedOption > 0){

            const haveSend = this.state.haveSend.map(item => {

                return(
                
                    <tr>
                        <td width="400">{item.nama_produk}</td>
                        <td width="50"><img src={KONEKSI+item.gambar} alt="" width='75' height='75'/></td>
                        <td>${item.harga}</td>
                        <td>{item.jml}/{item.terkumpul}</td>
                        <td>${item.tot_harga}</td>
                        <td><input type="checkbox" className="form-control" disabled checked={item.terkumpul == item.jml ? "on" : ""}/></td>
                    </tr>
                
                ) 

            }) 
            return haveSend

        }else{

            return (
                <tr>
                    <td colSpan="6"><h5 className="text-secondary">Pilih Negara Telebih dahulu</h5></td>
                </tr>
            )
        }

    }

    displayPS = () => {


        var { selectedOption, selectPS } = this.state
        if(selectedOption > 0){
            
            return (
                <div className="form-input">
                    <select class="form-control mb-2" onChange={this.changeShipper}>
                        <option selected disabled hidden>Pilih Shipper</option>
                        <option value="1">Janio</option>
                        <option value="2">PJT</option>
                    </select>
                    <Select
                        value={selectPS}
                        onChange={this.changePshopper}
                        options={this.selectPshopper()}
                    />
                    <input type="submit" className="btn btn-success mt-3" style={{width: "100%"}} onClick={this.getCheck}/>
                </div>
            )

        }

    }

    addtoShopper = () => {

        var { checkO, shopper, listData } = this.state

        // axios.post(`${KONEKSI}/transaction/addOrderShopper`, { 
        //     id_produk: checkO[i],
        //     id_shopper: shopper
        // }).then((res) => {
        //     alert("Data Berhasil di kirim")
        // }).catch((err) => {
        //     console.log(err)
        // })
    
        

    }

    displayTable = () => {
        var { selectedOption } = this.state
        
        if(selectedOption > 0){

            const listData = this.state.listData.map(item => {
                
                return(
                
                    <tr>
                        <td width="400">{item.nama_produk}</td>
                        <td width="50"><img src={KONEKSI+item.gambar} alt="" width='75' height='75'/></td>
                        <td>${item.harga}</td>
                        <td>{item.jml}</td>
                        <td>${item.tot_harga} </td>
                        <td><input type="checkbox" className="form-control check" value={item.id_produk}/></td>
                    </tr>
                
                ) 

            }) 
            return listData

        }else{

            return (
                <tr>
                    <td colSpan="6"><h5 className="text-secondary">Pilih Negara Telebih dahulu</h5></td>
                </tr>
            )
        }

    }

    changeShipper = (event) => {

        var pilih = event.target.value;
        this.setState({shipper: pilih})

    }

    handleChange = (event) => {

        var pilih = event.target.value;
        this.setState({selectedOption: pilih})
        if(pilih == 1){
            axios.post(`${KONEKSI}/transaction/getSuperdata/`, {id_negara: 1})
            .then((res) => {
                this.setState({listData: res.data})
                console.log(this.state.listData)
            }).catch((err) => {
                console.log(err)
            })
            axios.post(`${KONEKSI}/transaction/getShopper/`, {id_negara: 1})
            .then((res) => {
                this.setState({listPS: res.data})
                console.log(this.state.listPS)
            }).catch((err) => {
                console.log(err)
            })
            axios.post(`${KONEKSI}/transaction/getprosesShopper/`, {id_negara: 1})
            .then((res) => {
                this.setState({haveSend: res.data})
                console.log(this.state.haveSend)
            }).catch((err) => {
                console.log(err)
            })
        }else if(pilih == 2){
            axios.post(`${KONEKSI}/transaction/getSuperdata/`, {id_negara: 2})
            .then((res) => {
                this.setState({listData: res.data})
                console.log(this.state.listData)
            }).catch((err) => {
                console.log(err)
            })
            axios.post(`${KONEKSI}/transaction/getShopper/`, {id_negara: 2})
            .then((res) => {
                this.setState({listPS: res.data})
                console.log(this.state.listPS)
            }).catch((err) => {
                console.log(err)
            })
            axios.post(`${KONEKSI}/transaction/getprosesShopper/`, {id_negara: 2})
            .then((res) => {
                this.setState({haveSend: res.data})
                console.log(this.state.haveSend)
            }).catch((err) => {
                console.log(err)
            })
        }else if(pilih == 3){
            axios.post(`${KONEKSI}/transaction/getSuperdata/`, {id_negara: 3})
            .then((res) => {
                this.setState({listData: res.data})
                console.log(this.state.listData)
            }).catch((err) => {
                console.log(err)
            })
            axios.post(`${KONEKSI}/transaction/getShopper/`, {id_negara: 3})
            .then((res) => {
                this.setState({listPS: res.data})
                console.log(this.state.listPS)
            }).catch((err) => {
                console.log(err)
            })
            axios.post(`${KONEKSI}/transaction/getprosesShopper/`, {id_negara: 3})
            .then((res) => {
                this.setState({haveSend: res.data})
                console.log(this.state.haveSend)
            }).catch((err) => {
                console.log(err)
            })
        }else if(pilih == 4){
            axios.post(`${KONEKSI}/transaction/getSuperdata/`, {id_negara: 4})
            .then((res) => {
                this.setState({listData: res.data})
                console.log(this.state.listData)
            }).catch((err) => {
                console.log(err)
            })
            axios.post(`${KONEKSI}/transaction/getShopper/`, {id_negara: 4})
            .then((res) => {
                this.setState({listPS: res.data})
                console.log(this.state.listPS)
            }).catch((err) => {
                console.log(err)
            })
            axios.post(`${KONEKSI}/transaction/getprosesShopper/`, {id_negara: 4})
            .then((res) => {
                this.setState({haveSend: res.data})
                console.log(this.state.haveSend)
            }).catch((err) => {
                console.log(err)
            })
        }else if(pilih == 5){
            axios.post(`${KONEKSI}/transaction/getSuperdata/`, {id_negara: 5})
            .then((res) => {
                this.setState({listData: res.data})
                console.log(this.state.listData)
            }).catch((err) => {
                console.log(err)
            })
            axios.post(`${KONEKSI}/transaction/getShopper/`, {id_negara: 5})
            .then((res) => {
                this.setState({listPS: res.data})
                console.log(this.state.listPS)
            }).catch((err) => {
                console.log(err)
            })
            axios.post(`${KONEKSI}/transaction/getprosesShopper/`, {id_negara: 5})
            .then((res) => {
                this.setState({haveSend: res.data})
                console.log(this.state.haveSend)
            }).catch((err) => {
                console.log(err)
            })
        }else if(pilih == 6){
            axios.post(`${KONEKSI}/transaction/getSuperdata/`, {id_negara: 6})
            .then((res) => {
                this.setState({listData: res.data})
                console.log(this.state.listData)
            }).catch((err) => {
                console.log(err)
            })
            axios.post(`${KONEKSI}/transaction/getShopper/`, {id_negara: 6})
            .then((res) => {
                this.setState({listPS: res.data})
                console.log(this.state.listPS)
            }).catch((err) => {
                console.log(err)
            })
            axios.post(`${KONEKSI}/transaction/getprosesShopper/`, {id_negara: 6})
            .then((res) => {
                this.setState({haveSend: res.data})
                console.log(this.state.haveSend)
            }).catch((err) => {
                console.log(err)
            })
        }else if(pilih == 7){
            axios.post(`${KONEKSI}/transaction/getSuperdata/`, {id_negara: 7})
            .then((res) => {
                this.setState({listData: res.data})
                console.log(this.state.listData)
            }).catch((err) => {
                console.log(err)
            })
            axios.post(`${KONEKSI}/transaction/getShopper/`, {id_negara: 7})
            .then((res) => {
                this.setState({listPS: res.data})
                console.log(this.state.listPS)
            }).catch((err) => {
                console.log(err)
            })
            axios.post(`${KONEKSI}/transaction/getprosesShopper/`, {id_negara: 7})
            .then((res) => {
                this.setState({haveSend: res.data})
                console.log(this.state.haveSend)
            }).catch((err) => {
                console.log(err)
            })
        }
        

    }

    
    render() {
        const { username } = this.props.user;
        const { selectedOption, listData, checkO, customer } = this.state;
        if(username !== ""){
            return (
                <div className="container-fluid">
                    <div className="row">
                        <SidebarAdmin superd="aktif"/>
                        <div className="col-md-10">

                            <div className="alert blue media col-12">
                                <div className="col-md-12 font-templates font-weight-bold media-body">
                                    <h4>Super Data</h4>
                                </div>
                            </div>

                            <div className="row justify-content-center">
                                <div className="col-md-2 mt-2"><h5>Pilih Negara</h5></div>
                                <div className="col-md-3">
                                <select class="form-control" onChange={this.handleChange}>
                                    <option selected disabled hidden>Pilih Negara</option>
                                    <option value="1">Japan</option>
                                    <option value="2">Hongkong</option>
                                    <option value="3">Australia</option>
                                    <option value="4">Malaysia</option>
                                    <option value="5">Singapore</option>
                                    <option value="6">Korea Selatan</option>
                                    <option value="7">Thailand</option>
                                </select>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-md-12 mb-3">
                                    <h4>List Barang</h4>
                                    <table className="table table-bordered mt-2">
                                        <tr>
                                            <th>Nama Barang</th>
                                            <th>Gambar Barang</th>
                                            <th>Harga Satuan</th>
                                            <th>Total Jumlah</th>
                                            <th>Harga Total</th>
                                            <th>Status</th>
                                        </tr>
                                        {this.displayTable()}
                                    </table>
                                    {this.displayPS()}
                                </div>
                                <div className="col-md-12">
                                    <h4>Barang sedang di proses</h4>
                                    <table className="table table-bordered mt-2">
                                        <tr>
                                            <th>Nama Barang</th>
                                            <th>Gambar Barang</th>
                                            <th>Harga Satuan</th>
                                            <th>Total Jumlah</th>
                                            <th>Harga Total</th>
                                            <th>Status</th>
                                        </tr>
                                        {this.displayTableproses()}
                                    </table>
                                </div>
                            </div>


                        </div>
                        
                    </div>

                </div>
            );
        }
        return(
            <Redirect to="/" />
        );
    }
    
    
}


const mapStateToProps = (state) => {
    
    return { 
        user: state.auth
    };
}

export default connect(mapStateToProps)(superData);