import React, { Component } from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import  SidebarShopper from './sidebarShopper'
import Select from 'react-select';
import { KONEKSI } from '../../support/config';
import moment from 'moment'

class listCustomer extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            list: []
        }
    }

    componentDidMount(){
        this.getListCustomer()
    }


    getListCustomer = () => {

        var id = this.props.user.id_agent

        axios.post(`${KONEKSI}/transaction/getListCustomer`, {id_ps: id})
        .then((res) => {
            this.setState({list:res.data})
            console.log(res.data)
        }).catch((err) => {
            console.log(err)
        })

    }

    renderTable = () => {

        const table = this.state.list.map((item) => {

            var waktubaru = moment(new Date()).format('YYYY/MM/DD')
            var waktubiasa = moment(item.waktu).format('YYYY/MM/DD')


            console.log(waktubaru)
            console.log(waktubiasa)
            if(waktubaru > waktubiasa){
                console.log("ok")
            }

            return(
                <tr className={item.status == 5 ? "bg-secondary text-white": ""}>
                    {/* <td>{moment(item.waktu).format('YYYY/MM/DD HH:mm:ss')}</td> */}
                    <td>{moment(item.waktu).format('YYYY/MM/DD HH:mm:ss')}</td>
                    <td><a href={`/shopper/listenduser?tanggal=${item.waktu}`} className="btn btn-success"><i className="fa fa-search"></i></a></td>
                </tr>
            )
        })
        return table 

    }


    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <SidebarShopper listC="aktif"/>
                    <div className="col-md-10">
                        <table className="table table-bordered">
                            <tr>
                                <td>Tanggal</td>
                                <td>List Cutomer</td>
                            </tr>
                            {this.renderTable()}
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { 
        user: state.auth
    };
}

export default connect(mapStateToProps)(listCustomer);
