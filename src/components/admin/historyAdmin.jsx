import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import SidebarAdmin from './SidebarAdmin';
import axios from 'axios';
import moment from 'moment';
import { KONEKSI } from '../../support/config';
import DetailOrder from './detailOrderTransaction';

class HistoryAdmin extends Component {
    state = { listOrder: [],
        selectedRow:0,
        activePage: 1, 
        tampilPerPage: 10, 
        totalItem: 0, 
        totalPage: 0, 
        startIndex: 0, 
        finishIndex: 0, 
        listPage: [],
        
    }

    componentDidMount() {
        this.getListOrder();
    }
    getListOrder = () => {
        axios.post(`${KONEKSI}/transaction/getdataorderhistory`
        ).then((res) => {
            this.setState({ listOrder: res.data, selectedRow: 0 });
            console.log(this.state.listOrder)
            this.setState({totalItem: this.state.listOrder.length});
            this.setState({totalPage: Math.ceil(this.state.totalItem / this.state.tampilPerPage)})   
        }).catch((err) => {
            console.log(err);
        })
    }
   
    onBtnStatus=(item)=>{
        if(window.confirm('Are you sure all products in this transaction is ready to Done?')){
            axios.post(`${KONEKSI}/transaction/sendstatus2`, {
                id_transaksi: item.id_transaksi
            }).then((res) => {
                console.log(res.data)
                alert(`all products in ID Trx: ${item.id_transaksi} have been Done!`)
                this.getListOrder()
            }).catch((err) => {
                console.log(err);
            })
        }
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
    renderListJSX = () => {
        var { activePage, tampilPerPage } = this.state
        //var srcgambar = `${KONEKSI}/images/book`; 
        var listJSX = this.state.listOrder.slice( (activePage-1)*tampilPerPage, (activePage*tampilPerPage)).map(item => {
            return (
                <tr key={item.id_transaksi} className="text-wrap" style={{fontSize:'12px'}}>                        
                    <td className="align-middle">{item.id_transaksi}</td>
                    <td className="align-middle">{item.username}</td>
                    <td className="align-middle text-danger">Rp. {item.total_bayar.toLocaleString()}</td>
                    <td className="align-middle">{moment(item.waktu_transaksi).format('DD/MM/YYYY HH:mm:ss')}</td>
                    <td className="align-middle"><button type="button" className="btn btn-success" onClick={() => this.setState({selectedRow:item.id_transaksi})}   ><i class="fas fa-search"></i></button></td>
                    <td className="align-middle">{item.is_finished}</td>
                    <td className="align-middle">
                        <button type="button" className="btn btn-success" onClick={() => this.onBtnStatus(item)}>Selesaikan pesanan <i class="fas fa-check"></i></button>
                    </td>
                </tr>
            )         
        })

        return listJSX;
    }
    renderPage=()=>{
        if(this.state.selectedRow== 0){
            return(
                <table className="table table-hover">
                                <thead className="blue text-white">
                                    <tr>
                                        <th scope="col">ID Trx</th>
                                        <th scope="col">Buyer</th>
                                        <th scope="col">Total Bayar</th>
                                        <th scope="col">Waktu Transaksi</th>
                                        <th scope="col">Detail Transaksi</th>
                                        <th scope="col">status</th>
                                        <th colSpan="2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderListJSX()}
                                </tbody>
                            </table>

            )
        }else{
            console.log("masuk")
            return <DetailOrder id={this.state.selectedRow}/>
        }
    }
    buttonDetail=()=>{
        var month = this.refs.month.value
        var year = this.refs.year.value
        console.log(month,year)
        if(month != '' && year != ''){
            window.location=`/admin/reportmonth?month=${month}&&year=${year}`
        }else{
            alert('tidak boleh kosong')
        }
       
    }
    backButton=()=>{
        if(this.state.selectedRow!= 0){
            return <button className="btn btn-default orange float-left my-3" onClick={()=>this.setState({selectedRow:0})}>back</button>
        }
    }
    render() {
        const { username, role } = this.props.user;

        if(username !== "" && role === "Admin" ){
            return(
                <div className="container-fluid">
                    <div className="row">
                        <SidebarAdmin history="aktif"/>

                        <div className="col-md-10 bg-light pl-3 pt-3">
                            <div className="alert blue media col-12">
                                {/* <img className="img img-fluid" src="http://localhost:3000/images/flat/003-check.png" width="90px" alt="admin order to verify"/> */}
                                <div className="col-md-12 media-body text-white">
                                    <h4>History orders</h4>
                                    {/* <p> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Beatae, cupiditate minima similique quaerat nulla iusto dolorem quam asperiores ratione ex tempore in nemo harum consequatur fuga necessitatibus voluptatem sint dolor. </p> */}
                                </div>
                            </div>
                          <div className="row">
                            <div className="col-6">
                            <p>Month: </p>
                            <input type="number" ref="month" name="month" class="form-control" min={1} max={12} />
                            </div>
                            <div className="col-6">
                        
                            <p>Year: </p>
                            <input type="number" ref="year" name="year" class="form-control" min={2019}/>
                            </div>
                          </div>
                          
                         <button type="button" className="btn btn-default orange col-lg-6  my-3 ml-1" onClick={()=>this.buttonDetail()}><i class="fas fa-search"></i> Cek report excel perbulan</button>
                         {this.backButton()}
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

export default connect(mapStateToProps)(HistoryAdmin);