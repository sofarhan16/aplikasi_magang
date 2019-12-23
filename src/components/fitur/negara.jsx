import React, { Component } from 'react';
import { Card, CardImg, CardText, CardTitle, CardImgOverlay  } from 'reactstrap';
import { KONEKSI } from '../../support/config';
import axios from 'axios';
class Negara extends Component{
    state={
        negara:[]
    }
    componentDidMount(){
        this.getCountry()
    }
    getCountry=()=>{
        axios.get(`${KONEKSI}/product/getcountry`
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
                        <Card className="negara">
                            <CardImg  top height="200px" width="100%" src={`${KONEKSI+item.gambar}`}  alt="Card image cap"/>
                        </Card>
                        </a>
                    </div>
              
            )
        })
        return negara
    }
    render(){
        return(
            <div>
                <div className="row">
                    {this.putCountrydata()}
                </div>
        </div>
        );
    }
}
export default Negara;