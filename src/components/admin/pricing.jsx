import React, { Component} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import SidebarAdmin from './SidebarAdmin';
import { KONEKSI } from '../../support/config';
import axios from 'axios';
class Pricing extends Component {
    state = {
        kategori:[],
        selectedEdit:0, 
        curency:[],
        dollaredit:0,
        paket:[],
        paketedit:0,
        descedit:0, 
        transaction:[],
        transactionedit:0,
        shipping:[],
        shippingedit:0,
        dataConvert: []
    }

    componentDidMount(){
        this.getCukai();
        this.getCurency();
        this.getPaket();
        this.getTransactionfee();
        this.getShipping();
        this.getConvert()
    }

    getConvert = () => {

        axios.get(`${KONEKSI}/transaction/getConvert`)
        .then((res) => {
            this.setState({dataConvert: res.data})
        }).catch((err) => {
            console.log(err)
        })

    }

    getTransactionfee=()=>{
        axios.get(`${KONEKSI}/transaction/transactionfee`
        ).then((res) => {
            this.setState({ 
                transaction: res.data,
                transactionedit:0
            });
            console.log(this.state.transaction)
        }).catch((err) => {
            console.log(err);
        })
    }
    getCukai = () => {
        axios.get(`${KONEKSI}/transaction/cukai`
        ).then((res) => {
            this.setState({kategori: res.data});   
            console.log(this.state.kategori)        
        }).catch((err) => {
            console.log(err);
        })
    }
    getCurency = () => {
        axios.get(`${KONEKSI}/transaction/curency`
        ).then((res) => {
            this.setState({curency: res.data,dollaredit:0});   
            console.log(this.state.kategori)        
        }).catch((err) => {
            console.log(err);
        })
    }
    getPaket = () => {
        axios.get(`${KONEKSI}/transaction/paket`
        ).then((res) => {
            this.setState({paket: res.data,paketedit:0});   
            console.log(this.state.kategori)        
        }).catch((err) => {
            console.log(err);
        })
    }
    getShipping=()=>{
        axios.get(`${KONEKSI}/transaction/shipping`
        ).then((res) => {
            this.setState({ 
                shipping:res.data
            });
        }).catch((err) => {
            console.log(err);
        })
    }
    onBtnAddClick=()=>{
        var nama= this.refs.addNama.value
        axios.post(`${KONEKSI}/product/addcategory`,{
            nama
        }).then((res) => {
            alert("Kategori Berhasil Ditambah!")
            this.getListCategory()
        })
        .catch((err) =>{
            console.log(err)
        })
    }
    onBtnSaveCukaiClick = () => {
        var bea_masuk= this.refs.editBeamasuk.value
        var PPN = this.refs.editPPN.value
        var PPnBM = this.refs.editPPnBM.value
        var pungutan = this.refs.editPungutan.value
        var PPh = this.refs.editPPh.value
        
        axios.post(`${KONEKSI}/transaction/cukaiedit`,{
            bea_masuk,PPN,PPh,PPnBM,pungutan
        }).then((res) => {
            alert("Data Cukai Berhasil Diedit!")
            this.getCukai();
            this.setState({selectedEdit:0})
        })
        .catch((err) =>{
            console.log(err)
        })
    }
   
    onBtnSaveCurency = (id) => {
        var dollar = this.refs.editDollar.value
        var bronze = this.refs.editBronze.value
        var silver =this.refs.editSilver.value
        var gold =this.refs.editGold.value
        var platinum =this.refs.editPlatinum.value
        axios.post(`${KONEKSI}/transaction/curencyedit`,{
            bronze, dollar,silver,gold,platinum, id: id
        }).then((res) => {
            alert("Currency Berhasil Diedit!")
            this.getCurency();
            this.setState({dollaredit:0})
        })
        .catch((err) =>{
            console.log(err)
        })
    }
    onBtnSaveTransaction = () => {
        var bronze = this.refs.editBronze.value
        var silver =this.refs.editSilver.value
        var gold =this.refs.editGold.value
        var platinum =this.refs.editPlatinum.value
        axios.post(`${KONEKSI}/transaction/transationedit`,{
            bronze,silver,gold,platinum
        }).then((res) => {
            alert("Transaction Berhasil Diedit!")
            this.getTransactionfee();
            this.setState({transactionedit:0})
        })
        .catch((err) =>{
            console.log(err)
        })
    }
    onBtnSaveShipping = (id_negara) => {
        var bronze = this.refs.editBronze.value
        var silver =this.refs.editSilver.value
        var gold =this.refs.editGold.value
        var platinum =this.refs.editPlatinum.value
        axios.post(`${KONEKSI}/transaction/shippingedit`,{
            bronze, id_negara,silver,gold,platinum
        }).then((res) => {
            alert("Shipping fee Berhasil Diedit!")
            this.getShipping();
            this.setState({shippingedit:0})
        })
        .catch((err) =>{
            console.log(err)
        })
    }
    onBtnSavePaket = (id) => {
        var nama= this.refs.editNama.value
        var harga = this.refs.editHarga.value
        var price = this.refs.editHargaTulis.value
        
        axios.post(`${KONEKSI}/transaction/paketedit`,{
           id,nama,harga,price
        }).then((res) => {
            alert("Paket"+nama+"Berhasil Diedit!")
            this.getPaket();
            this.setState({paketedit:0})
        })
        .catch((err) =>{
            console.log(err)
        })
    }
    onBtnDescSavePaket = (id) => {
        var detail1= this.refs.editList1.value
        var detail2= this.refs.editList2.value
        var detail3= this.refs.editList3.value
        var detail4= this.refs.editList4.value
        var detail5= this.refs.editList5.value
       
        
        axios.post(`${KONEKSI}/transaction/descpaketedit`,{
           id,detail1,detail2,detail3,detail4,detail5
        }).then((res) => {
            alert("Paket berhasil Diedit!")
            this.getPaket();
            this.setState({descedit:0})
        })
        .catch((err) =>{
            console.log(err)
        })
    }
   
    renderListJSX = () => {
        //var srcgambar = `${KONEKSI}/images/book`;
        var listJSX = this.state.kategori.map(item => {
            if(item.id !== this.state.selectedEdit){
                return (
                    <tr key={item.id} className="text-wrap text-center" style={{fontSize:'12px'}}>                        
                        <td className="align-middle ">{item.bea_masuk}%</td>
                        <td className="align-middle">{item.PPN}%</td>
                        <td className="align-middle">{item.PPh}%</td>
                        <td className="align-middle">{item.PPnBM}%</td>
                        <td className="align-middle">$ {item.pungutan}</td>
                        <td className="align-middle"><button type="button" className="btn btn-sm btn-warning" onClick={() => this.setState({selectedEdit: item.id})} ><i className="fas fa-edit"></i></button></td>
                    </tr>
                )
            }
            return (
                <tr key={item.id} className="text-wrap"  style={{fontSize:'12px'}}>                    
                    <td className="align-middle"><input type="number" ref="editBeamasuk" placeholder="bea masuk" className="form-control form-control-sm" defaultValue={item.bea_masuk} /></td>
                    <td className="align-middle"><input type="number" ref="editPPN" placeholder="PPN" className="form-control form-control-sm" defaultValue={item.PPN} /></td>
                    <td className="align-middle"><input type="number" ref="editPPh" placeholder="PPh" className="form-control form-control-sm" defaultValue={item.PPh} /></td>
                    <td className="align-middle"><input type="number" ref="editPPnBM" placeholder="PPnBM" className="form-control form-control-sm" defaultValue={item.PPnBM} /></td>
                    <td className="align-middle"><input type="number" ref="editPungutan" placeholder="Pungutan" className="form-control form-control-sm" defaultValue={item.pungutan} /></td>
                    <td className="align-middle"><button type="button" className="btn btn-sm btn-primary" onClick={() => this.onBtnSaveCukaiClick()} ><i className="far fa-save"></i></button>{' '}
                    <button type="button" className="btn btn-sm btn-default border-primary" onClick={() => this.setState({selectedEdit: 0})} ><i className="fas fa-undo-alt"></i></button></td>
                </tr>
            )
        })

        return listJSX;
    }


    dollarCurency = () => {
        var listJSX = this.state.curency.map(item => {
            if(item.id !== this.state.dollaredit){
                return (
                    <tr key={item.id} className="text-wrap text-center" style={{fontSize:'12px'}}>                        
                        <td className="align-middle ">$ 1</td>
                        <td className="align-middle ">{item.negara != null ? item.negara : "Indonesia"}</td>
                        <td className="align-middle">{item.dollar}</td>
                        <td className="align-middle"> {item.bronze}%</td>
                        <td className="align-middle"> {item.silver}%</td>
                        <td className="align-middle"> {item.gold}%</td>
                        <td className="align-middle"> {item.platinum}%</td>
                        <td className="align-middle"><button type="button" className="btn btn-sm btn-warning" onClick={() => this.setState({dollaredit: item.id})} ><i className="fas fa-edit"></i></button></td>
                    </tr>
                )
            }
            return (
                <tr key={item.isbn} className="text-wrap"  style={{fontSize:'12px'}}>                    
                   <td className="align-middle ">$ 1</td>
                   <td className="align-middle ">{item.negara != null ? item.negara : "Indonesia"}</td>
                    <td className="align-middle"><input type="number" ref="editDollar" placeholder="harga rupiah" className="form-control form-control-sm" defaultValue={item.dollar} /></td>
                    <td className="align-middle"><input type="number" ref="editBronze" placeholder="harga dollar" className="form-control form-control-sm" defaultValue={item.bronze} /></td>
                    <td className="align-middle"><input type="number" ref="editSilver" placeholder="harga dollar" className="form-control form-control-sm" defaultValue={item.silver} /></td>
                    <td className="align-middle"><input type="number" ref="editGold" placeholder="harga dollar" className="form-control form-control-sm" defaultValue={item.gold} /></td>
                    <td className="align-middle"><input type="number" ref="editPlatinum" placeholder="harga dollar" className="form-control form-control-sm" defaultValue={item.platinum} /></td>
                    <td className="align-middle"><button type="button" className="btn btn-sm btn-primary" onClick={() => this.onBtnSaveCurency(item.id_curr)} ><i className="far fa-save"></i></button>
                    <button type="button" className="btn btn-sm btn-default border-primary" onClick={() => this.setState({dollaredit: 0})} ><i className="fas fa-undo-alt"></i></button></td>
                </tr>
            )
        })

        return listJSX;
        
           
    }
    puttransactionfee = () => {
        var listJSX = this.state.transaction.map(item => {
            if(item.id !== this.state.transactionedit){
                return (
                    <tr key={item.id} className="text-wrap text-center" style={{fontSize:'12px'}}>                      
                        <td className="align-middle"> {item.bronze}%</td>
                        <td className="align-middle"> {item.silver}%</td>
                        <td className="align-middle"> {item.gold}%</td>
                        <td className="align-middle"> {item.platinum}%</td>
                        <td className="align-middle"><button type="button" className="btn btn-sm btn-warning" onClick={() => this.setState({transactionedit: item.id})} ><i className="fas fa-edit"></i></button></td>
                    </tr>
                )
            }
            return (
                <tr key={item.id} className="text-wrap"  style={{fontSize:'12px'}}>                    
                    <td className="align-middle"><input type="number" ref="editBronze" placeholder="harga dollar" className="form-control form-control-sm" defaultValue={item.bronze} /></td>
                    <td className="align-middle"><input type="number" ref="editSilver" placeholder="harga dollar" className="form-control form-control-sm" defaultValue={item.silver} /></td>
                    <td className="align-middle"><input type="number" ref="editGold" placeholder="harga dollar" className="form-control form-control-sm" defaultValue={item.gold} /></td>
                    <td className="align-middle"><input type="number" ref="editPlatinum" placeholder="harga dollar" className="form-control form-control-sm" defaultValue={item.platinum} /></td>
                    <td className="align-middle"><button type="button" className="btn btn-sm btn-primary" onClick={() => this.onBtnSaveTransaction()} ><i className="far fa-save"></i></button>{' '}
                    <button type="button" className="btn btn-sm btn-default border-primary" onClick={() => this.setState({transactionedit: 0})} ><i className="fas fa-undo-alt"></i></button></td>
                </tr>
            )
        })

        return listJSX;
        
           
    }
    putshippingfee = () => {
        var listJSX = this.state.shipping.map(item => {
            if(item.id !== this.state.shippingedit){
                return (
                    <tr key={item.id} className="text-wrap text-center" style={{fontSize:'12px'}}>                      
                       <td className="align-middle">{item.kode}</td>
                        <td className="align-middle">$ {item.bronze} /kg</td>
                        <td className="align-middle">$ {item.silver} /kg</td>
                        <td className="align-middle">$ {item.gold} /kg</td>
                        <td className="align-middle">$ {item.platinum} /kg</td>
                        <td className="align-middle"><button type="button" className="btn btn-sm btn-warning" onClick={() => this.setState({shippingedit: item.id})} ><i className="fas fa-edit"></i></button></td>
                    </tr>
                )
            }
            return (
                <tr key={item.isbn} className="text-wrap"  style={{fontSize:'12px'}}> 
                     <td className="align-middle">{item.kode}</td>                   
                     <td className="align-middle"><input type="number" ref="editBronze" placeholder="harga dollar" className="form-control form-control-sm" defaultValue={item.bronze} /></td>
                    <td className="align-middle"><input type="number" ref="editSilver" placeholder="harga dollar" className="form-control form-control-sm" defaultValue={item.silver} /></td>
                    <td className="align-middle"><input type="number" ref="editGold" placeholder="harga dollar" className="form-control form-control-sm" defaultValue={item.gold} /></td>
                    <td className="align-middle"><input type="number" ref="editPlatinum" placeholder="harga dollar" className="form-control form-control-sm" defaultValue={item.platinum} /></td>
                    <td className="align-middle"><button type="button" className="btn btn-sm btn-primary" onClick={() => this.onBtnSaveShipping(item.id_negara)} ><i className="far fa-save"></i></button>{' '}
                    <button type="button" className="btn btn-sm btn-default border-primary" onClick={() => this.setState({shippingedit: 0})} ><i className="fas fa-undo-alt"></i></button></td>
                </tr>
            )
        })

        return listJSX;
        
           
    }
    paket = () => {
        var listJSX = this.state.paket.map(item => {
            if(item.id !== this.state.paketedit){
                return (
                    <tr key={item.id} className="text-wrap text-center" style={{fontSize:'12px'}}>                        
                        <td className="align-middle ">{item.id}</td>
                        <td className="align-middle">{item.nama}</td>
                        <td className="align-middle"> Rp {item.harga.toLocaleString()}</td>
                        {/* <td className="align-middle">{item.detail1}</td>
                        <td className="align-middle">{item.detail2}</td>
                        <td className="align-middle">{item.detail3}</td>
                        <td className="align-middle">{item.detail4}</td>
                        <td className="align-middle">{item.detail5}</td> */}
                        <td className="align-middle">{item.price}</td>
                        <td className="align-middle"><button type="button" className="btn btn-sm btn-warning" onClick={() => this.setState({paketedit: item.id})} ><i className="fas fa-edit"></i></button></td>
                    </tr>
                )
            }
            return (
                <tr key={item.isbn} className="text-wrap"  style={{fontSize:'12px'}}>                    
                   <td className="align-middle ">{item.id}</td>
                   <td className="align-middle"><input type="text" ref="editNama" placeholder="Nama paket" className="form-control form-control-sm" defaultValue={item.nama} /></td>
                    <td className="align-middle"><input type="number" ref="editHarga" placeholder="harga rupiah" className="form-control form-control-sm" defaultValue={item.harga} /></td>
                    <td className="align-middle"><input type="text" ref="editHargaTulis" placeholder="harga rupiah dalam bentuk singkat" className="form-control form-control-sm" defaultValue={item.price} /></td>
                    <td className="align-middle"><button type="button" className="btn btn-sm btn-primary" onClick={() => this.onBtnSavePaket(item.id)} ><i className="far fa-save"></i></button>{' '}
                    <button type="button" className="btn btn-sm btn-default border-primary" onClick={() => this.setState({paketedit: 0})} ><i className="fas fa-undo-alt"></i></button></td>
                </tr>
            )
        })

        return listJSX;
        
           
    }
    membershipListDesc = () => {
        var listJSX = this.state.paket.map(item => {
            if(item.id !== this.state.descedit){
                return (
                    <tr key={item.id} className="text-wrap text-center" style={{fontSize:'12px'}}>                        
                        <td className="align-middle ">{item.id}</td>
                        <td className="align-middle">{item.nama}</td>
                        <td className="align-middle">{item.detail1}</td>
                        <td className="align-middle">{item.detail2}</td>
                        <td className="align-middle">{item.detail3}</td>
                        <td className="align-middle">{item.detail4}</td>
                        <td className="align-middle">{item.detail5}</td>
                        <td className="align-middle"><button type="button" className="btn btn-sm btn-warning" onClick={() => this.setState({descedit: item.id})} ><i className="fas fa-edit"></i></button></td>
                    </tr>
                )
            }
            return (
                <tr key={item.isbn} className="text-wrap"  style={{fontSize:'12px'}}>                    
                   <td className="align-middle ">{item.id}</td>
                   <td className="align-middle">{item.nama}</td>
                    <td className="align-middle"><input type="text" ref="editList1" placeholder="list 1" className="form-control form-control-sm" defaultValue={item.detail1} /></td>
                    <td className="align-middle"><input type="text" ref="editList2" placeholder="list 2" className="form-control form-control-sm" defaultValue={item.detail2} /></td>
                    <td className="align-middle"><input type="text" ref="editList3" placeholder="list 3" className="form-control form-control-sm" defaultValue={item.detail3} /></td>
                    <td className="align-middle"><input type="text" ref="editList4" placeholder="list 4" className="form-control form-control-sm" defaultValue={item.detail4} /></td>
                    <td className="align-middle"><input type="text" ref="editList5" placeholder="list 5" className="form-control form-control-sm" defaultValue={item.detail5} /></td>
                    <td className="align-middle"><button type="button" className="btn btn-sm btn-primary" onClick={() => this.onBtnDescSavePaket(item.id)} ><i className="far fa-save"></i></button>{' '}
                    <button type="button" className="btn btn-sm btn-default border-primary" onClick={() => this.setState({descedit: 0})} ><i className="fas fa-undo-alt"></i></button></td>
                </tr>
            )
        })

        return listJSX;
        
           
    }
    
    render(){
        const { username, role } = this.props.user;

        if(username !== "" && role === "Admin" ){
            return (
                <div className="container-fluid">
                    <div className="row">
                        <SidebarAdmin pricing="aktif"/>

                        <div className="col-md-10 bg-light pl-3 pt-3">
                                <div className="alert blue media col-12">
                                    {/* <img className="img img-fluid" src="http://localhost:3000/images/flat/039-stadistics.png" width="100px" /> */}
                                    <div className="col-md-12 font-templates media-body">
                                        <h4>Pricing</h4>
                                        {/* <p> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Beatae, cupiditate minima similique quaerat nulla iusto dolorem quam asperiores ratione ex tempore in nemo harum consequatur fuga necessitatibus voluptatem sint dolor. </p> */}
                                    </div>
                                </div> 
                                <div className="row justify-content-sm-left mt-3 ml-1 text-left text-secondary" style={{fontSize:"14px"}} >
                                    {/* <form ref="formLeft" style={{boxShadow:"none"}} className="col-md-6">                                        
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Dollar</label>
                                            <div className="col-sm-9">
                                                <input type="text" ref="addNama" className="form-control form-control-sm" id="inputIsbn" placeholder="Nama Kategori" required autoFocus/>
                                            </div>
                                        </div>  
                                        <div className="form-group row">
                                            <div className="col-sm-9 offset-sm-3">
                                                <button type="button" class="btn btn-success btn-sm col-12" onClick={this.onBtnAddClick} ><i class="fas fa-plus-circle"></i> Input Kategori</button>
                                            </div>
                                        </div>                                      
                                    </form> */}
                                    <div className="card border col-12 pt-2 pb-2">
                                    <h5 className="text-secondary text-left mt-1 mb-2"><i class="fas fa-cogs"></i>Manage pricing</h5>
                                    <h6 className="text-secondary text-left">Manage Curency</h6>
                                    <table className="table table-hover text-secondary text-center" style={{fontSize:"12px"}}>
                                        <thead className="blue text-white">
                                            <th>Dollar</th>
                                            <th>Negara</th>
                                            <th>Convert</th>
                                            <th>Bronze</th>
                                            <th>Silver</th>
                                            <th>Gold</th>
                                            <th>Platinum</th>
                                            <th>Action</th>
                                        </thead>
                                        <tbody>
                                         {this.dollarCurency()}
                                        </tbody>
                                    </table>
                                    <h6 className="text-secondary text-left">Manage Shipping fee</h6>
                                    <table className="table table-hover text-secondary text-center" style={{fontSize:"12px"}}>
                                        <thead className="blue text-white">
                                            <th>ID Negara</th>
                                            <th>Bronze</th>
                                            <th>Silver</th>
                                            <th>Gold</th>
                                            <th>Platinum</th>
                                            <th>Action</th>
                                        </thead>
                                        <tbody>
                                         {this.putshippingfee()}
                                        </tbody>
                                    </table>
                                    <h6 className="text-secondary text-left">Manage Transaction fee</h6>
                                    <table className="table table-hover text-secondary text-center" style={{fontSize:"12px"}}>
                                        <thead className="blue text-white">
                                            <th>Bronze</th>
                                            <th>Silver</th>
                                            <th>Gold</th>
                                            <th>Platinum</th>
                                            <th>Action</th>
                                        </thead>
                                        <tbody>
                                        {this.puttransactionfee()}
                                        </tbody>
                                    </table>
                                    <h6 className="text-secondary text-left">Manage Cukai</h6>
                                    <table className="table table-hover text-secondary text-center" style={{fontSize:"12px"}}>
                                        <thead className="blue text-white">
                                            <th>Bea Masuk</th>
                                            <th>PPn</th>
                                            <th>PPh</th>
                                            <th>PPnBM</th>
                                            <th>Harga pungutan</th>
                                            <th>Action</th>
                                        </thead>
                                        <tbody>
                                           {this.renderListJSX()}
                                        </tbody>
                                    </table>
                                    <h6 className="text-secondary text-left">Manage Price</h6>
                                    <table className="table table-hover text-secondary text-center" style={{fontSize:"12px"}}>
                                        <thead className="blue text-white">
                                        <th>ID</th>
                                            <th>Nama paket</th>
                                            <th>harga</th>
                                            <th>harga untuk di homepage</th>
                                            <th>Action</th>
                                        </thead>
                                        <tbody>
                                          {this.paket()}
                                        </tbody>
                                    </table>
                                    <h6 className="text-secondary text-left">Manage description Price</h6>
                                    <table className="table table-hover text-secondary text-center" style={{fontSize:"12px"}}>
                                        <thead className="blue text-white">
                                        <th>ID</th>
                                            <th>Nama paket</th>
                                           <th>list 1</th>
                                           <th>list 2</th>
                                           <th>list 3</th>
                                           <th>list 4</th>
                                           <th>list 5</th>
                                            <th>Action</th>
                                        </thead>
                                        <tbody>
                                          {this.membershipListDesc()}
                                        </tbody>
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

export default connect(mapStateToProps)(Pricing);
