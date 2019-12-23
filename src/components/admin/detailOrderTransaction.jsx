import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import SidebarAdmin from './SidebarAdmin';
import axios from 'axios';
import moment from 'moment';
import { KONEKSI } from '../../support/config';
import ReactToExcel from 'react-html-table-to-excel';
import Barcode from 'react-barcode'
class DetailOrder extends Component {
    state = { listOrderDetail: [],selectedRow:0 }
    componentDidMount() {
        this.getListOrderDetail();
    }
    getListOrderDetail = () => {
        axios.get(`${KONEKSI}/transaction/getlistordercustomer/`+this.props.id
        ).then((res) => {
            this.setState({ listOrderDetail: res.data, selectedRow: 0 });
            console.log(this.state.listOrderDetail)
        }).catch((err) => {
            console.log(err);
        })
    }
    bodyTable=()=>{
        var nomor = 1;
        const detail = this.state.listOrderDetail.map(item=>{
            var string = item.negara_asal;
            var barcode_id= string[0]+string[2]+item.id_manifest+moment(item.waktu).format('DD');
            var id_barcode =barcode_id.toUpperCase();
            
            return(
                
                <tr key={item.id_transaksi} className="text-wrap" style={{fontSize:'12px',height:'90px'}}>
                
                     <td className="align-middle">{nomor++}</td>                      
                    <td className="align-middle" style={{width:'200px'}}>{id_barcode}</td>
                    <td className="align-middle" style={{width:'200px'}}>{id_barcode}</td>
                    <td className="align-middle"></td>
                    <td className="align-middle">{item.negara_asal}</td>
                    <td className="align-middle">INDONESIA</td>
                    <td className="align-middle"></td>
                    <td className="align-middle"></td>
                    <td className="align-middle"></td>
                    <td className="align-middle"></td>
                    <td className="align-middle"></td>
                    <td className="align-middle"></td>
                    <td className="align-middle">{item.nama_customer}</td>
                    <td className="align-middle">{item.contact_person}</td>
                    <td className="align-middle" style={{width:'200px'}}>{item.address}</td>
                    <td className="align-middle"></td>
                    <td className="align-middle"></td>
                    <td className="align-middle"></td>
                    <td className="align-middle">{item.city}</td>
                    <td className="align-middle">{item.state}</td>
                    <td className="align-middle">{item.postcode}</td>
                    <td className="align-middle">{item.country}</td>
                    <td className="align-middle">-</td>
                    <td className="align-middle">-</td>
                    <td className="align-middle"></td>
                    <td className="align-middle"></td>
                    <td className="align-middle"></td>
                    <td className="align-middle"></td>
                    <td className="align-middle"></td>
                    <td className="align-middle"></td>
                    <td className="align-middle"></td>
                    <td className="align-middle"></td>
                    <td className="align-middle"></td>
                    <td className="align-middle"></td>
                    <td className="align-middle"></td>
                    <td className="align-middle"></td>
                    <td className="align-middle">{item.no_of_pieces}</td>
                    <td className="align-middle">{item.weight/1000} kg</td>
                    <td className="align-middle"></td>
                    <td className="align-middle" style={{width:'200px'}}>{item.item_description}</td>
                    <td className="align-middle"></td>
                    <td className="align-middle"></td>
                    <td className="align-middle">{item.price}</td>
                    <td className="align-middle"></td>
                    <td className="align-middle"></td>
                    <td className="align-middle"></td>
                    <td className="align-middle"></td>
                    <td className="align-middle"></td>
                    <td className="align-middle" style={{width:'200px'}}>{id_barcode}</td>
                    {/* <td className="align-middle"><Barcode value={id_barcode}/></td> */}
                    <td className="align-middle" style={{width:'420px'}}>
			<img src={`https://barcode.tec-it.com/barcode.ashx?data=${id_barcode}&code=Code128&dpi=96&dataseparator=`} alt='Barcode Generator TEC-IT'/>
		</td>
                </tr>
            );
        })
        return detail
    }
    render() {
            return (
                <div>
                    <div className="row">
                        <div className="col-md-6">
                            <h3 className="float-left">transaksi {this.props.id}</h3>
                        </div>
                        <div className="col-md-6">
                        <ReactToExcel 
                        className="btn btn-success float-right"
                        table="table-to-xls"
                        filename="excelFile"
                        sheet="sheet 1"
                        buttonText={`Download excel transaksi ${this.props.id}`}
                        />
                            {/* <button className="btn btn-success float-right">download excel</button> */}
                        </div>
                    </div>
                    <div className="table-order">
                    <table className="table table-hover" id="table-to-xls" border="1">
                    <thead>
                        <tr style={{width:'auto'}}>
                            <th scope="col">No</th>
                            <th scope="col">MAWB No</th>
                            <th scope="col">HAWB No</th>
                            <th scope="col">Account No</th>
                            <th scope="col">MAWB Ori</th>
                            <th scope="col">MAWB Dest</th>
                            <th scope="col">Flight</th>
                            <th scope="col">Flight. Date</th>
                            <th scope="col">XR1</th>
                            <th scope="col">XR1 AGENT CODE</th>
                            <th scope="col">XR2</th>
                            <th scope="col">XR2 AGENT CODE</th>
                            <th scope="col">Consignee</th>
                            <th scope="col">C Contact Person</th>
                            <th scope="col">C Address1</th>
                            <th scope="col">C Address2</th>
                            <th scope="col">C Address3</th>
                            <th scope="col">C Address4</th>
                            <th scope="col">C City</th>
                            <th scope="col">C State</th>
                            <th scope="col">C Postcode</th>
                            <th scope="col">C Country</th>
                            <th scope="col">C Tel 1</th>
                            <th scope="col">C Tel 2</th>
                            <th scope="col">Shipper Name</th>
                            <th scope="col">S Contact Person</th>
                            <th scope="col">S Address 1</th>
                            <th scope="col">S Address 2</th>
                            <th scope="col">S Address 3</th>
                            <th scope="col">S Address 4</th>
                            <th scope="col">S City</th>
                            <th scope="col">S State</th>
                            <th scope="col">S Postcode</th>
                            <th scope="col">S Country</th>
                            <th scope="col">S Tel 1</th>
                            <th scope="col">S Tel 2</th>
                            <th scope="col">No of Pieces</th>
                            <th scope="col">Weight(kg)</th>
                            <th scope="col">Bag No</th>
                            <th scope="col">Item Description</th>
                            <th scope="col">Package Type</th>
                            <th scope="col">Currency</th>
                            <th scope="col">Value</th>
                            <th scope="col">DDU DDP</th>
                            <th scope="col">VW Height</th>
                            <th scope="col">VW Width</th>
                            <th scope="col">VW Lenght</th>
                            <th scope="col">VW Weight</th>
                            <th scope="col">ID Barcode</th>
                            <th scope="col">Barcode</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.bodyTable()}
                    </tbody>
                </table>
                </div>
                </div>
            )  
        }
}
export default DetailOrder;