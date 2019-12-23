import React, { Component} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { KONEKSI } from '../support/config';
import axios from 'axios';
import queryString from 'query-string';
class AgentSubscribe extends Component {
    state={
        pricing:[],
        bank:[],
        pilihanBank:0,
        Checkout:0,
     
      }
      componentDidMount(){
        this.getPricing()
        this.getBank()
      }
      getPricing=()=>{
        var params = queryString.parse(this.props.location.search)
        var id = params.pricing
        axios.get(`${KONEKSI}/product/getdatapricing/${id}`
        ).then((res) => {
            this.setState({pricing: res.data});
        }).catch((err) => {
            console.log(err);
        })
      }
      getBank=()=>{
        axios.get(`${KONEKSI}/product/getdatabank`
        ).then((res) => {
            this.setState({bank: res.data});
        }).catch((err) => {
            console.log(err);
        })
      }
      putBank=()=>{
          const bankPilihan = this.state.bank.map(item=>{
              return (
                  <div>
                      <input type="radio" ref='bankPilihan' name="rekening" onChange={()=>this.setState({pilihanBank:item.id})}/> {item.nama_bank}<br /> <img src={`${KONEKSI}/${item.gambar}`} width="110" height="70px"/> <br/>Nomer Rekening: {item.noRek}<br />Atas nama: {item.atasNama}
                  </div>
              )
          })
          return bankPilihan
      }
      putAgent=(total)=>{
        var bank = this.state.pilihanBank
        const {id_agent} = this.props.user;
        if(bank != 0){
            axios.post(`${KONEKSI}/auth/daftaragent`,{
                id_agent,bank,total
            }).then((res) => {
                this.setState({Checkout: 1});
                
            }).catch((err) => {
                console.log(err);
            })
        }else{
            alert("Pilih Bank dahulu")
        }
      }
      putDataPaket=()=>{
          const pricing= this.state.pricing.map(item=>{
              return(
                <div>
                     <h5 className="card-title text-muted text-uppercase text-left">Paket {item.nama}</h5>
                     <hr />
                     <h6>Detail deskripsi</h6>
                     <ul className="fa-ul text-left">
                        <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail1}</li>
                        <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail2}</li>
                        <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail5}</li>
                        <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail3}</li>
                        <li><span className="fa-li"><i className="fas fa-check" /></span>{item.detail4}</li>
                    </ul>
                </div>
              );
          })
          return pricing
      }
      putDetail=()=>{
          const detail= this.state.pricing.map(item=>{
              var ppn = item.harga/10;
              var harga= parseInt(item.harga)
              var total = harga +ppn;
              return(
                <div className="col-lg-4">
                <div className="card mb-5 mb-lg-0">
                    <div className="card-body">
                    <h5 className="card-title text-muted text-uppercase text-left">Detail order</h5>
                     <hr />
                     <p className="text-left text-secondary">Paket {item.nama} </p>
                     <p className="text-right text-secondary">Rp {item.harga.toLocaleString()},- </p>
                     <hr />
                     <p className="text-left text-secondary">PPN</p>
                     <p className="text-right text-secondary">Rp {ppn.toLocaleString()},- </p>
                     <hr />
                     <p className="text-left text-secondary">Total</p>
                     <p className="text-right text-secondary">Rp {total.toLocaleString()},- </p>
                    </div>
                </div>
                <button onClick={()=>this.putAgent(total)} className="btn btn-block btn-primary text-uppercase mt-4">Checkout</button>
            </div>
               
              );
          })
          return detail
      }
    render(){
        const { username, role } = this.props.user;

            if(this.state.Checkout == 0){
                return (
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="card mb-5 mb-lg-0">
                                    <div className="card-body">
                                       {this.putDataPaket()}
                                    </div>
                                    </div>
                                <div className="card mb-5 mb-lg-0 mt-3">
                                    <div className="card-body">
                                        <h5 className="card-title text-muted text-uppercase text-left">Transfer</h5>
                                         <hr />
                                         <form className="text-left">
                                            {this.putBank()}
                                        </form>
                                    </div>
                                </div>
                                </div>
                                {this.putDetail()}
                           
                        
                        </div>
                    </div>
                );
            }
            return <Redirect to='/verify'/>
            
        }
}

const mapStateToProps = (state) => {
    return { 
        user: state.auth
    };
}

export default connect(mapStateToProps)(AgentSubscribe);