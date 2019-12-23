import React, { Component } from 'react';
import { Card, CardImg, CardText, CardTitle, CardImgOverlay  } from 'reactstrap';
import { KONEKSI } from '../../support/config';
import axios from 'axios';
class NegaraAll extends Component{
    state={
        negara:[]
    }
    componentDidMount(){
        this.getCountry()
    }
    getCountry=()=>{
        axios.get(`${KONEKSI}/product/getallcountry`
        ).then((res) => {
            this.setState({negara: res.data});
        }).catch((err) => {
            console.log(err);
        })
    }
    putCountrydata=()=>{
        const negara = this.state.negara.map(item=>{
            return(
              
                 <div className="col-md-4 my-4">
                  <a href={`/negara?country=${item.negara}`}>
                        <Card >
                            <CardImg  top height="200px" width="100%" src={`${KONEKSI+item.gambar}`}  alt="Card image cap"/>
                                <CardImgOverlay className="bg-gradient-secondary font-card ">
                                    {/* <CardTitle className=" bg-gradient-secondary display-4 text-white font-weight-bold">{item.negara}</CardTitle> */}
                                </CardImgOverlay>
                        </Card>
                        </a>
                    </div>
              
            )
        })
        return negara
    }
    render(){
        return(
            <div className='container'>
                <div className="row">
                    {this.putCountrydata()}
                </div>
        </div>
        );
    }
}
export default NegaraAll;