import React, { Component } from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import  SidebarShopper from './sidebarShopper'
import Select from 'react-select';
import { KONEKSI } from '../../support/config';
import AutoConvert from '../AutoConvert';
import moment from 'moment';
import Detail from './detailSD';

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
            pengumpulan: 0,
            checkedOrder: null,
            total: 0,
            negara: 0,
            tampil: "0",
            waktu: "",
        }
    }

    componentDidMount(){
        this.getSuperData()   
    }


    getSuperData = () => {
        var id = this.props.user.id_agent
        axios.post(`${KONEKSI}/transaction/getallshopperorder`,{id_pes: id})
        .then((res) => {
            this.setState({listData: res.data});
            console.log(this.state.listData)
            var obj = res.data
            var hasil =obj[Object.keys(obj)[0]]
            this.setState({negara: hasil.id_negara})



        }).catch((err) => {
            console.log(err)
        })

    }
    
    pengumpulan = (e) => {
        
        this.setState({pengumpulan: e.target.value});

    }

    UpdateTerkumpul = (nama, kumpul, jml, id_tr) => {

        var { pengumpulan, checkedOrder } = this.state
        var getkumpul = Number(pengumpulan)
        var id_ps = this.props.user.id_agent

        if(getkumpul > jml){
            alert("Barang melebihi total jumlah")
        }else{

            if(checkedOrder != null){
                axios.post(`${KONEKSI}/transaction/updatePengumpulan`, {
                    nama: nama, 
                    terkumpul: jml, 
                    status: '3',
                    id_transaksi: id_tr})
                .then((res) => {
                    window.location.reload()
                }).catch((err) => { 
                    console.log(err)
                }) 
            }else{
                        
                axios.post(`${KONEKSI}/transaction/updatePengumpulan`, {
                    nama: nama,
                    terkumpul: getkumpul,
                    status: 2,
                    id_transaksi: id_tr})
                .then((res) => {
                    axios.post(`${KONEKSI}/transaction/getJumlahBarang`, {
                        id: id_ps,
                        nama: nama
                    })
                    .then((res2) => {
                        var kumpul = getkumpul
                        var obj = res2.data
                        console.log(obj)
                        for(var i = 0; i < obj.length; i++){
                            var bagi = kumpul -= obj[i].jumlah
                            console.log(bagi)
                            axios.post(`${KONEKSI}/transaction/updatePembagian`,
                            {
                                id_cus: obj[i].id_customer,
                                pembagian: bagi,
                                id_tr: obj[i].id_transaksi,
                                nama: nama
                            })
                            .then((res) => {
                                window.location.reload()
                            }).catch((err) => {
                                console.log(err)
                            })
                        }
                    }).catch((err) => {
                        console.log(err)
                    })


                }).catch((err) => {
                    console.log(err)
                })

            }

        }
        

    }


    handleCheck = (e) => {

        
        if(e.target.checked){
            this.setState({checkedOrder: e.target.value})
        }else{
            this.setState({checkedOrder: null})
        }

    }


    totalAll = () => {

        var total = 0
        for(let i = 0; i < this.state.listData.length; i++){ 
            if(this.state.listData[i].terkumpul == this.state.listData[i].jml){
                total += this.state.listData[i].tot_harga*0
            }else if(this.state.listData[i].terkumpul > 0){
                total +=  this.state.listData[i].tot_harga-(this.state.listData[i].harga*this.state.listData[i].terkumpul);
            }else{
                total +=this.state.listData[i].tot_harga
            }
        } 
        
        var all = total

        return all; 


    }

    haveNegara = () => {
        
        for(var i = 0; i < this.state.listData.length; i++){
            return this.state.listData[0].id_negara
        }

    }

    displayTotal = () => {

        console.log(this.totalAll() +"+"+ this.haveNegara())
        if(this.totalAll() != 0){
            return (
                <tr>
                    <td colSpan="9"><p className="h4 text-danger">Total</p><AutoConvert mount={this.totalAll()} negara={this.haveNegara()}/></td>
                </tr>
            )
        }else{
            return (
                <tr>
                    <td colSpan="9"><p className="h4 text-danger">Total</p>0</td>
                </tr>
            )
        }
    
    }

    Allfinsih = (nama, kumpul, jml, id_tr) => {

        var valid = window.confirm("Apakah anda yakin ingin menyelesaikan pesanan ini?")
        if(valid){
            axios.post(`${KONEKSI}/transaction/updatePengumpulan`, {
                nama: nama, 
                terkumpul: jml, 
                status: '3',
                id_transaksi: id_tr})
            .then((res) => {
                window.location.reload()
            }).catch((err) => { 
                console.log(err)
            })

        }

    }

    displayTable = () => {
        var { selectedOption, listData } = this.state
        
        if(listData.length > 0){

            const listData = this.state.listData.map(item => {


                return(
                    // #f8d7da
                    <tr style={item.terkumpul < item.jml ? {backgroundColor: "#f8d7da"} : {}}>
                        <td width="200">{item.nama_produk}</td>
                        <td width="50"><img src={KONEKSI+item.gambar} alt="" width='75' height='75'/></td>
                        <td><AutoConvert mount={item.harga} negara={item.id_negara} /></td>
                        <td>{item.jml}/{item.terkumpul}</td>
                        <td><AutoConvert mount={item.tot_harga} negara={item.id_negara}/></td>
                        <td><input type="number" className="form-control" ref="kumpul" onChange={this.pengumpulan} defaultValue={item.terkumpul}/></td>
                        <td><button className="btn btn-success" onClick={() => this.setState({tampil: item.id_produk, waktu: item.waktu})}><i className="fa fa-search"></i></button></td>
                        <td><input type="checkbox" className="form-control check" disabled={item.terkumpul == item.jml ? "on" : "on"} checked={item.terkumpul == item.jml ? "on" : ""} value={item.id_produk} onChange={this.handleCheck}/></td>
                        <td><input type="submit" value="Update" className="btn btn-warning mr-2" onClick={() => {this.UpdateTerkumpul(item.nama_produk, item.terkumpul, item.jml, item.id_transaksi)}}/>
                            <input type="submit" value="Finish" className="btn btn-success" onClick={() => {this.Allfinsih(item.nama_produk, item.terkumpul, item.jml, item.id_transaksi)}} /></td>
                    </tr>
                
                ) 

            }) 
            return listData

        }else{

            return (
                <tr>
                    <td colSpan="9"><h5 className="text-secondary">Tidak ada Order</h5></td>
                </tr>
            )
        }

    }

    backButton=()=>{
        if(this.state.tampil != 0){
            return (
                <div className="alert blue media col-12">
                    <div className="col-md-12">
                    <button className="btn btn-default orange float-left btn-sm" onClick={()=>this.setState({tampil:"0", waktu:""})}>back</button>
                    </div>
                </div>
            )
        }
    }

    renderAll = () => {

        var { tampil, waktu } = this.state

        if(tampil == "0"){
            return (
                <div className="row mt-4">
                    <div className="col-md-12">

                        <div className="alert alert-primary col-6 text-left">
                            <div className="row">
                                <div className="col-1">
                                    <h5><i className="fa fa-info mb-2"></i></h5>
                                </div>
                                <div className="col-11">
                                    <ul>
                                        <li><b>UPDATE :</b> untuk mengupdate pengumuplan barang</li>
                                        <li><b>FINISH :</b> untuk mengakhiri pengumuplan barang</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <h4>List Barang</h4>
                        <table className="table table-bordered mt-2 ">
                            <tr>
                                <th>Nama Barang</th>
                                <th>Gambar Barang</th>
                                <th>Harga Satuan</th>
                                <th>Total Jumlah</th>
                                <th>Harga Total</th>
                                <th>Pengumpulan</th>
                                <th>Detail</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                            {this.displayTable()} 
                            {this.displayTotal()}
                        </table>
                        
                    </div>
                </div>
            )
        }else{
            
            return (
                <Detail produk={tampil} waktu={waktu}/>
            )

        }

    }

    
    render() {
        
        const { username } = this.props.user;
        const { selectedOption, listData, checkedOrder } = this.state;
        console.log(selectedOption)
        console.log(listData)
        console.log(checkedOrder)
        console.log(this.props.user)

        var totals = this.totalAll()
        var negaras = this.haveNegara()

        if(username !== ""){
            return (
                <div className="container-fluid">
                    <div className="row">
                        <SidebarShopper superd="aktif"/>
                        <div className="col-md-10">

                            <div className="alert blue media col-12">
                                <div className="col-md-12 font-templates font-weight-bold media-body">
                                    <h4>Super Data</h4>
                                </div>
                            </div>
                            {this.backButton()}
                            {this.renderAll()}

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