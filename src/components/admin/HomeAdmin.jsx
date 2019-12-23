import React, { Component} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import SidebarAdmin from './SidebarAdmin';
import { KONEKSI } from '../../support/config';
import axios from 'axios';
import moment from 'moment';
import { CustomInput, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { tsLiteralType } from '@babel/types';
class HomeAdmin extends Component {
state={
    agent:[],
    order:[],
    history:[],
    orderHistory: [],
    newOrder:[],
    register:[],
    bank:[],
    listToVerify:[],
    selectedEditBankId:0,
    imgModal: "",
    news:"",

    activePage: 1, 
    tampilPerPage: 3, 
    totalItem: 0, 
    totalPage: 0, 
    startIndex: 0, 
    finishIndex: 0, 
    listPage: [],

}

HistoryPaymentOrder= () => {
    axios.post(`${KONEKSI}/transaction/getAllPaymentOrderHistory`)
    .then((res) => {
        this.setState({orderHistory: res.data})
        console.log(this.state.orderHistory)
        this.setState({totalItem: this.state.orderHistory.length});
        console.log(this.state.totalPage)
        this.setState({totalPage: Math.ceil(this.state.totalItem / this.state.tampilPerPage)})
    }).catch((err) => {
        console.log(err)
    })
}

componentDidMount(){
    this.getAgentdata()
    this.getListOrder()
    this.getNewOrder()
    this.getHistoryOrder()
    this.getBank()
    this.getnews()
    this.getHistoryRegister()
    this.HistoryPaymentOrder()
}
getAgentdata=()=>{
    axios.get(`${KONEKSI}/auth/getagentlist`
    ).then((res) => {
    this.setState({agent: res.data, searchAgent: res.data});
    console.log(this.state.agent)
    }).catch((err) => {
    console.log(err);
    })
}
getnews=()=>{
    axios.get(`${KONEKSI}/customer/getnews`
    ).then((res) => {
    this.setState({news: res.data[0].news});
    }).catch((err) => {
    console.log(err);
    })
}
getListOrder = () => {
    axios.post(`${KONEKSI}/transaction/getdataorder`
    ).then((res) => {
    this.setState({ newOrder: res.data, selectedRow: 0 });
    console.log(this.state.newOrder)
    }).catch((err) => {
    console.log(err);
    })
}
getNewOrder = () => {
//const { username } = this.props.user;
    axios.post(`${KONEKSI}/transaction/ordertoverify`
    ).then((res) => {
    this.setState({ listToVerify: res.data, selectedRow: 0 });
    console.log(this.state.listToVerify)
    }).catch((err) => {
    console.log(err);
    })
}
 
getHistoryOrder = () => {
    axios.post(`${KONEKSI}/transaction/totalIncome`
    ).then((res) => {
    this.setState({ history: res.data});
    console.log(this.state.history)
    }).catch((err) => {
    console.log(err);
    })
}

countPaginate = () => {
    for (let i = 0; i < this.state.totalPage; i++) {
        //listPageNumb += <li className="page-item"><a className="page-link" href="#">{i+1}</a></li>
        this.state.listPage[i] = i+1;
    }
    console.log(this.state.listPage);
    var listPageJSX = this.state.listPage.slice(this.state.activePage-1,this.state.activePage+3 ).map((item) => {
        return <li className="page-item" onClick={() => this.setState({activePage: item})}><a className="page-link">{item}</a></li>
    }) 
    //console.log(listPageNumb)
    return listPageJSX;
}

renderPaginate= () => {
    if(this.state.activePage==1){
            
        return(
            <ul className="pagination"> 
               
                             {this.countPaginate()}
                             <li className="page-item">
                                 <a className="page-link" onClick={() => this.setState({activePage: this.state.activePage+1})} aria-label="Next"><span aria-hidden="true">&raquo;</span></a>
                             </li>
            </ul>
         )
    }else if(this.state.totalPage2==this.state.activePage  ){
        return(
            <ul className="pagination"> 
                 <li class="page-item">
                                 <a className="page-link" onClick={() => this.setState({activePage: this.state.activePage-1})} aria-label="Previous" ><span aria-hidden="true">&laquo;</span></a>
                             </li>
                             {this.countPaginate()}
                             
            </ul>
         )
    }else{

        return(
            <ul className="pagination"> 
                 <li class="page-item">
                                 <a className="page-link" onClick={() => this.setState({activePage: this.state.activePage-1})} aria-label="Previous" ><span aria-hidden="true">&laquo;</span></a>
                             </li>
                             {this.countPaginate()}
                             <li className="page-item">
                                 <a className="page-link" onClick={() => this.setState({activePage: this.state.activePage+1})} aria-label="Next"><span aria-hidden="true">&raquo;</span></a>
                             </li>
            </ul>
         )
    }
}

renderOrder = () => {

    var { activePage, tampilPerPage } = this.state
    var dataPay = this.state.orderHistory.slice((activePage-1)*tampilPerPage, (activePage*tampilPerPage)).map((item) => {
            return(
                <tr>
                    <td><img src={KONEKSI+item.image}  width="100" height="100"/></td>
                    <td>{item.username}</td>
                    <td>{moment(item.waktu).format('DD/MM/YYYY HH:mm:ss')}</td>
                </tr>
            )
    })

    return dataPay

}


    TotalIncome=()=>{
        console.log(this.state.history)
        var total = 0
        for(let i = 0; i < this.state.history.length; i++){ 
            total +=this.state.history[i].total_bayar; 
        } 
        return total; 
    }


    getHistoryRegister=()=>{
    axios.post(`${KONEKSI}/transaction/getDataRegister`
    ).then((res) => {
    this.setState({ register: res.data});
    console.log(this.state.register)
    }).catch((err) => {
    console.log(err);
    })
    }


    TotalRegister=()=>{
    var total = 0
        for(let i = 0; i < this.state.register.length; i++){ 
            total +=this.state.register[i].total; 
        } 
        return total; 
    }
        getBank=()=>{
        axios.get(`${KONEKSI}/product/getdatabank`
        ).then((res) => {
        this.setState({bank: res.data});
        }).catch((err) => {
        console.log(err);
        })
        }
        // putDataBank=()=>{
        // var bank = this.state.bank.map(item =>{
        // return(
        // <div className="col-md-4">
            // <div className="pl-2 pt-2 mb-3">
                // <p>Bank {item.nama_bank}</p>
                // <p>No Rekening</p>
                // <p>{item.noRek}</p>
                // </div>
            // </div>
        // )
        // })
        // return bank;
        // }
        deleteBank=(id)=>{
        axios.post(`${KONEKSI}/product/deletedatabank`,{
        id
        }
        ).then((res) => {
        this.getBank()
        }).catch((err) => {
        console.log(err);
        })
        }
        renderListJSX = () => {
        var no =1;
        var listJSX = this.state.bank.map(item => {
        if(item.id !== this.state.selectedEditBankId){
        return (
        <tr key={item.id} className="text-wrap" style={{fontSize:'12px'}}>

            <td className="align-middle">{no++}</td>
            <td className="align-middle text-truncate" style={{maxHeight:"20px", maxWidth:"100px"}}>{item.nama_bank}
            </td>
            <td className="align-middle text-danger">{item.noRek}</td>
            <td className="align-middle">{item.atasNama}</td>
            <td>{<img src={`${KONEKSI}${item.gambar}`} width="60px" alt={item.nama_bank} /> }</td>
            <td className="align-middle"><button type="button" className="btn btn-sm btn-warning" onClick={()=>
                    this.setState({selectedEditBankId: item.id})} ><i className="fas fa-edit"></i></button> {' '}<button
                    type="button" className="btn btn-sm btn-danger" onClick={()=> this.deleteBank(item.id)} ><i
                        className="fas fa-trash"></i></button>
            </td>
        </tr>
        )
        }
        return (
        <tr key={item.id} className="text-wrap" style={{fontSize:'12px'}}>
            <input type="hidden" readOnly ref="id" defaultValue={item.id} />
            <td className="align-middle">{no++}</td>

            <td className="align-middle text-truncate" style={{maxHeight:"20px", maxWidth:"100px"}}> <input type="text"
                    ref="nama_bank" placeholder="Bank" defaultValue={item.nama_bank} /></td>
            <td className="align-middle text-danger"><input type="number" ref="noRek" placeholder="Bank"
                    defaultValue={item.noRek} /></td>
            <td><input type="text" ref="atasNama" placeholder="atas nama" defaultValue={item.atasNama} /></td>
            <td>
                <CustomInput type="file" className="form-control form-control-sm" id="AddImage1" name="AddImage1"
                    label={this.state.AddImage} onChange={this.onAddFileImageChange1} />
            </td>
            <td className="align-middle"><button type="button" className="btn btn-sm btn-primary" onClick={()=>
                    this.onBtnSaveEditClick(item.id)} ><i className="far fa-save"></i></button>{' '}
                <button type="button" className="btn btn-sm btn-default border-primary" onClick={()=>
                    this.setState({selectedEditBankId: 0})} ><i className="fas fa-undo-alt"></i></button></td>
        </tr>
        )
        })

        return listJSX;
        }
        onBtnSaveClick=()=>{
        var formData = new FormData()
        // var nama_bank = this.refs.addnama_bank.value;
        // var noRek = this.refs.addnoRek.value;
        // var gambar = this.refs.addgambar.value;
        // var atasNama = this.refs.addatasNama.value;

            var data = {
            nama_bank: this.refs.addnama_bank.value,
            noRek: this.refs.addnoRek.value,
            atasNama: this.refs.addatasNama.value,
            }
            var headers = {
            headers:
            {'Content-Type': 'multipart/form-data'}
            }

            if(document.getElementById('AddImage')){
            formData.append('gambar', document.getElementById('AddImage').files[0])
            }
            formData.append('data', JSON.stringify(data))

            axios.post(`${KONEKSI}/auth/addbank`, formData, headers)
            .then((res) => {
            alert("Bank berhasil ditambah")
                this.getBank()
                this.setState({selectedEditBankId: 0})
            }).catch((err) => {
                console.log(err);
            })
        }
        UpdateBerita=()=>{
        var news = this.refs.addberita.value;
        axios.post(`${KONEKSI}/customer/updatenews`,{
        news
        }).then((res) => {
        alert("Berita berhasil diterbitkan")
        window.location.reload()
        }).catch((err) => {
        console.log(err);
        })
        }
        onBtnSaveEditClick=(id)=>{

        // var nama_bank = this.refs.nama_bank.value;
        // var noRek = this.refs.noRek.value;
        // var gambar = this.refs.gambar.value;
        // var atasNama = this.refs.atasNama.value;
        var formData = new FormData()
        var data = {
        nama_bank: this.refs.nama_bank.value,
        noRek: this.refs.noRek.value,
        atasNama: this.refs.atasNama.value
        }

        var headers = {
        headers:
        {'Content-Type': 'multipart/form-data'}
        }

        if(document.getElementById('AddImage1')){
        formData.append('gambar', document.getElementById('AddImage1').files[0])
        }

        formData.append('data', JSON.stringify(data))

        axios.post(`${KONEKSI}/auth/updatebank/`+ id, formData, headers)
        .then((res) => {
        alert("Bank berhasil diubah")
        this.getBank()
        this.setState({selectedEditBankId: 0})
        }).catch((err) => {
        console.log(err);
        })
        }
        onAddFileImageChange = () => {
        if(document.getElementById("AddImage").files[0] !== undefined) {
        this.setState({AddImage: document.getElementById("AddImage").files[0].name})
        }
        else {
        this.setState({AddImage: 'Unggah Gambar Produk'})
        }
        }
        onAddFileImageChange1 = () => {
        if(document.getElementById("AddImage1").files[0] !== undefined) {
        this.setState({AddImage: document.getElementById("AddImage1").files[0].name})
        }
        else {
        this.setState({AddImage: 'Unggah Gambar Produk'})
        }
        }
        render(){
        console.log(this.state.register)
        const { username, role } = this.props.user;

        if(username !== "" && role === "Admin" ){
        return (
        <div className="container-fluid">
            <div className="row">
                <SidebarAdmin dashboard="aktif" />

                <div className="col-md-10 bg-light pl-3 pt-3">
                    <div className="row text-left">
                        <div className="col-md-3">
                            <div className="card pt-1 pl-2 biru">
                                <p className="text-white">Total Member</p>
                                <div className="pt-2 pb-2">

                                    <span className="float-right pr-4"><svg
                                            class="feather feather-users sc-dnqmqq jxshSx"
                                            xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="9" cy="7" r="4"></circle>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                        </svg> {this.state.agent.length}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card pt-1 pl-2 hijau">
                                <p className="text-white">Total Order</p>
                                <div className="pt-2 pb-2">

                                    <span className="float-right pr-4">
                                        <svg class="feather feather-bar-chart-2 sc-dnqmqq jxshSx"
                                            xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                            <line x1="18" y1="20" x2="18" y2="10"></line>
                                            <line x1="12" y1="20" x2="12" y2="4"></line>
                                            <line x1="6" y1="20" x2="6" y2="14"></line>
                                        </svg> {this.state.listToVerify.length}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card pt-1 pl-2 merah">
                                <p className="text-white">History Order</p>
                                <div className="pt-2 pb-2">

                                    <span className="float-right pr-4">
                                        <svg class="feather feather-archive sc-dnqmqq jxshSx"
                                            xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                            <polyline points="21 8 21 21 3 21 3 8"></polyline>
                                            <rect x="1" y="3" width="22" height="5"></rect>
                                            <line x1="10" y1="12" x2="14" y2="12"></line>
                                        </svg> {this.state.history.length}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card pt-1 pl-2 kuning">
                                <p className="text-white">New Order</p>
                                <div className="pt-2 pb-2">

                                    <span className="float-right pr-4"><svg
                                            class="feather feather-alert-triangle sc-dnqmqq jxshSx"
                                            xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                            <path
                                                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z">
                                            </path>
                                            <line x1="12" y1="9" x2="12" y2="13"></line>
                                            <line x1="12" y1="17" x2="12" y2="17"></line>
                                        </svg> {this.state.newOrder.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card mt-2 text-left">
                        <div className="row">
                            <div className="col-md-6">
                                <p className=" pl-2">Total Register</p>
                                <h1 className="text-center text-danger">Rp {this.TotalRegister().toLocaleString()},-
                                </h1>
                            </div>
                            <div className="col-md-6">
                                <p className=" pl-2">Total Checkout</p>
                                <h1 className="text-center text-danger">Rp {this.TotalIncome().toLocaleString()},-</h1>
                            </div>
                        </div>
                    </div>
                    <div className="card mt-2 text-left">
                        <p className=" pl-2">Bank</p>
                        <div className="">
                            {/* {this.putDataBank()} */}
                            <table className="table table-hover  " style={{fontSize:"12px"}}>
                                <thead className="blue text-white">
                                    <th>No</th>
                                    <th>Nama Bank</th>
                                    <th>Nomer Rekening</th>
                                    <th>Atas Nama</th>
                                    <th>Gambar</th>
                                    <th>Action</th>
                                </thead>
                                <tbody>
                                    {this.renderListJSX()}
                                    <tr className="text-wrap" style={{fontSize:'12px'}}>

                                        <td className="align-middle">#</td>
                                        <td className="align-middle text-truncate"
                                            style={{maxHeight:"20px", maxWidth:"100px"}}> <input type="text"
                                                ref="addnama_bank" placeholder="Bank" /></td>
                                        <td className="align-middle text-danger"><input type="number" ref="addnoRek"
                                                placeholder="Nomer rekening" /></td>
                                        <td><input type="text" ref="addatasNama" placeholder="atas nama" /></td>
                                        {/* <td><input type="text" ref="addgambar" placeholder="Logo" /></td> */}
                                        <td>
                                            <CustomInput type="file" className="form-control form-control-sm"
                                                id="AddImage" name="AddImage" label={this.state.AddImage}
                                                onChange={this.onAddFileImageChange} />
                                        </td>
                                        <td className="align-middle"><button type="button"
                                                className="btn btn-sm btn-warning" onClick={()=>this.onBtnSaveClick()}
                                                >Tambah</button>
                                        </td>

                                    </tr>
                                </tbody>

                            </table>

                        </div>
                    </div>
                    <div className="card text-left mt-2">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <h1>News</h1>
                                    <p className="font-weight-bold">Berita terdahulu</p>
                                    <p>{this.state.news}</p>

                                    <p className="font-weight-bold mt-3">Update berita</p>
                                </div>
                                <div className="col-md-6">
                                    <h2 className="mt-5">History Checkout</h2>
                                </div>
                            </div>
                            <div className="row ">

                                <div className="col-md-6">
                                    <textarea ref="addberita" className="form-control " id="inputDeskripsi"
                                        placeholder="Input berita" rows="3" required style={{height:"150px"}}></textarea>
                                    <button className="btn btn-default orange mt-3"
                                        onClick={this.UpdateBerita}>Terbitkan</button>
                                </div>
                                <div className="col-md-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <table className="table table-bordered text-center">
                                                <tr>
                                                    <th>Gambar</th>
                                                    <th>Agent</th>
                                                    <th>Tanggal</th>
                                                </tr>
                                                {this.renderOrder()}
                                                
                                            </table>
                                            <center>
                                                <div className="row justify-content-md-center align-center mb-4">
                                                    {/* pagination */}
                                                    <nav aria-label="Page navigation example">
                                                    
                                                        {this.renderPaginate()}

                                                    </nav>
                                                </div>
                                            </center>
                                        </div>
                                    </div>
                                </div>

                            </div>
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

        export default connect(mapStateToProps)(HomeAdmin);