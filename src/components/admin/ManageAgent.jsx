import React, { Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import SidebarAdmin from './SidebarAdmin';
import { KONEKSI } from '../../support/config';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Countdown from 'react-countdown-now';
class ManageAgent extends Component{
    state={
        agent:[],
        searchAgent:[],
        agentnew:[],
        searchAgentnew:[],
        imgModal: "",
        bronze:0,
        silver:0,
        gold:0,
        platinum:0,
        activePage: 1, 
        tampilPerPage: 10, 
        totalItem: 0, 
        totalPage: 0, 
        startIndex: 0, 
        finishIndex: 0,
        listPage:[],
        activePage2: 1, 
        tampilPerPage2: 10, 
        totalItem2: 0, 
        totalPage2: 0, 
        startIndex2: 0, 
        finishIndex2: 0,
        listPage2:[],
        datas: [],
        modal2: false,
    }
    componentDidMount(){
        this.getAgentdata()
        this.getagentregisterdata()
        this.getPaket()
    }
    getPaket = () => {
        axios.get(`${KONEKSI}/transaction/paket`
        ).then((res) => {
            console.log(res.data[0].harga)
            this.setState({
                bronze: res.data[0].harga,
                silver: res.data[1].harga,
                gold:res.data[2].harga,
                platinum:res.data[3].harga
            });   
                   
        }).catch((err) => {
            console.log(err);
        })
    }
    getAgentdata=()=>{
        axios.get(`${KONEKSI}/auth/getagentlist`
        ).then((res) => {
            this.setState({agent: res.data, searchAgent: res.data}); 
            console.log(this.state.agent)    
            this.setState({totalItem: this.state.agent.length});
            this.setState({totalPage: Math.ceil(this.state.totalItem / this.state.tampilPerPage)})       
        }).catch((err) => {
            console.log(err);
        })
    }
    getagentregisterdata=()=>{
        axios.get(`${KONEKSI}/auth/getagentregisterdata`
        ).then((res) => {
            this.setState({agentnew: res.data, searchAgentnew: res.data}); 
            console.log(this.state.agentnew) 
            this.setState({totalItem2: this.state.agentnew.length});
            this.setState({totalPage2: Math.ceil(this.state.totalItem2 / this.state.tampilPerPage2)})       
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
    renderPagination3=()=>{
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
    renderPagination2 = () => {
        //this.setState({listPage: []})
        for (let i = 0; i < this.state.totalPage2; i++) {
                //listPageNumb += <li className="page-item"><a className="page-link" href="#">{i+1}</a></li>
                this.state.listPage2[i] = i+1;
        }
        console.log(this.state.listPage2);
        var listPageJSX = this.state.listPage2.map((item) => {
            return <li className="page-item" onClick={() => this.setState({activePage2: item})}><button className="page-link" href="#">{item}</button></li>
        }) 
        //console.log(listPageNumb)
        return listPageJSX;
    }


    toggle2 = () => {
        this.setState(prevState => ({
          modal2: !prevState.modal2
        }));
    }
    
    renderModal2 = (item) => {
        this.setState({datas: item})
        this.toggle2()
    }


    putAgentActive=()=>{
        var { activePage, tampilPerPage } = this.state

        const renderer = ({days, hours, minutes, seconds, completed }) => {
            if (completed) {
                // Render a completed state
                return <span>Member telah habis</span>

            } else {
                // Render a countdown
                return <span>{days}D {hours}:{minutes}:{seconds}</span>;   
            }
        };

        
       const data = this.state.agent.slice( (activePage-1)*tampilPerPage, (activePage*tampilPerPage)).map(item=>{
        return(
            <tbody>
                <td scope="col">{item.id_agent}</td>
                <td scope="col">{item.fullname}</td>
                <td scope="col">{item.username}</td>
                <td scope="col">{item.email}</td>
                <td scope="col">{item.phone}</td>
                <td scope="col">{item.companyName}</td>
                <td scope="col">{item.level}</td>
                <td scope="col"><Countdown date={item.lastmember} renderer={renderer}/></td>
                <td scope="col"><button className="btn btn-warning" onClick={() => this.renderModal2(item)}><i className="fa fa-edit"></i></button></td>
                {/* <td scope="col"><button className='btn btn-success'><i className="fa fa-search"/></button></td> */}
            </tbody>
            )
       })
       return data
    }
    toggle = () => {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
    }
    onBtnAddClick=(id,total)=>{
        console.log(id,total)
       console.log(this.state.gold)
        var bronze = parseInt(this.state.bronze*1.1);
        var silver = parseInt(this.state.silver*1.1);
        var gold = parseInt(this.state.gold*1.1)
        var platinum = parseInt(this.state.platinum*1.1);
        console.log(silver,gold,platinum)
        if(bronze == total){
            var level = 'BRONZE'
        }else if(silver == total){
            var level = 'SILVER'
        }else if(gold == total){
            var level = 'GOLD'
        }else if(platinum == total){
            var level = 'PLATINUM'
        }
        axios.post(`${KONEKSI}/auth/updatelevel`, {id,level}
        ).then((res) => { 
            alert("User berhasil di update")
            console.log(res.data); 
            this.getAgentdata()
            this.getagentregisterdata()
        })
        .catch((err) =>{
            console.log(err)
        })
    }
    renderModal = (item) => {
        this.setState({imgModal: item.image})
        this.toggle()
    }
    putAgentNew=()=>{
        var { activePage2, tampilPerPage2 } = this.state
        const data = this.state.agentnew.slice( (activePage2-1)*tampilPerPage2, (activePage2*tampilPerPage2)).map(item=>{
         return(
             <tbody>
                 <tr key={item.id_agent} className="text-wrap"  style={{fontSize:'12px'}}> 
                 <td scope="col">{item.id_agent}</td>
                 <td scope="col">{item.fullname}</td>
                 <td scope="col">{item.email}</td>
                 <td scope="col">{item.phone}</td>
                 <td scope="col">{item.companyName}</td>
                 <td>{<img src={KONEKSI+item.image} width="60px" alt={item.judul} onClick={() => this.renderModal(item)} /> }</td>
                 <td scope="col">Rp {item.total.toLocaleString()}</td>
                 {/* <td scope="col">
                 <select class="custom-select" ref="addStatus" id='status'>
                    
                    <option  selected>Pilih status</option>
                    <option value="SILVER">Silver</option>
                    <option  value="GOLD">Golden</option>
                    <option value="PLATINUM">Platinum</option>
                </select>
                
                 </td> */}
                 <td scope="col"><button className='btn btn-default orange' onClick={()=>this.onBtnAddClick(item.id_agent,item.total)}>Update</button></td>
                </tr>
             </tbody>
             )
        })
        return data
     }

     upgradeLevel = (agent) => {

        var level = this.refs.level.value
        var agent = agent
        
        axios.post(`${KONEKSI}/auth/updatelevel`, {
            id: agent,
            level: level
        })
        .then((res) => {
            window.location.reload()
        }).catch((err) => {
            console.log(err)
        })


     }


    render(){
        const { username, role } = this.props.user;
        console.log(this.state.modal2)
        var { datas } = this.state
        if(username !== "" && role === "Admin" ){
            return(
                <div className="container-fluid">
                    <div className="row">
                        <SidebarAdmin manageagent="aktif"/>

                        <div className="col-md-10 bg-light pl-3 pt-3">
                            <div className="alert blue media col-12">
                                {/* <img className="img img-fluid" src="http://localhost:3000/images/flat/031-graph.png" width="90px" alt="manage user"/> */}
                                <div className="col-md-12 media-body">
                                    <h4>Manage Member</h4>
                                    {/* <p> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Beatae, cupiditate minima similique quaerat nulla iusto dolorem quam asperiores ratione ex tempore in nemo harum consequatur fuga necessitatibus voluptatem sint dolor. </p> */}
                                </div>
                            </div>
                        <div className='card border col-12 pt-2 pb-2 mb-4'>
                        <table className="table table-hover">
                                <thead className="blue text-white">
                                    <tr>
                                        <th scope="col">ID Member</th>
                                        <th scope="col">Nama Member</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Contact</th>
                                        <th scope="col">Company Name</th>
                                        <th scope="col">Payment</th>
                                        <th scope="col">total payment</th>
                                        {/* <th scope="col">status</th> */}
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                              {this.putAgentNew()}
                              <div>
                                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                                <ModalHeader toggle={this.toggle}>Bukti Pembayaran</ModalHeader>
                                <ModalBody className="text-center">
                                    <img className="img img-fluid img-responsive" src={KONEKSI+this.state.imgModal} height="350px" alt="admin order to verify"/>
                                </ModalBody>
                                <ModalFooter>
                                    <p className="text-danger">Mohon teliti sebelum approve pembayaran</p>
                                    <Button color="success" onClick={this.toggle}>Keluar</Button>
                                </ModalFooter>
                                </Modal>


                                {/* EDIT AGENT */}
                                <Modal isOpen={this.state.modal2} toggle={this.toggle2}>
                                <ModalHeader toggle={this.toggle2}>Editing | <span className="text-primary">{datas.fullname}</span></ModalHeader>
                                <ModalBody className="text-center">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="alert alert-warning text-left">
                                                    <i className="fa fa-warning"></i> You are now editing member "{datas.fullname}"
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <form action="">
                                                    <div className="form-group">
                                                        <select className="form-control" ref="level">
                                                            <option value="BRONZE">BRONZE</option>
                                                            <option value="SILVER">SILVER</option>
                                                            <option value="GOLD">GOLD</option>
                                                            <option value="PLATINUM">PLATINUM</option>
                                                        </select>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="success" onClick={() => this.upgradeLevel(datas.id_agent)}>Update</Button>
                                    <Button color="danger" onClick={this.toggle2}>Keluar</Button>
                                </ModalFooter>
                                </Modal>
                            </div> 
                            </table>
                            <center>

<div className="row justify-content-md-center align-center">
    {/* pagination */}
    <nav aria-label="Page navigation example">
        <ul className="pagination">
            {/* <li class="page-item">
                <a className="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>
            </li> */}
            {this.renderPagination2()}
            {/* <li className="page-item">
                <a className="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>
            </li> */}
        </ul>
    </nav>
</div>
</center>
                        </div>
                            <hr/>
                            <div className="card border col-12 pt-2 pb-2">
                                    <h5 className="text-secondary text-left mt-1">Active Member</h5><hr />
                            <table className="table table-hover">
                                <thead className="blue text-white">
                                    <tr>
                                        <th scope="col">ID Member</th>
                                        <th scope="col">Nama Member</th>
                                        <th scope="col">Username</th>
                                        <th scope="col" >Email</th>
                                        <th scope="col">Contact</th>
                                        <th scope="col">Company Name</th>
                                        <th scope="col">Level</th>
                                        <th scope="col">Days Left</th>
                                        <th scope="col">Action</th>
                                        {/* <th scope="col"></th> */}
                                    </tr>
                                </thead>
                               
                                    {this.putAgentActive()}
                               
                            </table>
                            <center>

<div className="row justify-content-md-center align-center">
    {/* pagination */}
    <nav aria-label="Page navigation example">
       
            {this.renderPagination3()}
           
    </nav>
</div>
</center>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // kalau bukan admin, redirect ke Home
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

export default connect(mapStateToProps)(ManageAgent);