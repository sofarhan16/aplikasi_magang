import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import SidebarAdmin from './SidebarAdmin';
import axios from 'axios';
import moment, { now } from 'moment';
import { KONEKSI } from '../../support/config';
import DetailOrder from './detailOrderTransaction';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class ReportAdmin extends Component {
    state = { listOrder: [],
        selectedRow:0,
        activePage: 1, 
        tampilPerPage: 5, 
        totalItem: 0, 
        totalPage: 0, 
        startIndex: 0, 
        finishIndex: 0, 
        listPage: [],
        dropdownOpen: 0,
        status:''
    
    }

  toggle(id_transaksi) {
    this.setState({
      dropdownOpen: id_transaksi
    });
  }
  
    componentDidMount() {
        this.toggle = this.toggle.bind(this);
        this.getListOrder();
        this.handleChange = this.handleChange.bind(this);
    }
    getListOrder = () => {
        axios.post(`${KONEKSI}/transaction/getdataorder`
        ).then((res) => {
            this.setState({ listOrder: res.data, selectedRow: 0 });
            console.log(this.state.listOrder)
            this.setState({totalItem: this.state.listOrder.length});
            this.setState({totalPage: Math.ceil(this.state.totalItem / this.state.tampilPerPage)})  
        }).catch((err) => {
            console.log(err);
        })
    }
    renderPagination = () => {
        //this.setState({listPage: []})
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
    renderPagination2=()=>{
        if(this.state.activePage==1){
            
            return(
                <ul className="pagination"> 
                   
                                 {this.renderPagination()}
                                 <li className="page-item">
                                     <a className="page-link" onClick={() => this.setState({activePage: this.state.activePage+1})} aria-label="Next"><span aria-hidden="true">&raquo;</span></a>
                                 </li>
                </ul>
             )
        }else if(this.state.totalPage==this.state.activePage  ){
            return(
                <ul className="pagination"> 
                     <li class="page-item">
                                     <a className="page-link" onClick={() => this.setState({activePage: this.state.activePage-1})} aria-label="Previous" ><span aria-hidden="true">&laquo;</span></a>
                                 </li>
                                 {this.renderPagination()}
                                 
                </ul>
             )
        }else{
            console.log(this.state.totalPage)
            return(
                <ul className="pagination"> 
                     <li class="page-item">
                                     <a className="page-link" onClick={() => this.setState({activePage: this.state.activePage-1})} aria-label="Previous" ><span aria-hidden="true">&laquo;</span></a>
                                 </li>
                                 {this.renderPagination()}
                                 <li className="page-item">
                                     <a className="page-link" onClick={() => this.setState({activePage: this.state.activePage+1})} aria-label="Next"><span aria-hidden="true">&raquo;</span></a>
                                 </li>
                </ul>
             )
        }
    }
    onBtnStatus=({item})=>{
       
        if(window.confirm('Are you sure all products in this transaction is ready to send?')){
            var waktu = moment(new Date()).format('YYYY-MM-MM HH:mm:ss')
            // console.log(waktu.toLocaleTimeString())
            axios.post(`${KONEKSI}/transaction/sendstatus`, {
                id_transaksi: item.id_transaksi,is_finished:this.state.status,waktu
            }).then((res) => {
                console.log(res.data)
                alert(`Pesanan ${item.id_transaksi} semua ${this.state.status}!`)
                this.getListOrder()
            }).catch((err) => {
                console.log(err);
            })
        }
    }
    handleChange(event) {
        // alert(event.target.value)
        console.log(event.target.value)
        // console.log(event.target.id)
        this.setState({status: event.target.value});
      }
    renderListJSX = () => {
        var { activePage, tampilPerPage } = this.state
        var listJSX = this.state.listOrder.slice( (activePage-1)*tampilPerPage, (activePage*tampilPerPage)).map(item => {
            var id_transaksi = item.id_transaksi
            var comment= "qaa"
            return (
                <tr key={item.id_transaksi} className="text-wrap" style={{fontSize:'12px'}}>                        
                    <td className="align-middle">{item.id_transaksi}</td>
                    <td className="align-middle">{item.username}</td>
                    <td className="align-middle text-danger">Rp. {item.total_bayar.toLocaleString()}</td>
                    <td className="align-middle">{moment(item.waktu_transaksi).format('DD/MM/YYYY HH:mm:ss')}</td>
                    <td className="align-middle"><button type="button" className="btn btn-success" onClick={() => this.setState({selectedRow:item.id_transaksi})}   ><i class="fas fa-search"></i></button></td>
                    <td className="align-middle">
                        <select class="form-control form-control-sm" onChange={this.handleChange}>
                        <option selected disabled hidden>{item.is_finished}</option>
                             <option value="Barang dalam proses pembelian" >Barang dalam proses pembelian</option>
                             <option value="Barang digudang overseas warehousenesia" >Barang digudang overseas warehousenesia</option>
                             <option value="Barang siap dikirim ke Indonesia" >Barang siap dikirim ke Indonesia</option>
                             <option value="Barang sampai digudang bea cukai Indonesia" >Barang sampai digudang bea cukai Indonesia</option>
                             <option value="Barang dan dokumen dalam proses cukai" >Barang dan dokumen dalam proses cukai</option>
                             <option value="Release by custom" >Release by custom</option>
                             <option value="Transit gudang Warehousenesia Indonesia" >Transit gudang Warehousenesia Indonesia</option>
                             <option value="Delivery local service" >Delivery local service</option>
                             <option value="Release by custom" >Release by custom</option>
                             <option value="Pesanan selesai" >Pesanan selesai</option>
                           
                        </select>
                    </td>
                    <td className="align-middle"> <button type="button" className="btn btn-success btn-sm" onClick={() => this.onBtnStatus({item})}>Simpan status</button></td>
                    <td className="align-middle">{item.is_finished}</td>
                    <td className="align-middle"><a href={`/invoicecustomer?id=${item.id_transaksi}`}><button type="button" className="btn btn-success"><i class="fa fa-file" aria-hidden="true"></i></button></a></td>
                   
                </tr>
            )         
        })

        return listJSX;
    }
    backButton=()=>{
        if(this.state.selectedRow!= 0){
            return <button className="btn btn-default orange float-left my-3" onClick={()=>this.setState({selectedRow:0})}>back</button>
        }
    }
    renderPage=()=>{
        if(this.state.selectedRow== 0){
            return(
                <div className="row">
                <div className="card mt-2 shadow col-lg-12 pl-0 pr-0 ">
                   
                    <div className="card-body">
                        <table className="table table-hover">
                            <thead className="blue text-white"> 
                                <tr>
                                    <th scope="col">ID Transaksi</th>
                                    <th scope="col">Nama Buyer</th>
                                    <th scope="col">Total Pembayaran</th>
                                    <th scope="col">Waktu Transaksi</th>
                                    <th scope="col">Detail Transaksi</th>
                                    <th scope="col">Ubah status</th>
                                    <th scope="col">Action	</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Invoice</th>
                                    
                                   
                                </tr>
                            </thead>
                           
                            {this.renderListJSX()}
                            
                        </table>
                    </div>
                </div>
            </div>
            )
        }else{
            console.log("masuk")
            return <DetailOrder id={this.state.selectedRow}/>
        }
        
    }
    render() {
        const { username, role } = this.props.user;

        if(username !== "" && role === "Admin" ){
            return(
                <div className="container-fluid">
                    <div className="row">
                        <SidebarAdmin report="aktif"/>

                        <div className="col-md-10 bg-light pl-3 pt-3">
                            <div className="alert blue font-templates media col-12">
                                {/* <img className="img img-fluid" src="http://localhost:3000/images/flat/003-check.png" width="90px" alt="admin order to verify"/> */}
                                <div className="col-md-12  media-body">
                                    <h4>Report orders</h4>
                                    {/* <p> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Beatae, cupiditate minima similique quaerat nulla iusto dolorem quam asperiores ratione ex tempore in nemo harum consequatur fuga necessitatibus voluptatem sint dolor. </p> */}
                                </div>
                                {this.backButton()}
                            </div>
                            
                            {this.renderPage()}
                            <center>

<div className="row justify-content-md-center align-center">
    {/* pagination */}
    <nav aria-label="Page navigation example">
        
            {this.renderPagination2()}
            
    </nav>
</div>
</center>
                        </div>
                    </div>
                </div>
            );
        }

        return <Redirect to="/" />
    }
}

const mapStateToProps = (state) => {
    return { 
        user: state.auth
    };
}

export default connect(mapStateToProps)(ReportAdmin);