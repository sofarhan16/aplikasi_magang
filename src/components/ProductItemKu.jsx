import React, { Component } from 'react';
import { connect } from 'react-redux';
import { select_produk } from '../actions';
import { KONEKSI } from '../support/config';
import axios from 'axios';
import Cookies from "universal-cookie";
const cookies = new Cookies();
class ProductItemKu extends Component {
    state={
        curency:0,
        level:'',
        bronze:0,
        silver:0,
        gold:0,
        platinum:0
    }
    componentDidMount(){
        this.getuser()
        this.getCurency()
    }
    onItemClick = () => {
        this.props.select_produk(this.props.produk);
    }
    
    getuser=()=>{
        var username = cookies.get('myPengguna');
       if(username!= undefined){
        axios.post(`${KONEKSI}/auth/keeplogin`,{
            username
        }
        ).then((res) => {
            this.setState({ level: res.data[0].level});
        }).catch((err) => {
            console.log(err);
        })
       }
    }
    
    getCurency=()=>{
        axios.get(`${KONEKSI}/transaction/curency`
        ).then((res) => {
            this.setState({ 
                curency: res.data[0].dollar, 
                bronze: res.data[0].bronze,
                silver:res.data[0].silver,
                gold:res.data[0].gold,
                platinum:res.data[0].platinum,
                selectedRow: 0 });
                
        }).catch((err) => {
            console.log(err);
        })
    }
    render(){
       if(this.props.color != null){
            var font = this.props.color;
       }else{
           var font = "font-Head";
       }
        const {nama_produk,harga,gambar,id,nama_negara, nama_kategori} = this.props.produk;

        if(this.state.level == 'BRONZE'){
            var paket = ((this.state.curency*this.state.bronze)/100)+this.state.curency
        }else if(this.state.level == 'SILVER'){
            var paket = ((this.state.curency*this.state.silver)/100)+this.state.curency
        }else if(this.state.level == 'GOLD'){
            var paket = ((this.state.curency*this.state.gold)/100)+this.state.curency
        }else if(this.state.level == 'PLATINUM'){
            var paket = ((this.state.curency*this.state.platinum)/100)+this.state.curency
        }else if(this.props.role == 'Admin'){
            var paket = ((this.state.curency*this.state.platinum)/100)+this.state.curency
        }
        var price = harga*paket
        var sumber = `${KONEKSI}/${gambar}`;
        if(this.props.username !== '' && this.props.level !== null&&this.props.role !=='Admin'){
            return (
                // <div className="col-lg-3 col-md-4 mb-4 p-1" onClick={this.onItemClick}>
                //     <div className="pt-5 card h-80">
                //         <a href={`/productdetail/${id}`} style={{textDecoration:"none"}}>
                            
                //             <div className="card-body" style={{height:"150px", overflow:"hidden"}}>
                //                 <img className="img-fluid pt-3" src={sumber} width="100px" className="ml-auto" alt={nama_produk} />                    
                //             </div>
                //             <div className="card-footer " style={{height:"190px", overflow:"hidden"}}>
                //                 <div className="mt-4">
                //                 <div className="text-wrap" style={{height:"40px", overflow:"hidden"}}>
                //                     <p className="card-title text-uppercase font-weight-bold font-templates" style={{fontSize:12}}>{nama_produk}</p>
                //                 </div>                            
                //                 <p className="font-weight-bold font-templates" style={{fontSize:12, margin:0}}>{nama_negara}</p> 
                //                 <p className="font-weight-bold font-templates" style={{fontSize:12, margin:0}}>$ {harga.toLocaleString()}</p>
                //                 <p className="font-weight-bold font-templates" style={{fontSize:12, margin:0}}>Rp {parseInt(price).toLocaleString()}</p>
                //                 </div>
                               
                //             </div>
                //         </a>
                        
                        
                //     </div>
                // </div>
                <div className="col-lg-3 col-md-4 mb-4 p-1" onClick={this.onItemClick}>
                    <div className="pt-5 h-80">
                        <a href={`/productdetail/${id}`} style={{textDecoration:"none"}}>
                            
                            <div className="card-body " style={{height:"150px", overflow:"hidden"}}>
                                <img className="img-fluid pt-3" src={sumber} width="100px" className="ml-auto" alt={nama_produk} />                    
                            </div>
                            <div className="card-footer" style={{height:"160px", overflow:"hidden"}}>
                               <div className="mt-2">
                               <div className="text-wrap" style={{ overflow:"hidden"}}>
                                    <p className={`${font} text-uppercase font-weight-bold`} style={{fontSize:12}}>{nama_produk}</p>
                                    <p className={`font-weight-bold ${font}`} style={{fontSize:12, margin:0}}>{nama_kategori}</p> 
                                    
                                    <p className={`font-weight-bold font-templates`} style={{fontSize:12, margin:0}}>$ {harga.toLocaleString()}</p>
                                     <p className={`font-weight-bold  font-orange`} style={{fontSize:12, margin:0}}>Rp {parseInt(price).toLocaleString()}</p>
                                </div>                            
                              
                               </div>

                                {/* <p className="font-weight-lighter text-success" style={{fontSize:12, color:'#9e9e9e', margin:0}}>Rp. {harga.toLocaleString()}</p> */}
                               
                            </div>
                        </a>
                        
                        
                    </div>
                </div>
            );
        }else{
            return (
                <div className="col-lg-3 col-md-4 mb-4 p-1" onClick={this.onItemClick}>
                    <div className="pt-5 h-80">
                        <a href={`/productdetail/${id}`} style={{textDecoration:"none"}}>
                            
                            <div className="card-body " style={{height:"150px", overflow:"hidden"}}>
                                <img className="img-fluid pt-3" src={sumber} width="100px" className="ml-auto" alt={nama_produk} />                    
                            </div>
                            <div className="card-footer" style={{height:"160px", overflow:"hidden"}}>
                               <div className="mt-4">
                               <div className="text-wrap" style={{height:"40px", overflow:"hidden"}}>
                                    <p className={`card-title text-uppercase font-weight-bold ${font}`} style={{fontSize:12}}>{nama_produk}</p>
                                </div>                            
                                <p className={`font-weight-bold ${font}`} style={{fontSize:12, margin:0}}>{nama_negara}</p> 
                               </div>

                                {/* <p className="font-weight-lighter text-success" style={{fontSize:12, color:'#9e9e9e', margin:0}}>Rp. {harga.toLocaleString()}</p> */}
                               
                            </div>
                        </a>
                        
                        
                    </div>
                </div>
            );
        }
    }
}
const mapStateToProps = (state) => {
    return { 
        username: state.auth.username,
        role: state.auth.role,
        load: state.loadOfCart,
        level:state.auth.level
    };
}
export default connect(mapStateToProps, { select_produk })(ProductItemKu);
