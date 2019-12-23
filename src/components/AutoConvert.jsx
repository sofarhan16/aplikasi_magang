import React, { Component } from 'react'
import { KONEKSI } from '../support/config';
import axios from 'axios';

class AutoConvert extends Component {

    constructor(props){
        super(props)

        this.state = {
            convert: 0,
            Cnegara: 0
        }
    }

    componentDidMount(){
        // this.convert()
        this.getNegara()
        
    }    


    // convert = () => {

    //     var apiKey = 'b0eaf4e563b94be4f7c5';

    //     var fromCurrency = encodeURIComponent("USD");

    //     var toCurrency = encodeURIComponent("JPY");
    //     var query = fromCurrency + '_' + toCurrency;

    //     var url = 'https://free.currconv.com/api/v7/convert?q=' + query + '&compact=ultra&apiKey=' + apiKey;

    //     axios.get(url)
    //     .then((res) => {
    //         var obj = res.data
    //         var hasil = obj[Object.keys(obj)[0]]
    //         var hasil2 = hasil * this.props.mount
    //         var total = Math.round(hasil2 * 100) / 100
    //         this.setState({convert: total});
    //     }).catch((err) => {
    //         console.log(err)
    //     })

    // }


    getNegara = () => {
        if(this.props.mount != 0 && this.props.negara != 0){
            axios.post(`${KONEKSI}/transaction/getNegaraConvert/`, {id_negara: this.props.negara})
            .then((res) => {
                var obj = res.data[0]
                var hasil = obj[Object.keys(obj)[1]]
                var hasil2 = hasil * this.props.mount
                var total = Math.round(hasil2 * 100) / 100
                this.setState({convert: total});
            }).catch((err) => {
                console.log(err)
            })
        }else{
            console.log("gagal")
        }

    }
    


    displayConvert = () => {

        var negara = this.props.negara

        if(negara == 1){
            return (
                <p className="text-dark">¥ {this.state.convert.toLocaleString()}</p>
            )
        }else if(negara == 2){
            return (
                <p className="text-dark">$ {this.state.convert.toLocaleString()}</p>
            )
        }else if(negara == 3){
            return (
                <p className="text-dark">$ {this.state.convert.toLocaleString()}</p>
            )
        }else if(negara == 4){
            return (
                <p className="text-dark">RM {this.state.convert.toLocaleString()}</p>
            )
        }else if(negara == 5){
            return (
                <p className="text-dark">$ {this.state.convert.toLocaleString()}</p>
            )
        }else if(negara == 6){
            return (
                <p className="text-dark">₩ {this.state.convert.toLocaleString()}</p>
            )
        }else if(negara == 7){
            return (
                <p className="text-dark">฿ {this.state.convert.toLocaleString()}</p>
            )
        }else{
            return(
            <p className="text-dark">Undifinied</p>
            )
        }

    }

    render() {
        console.log(this.state.convert)
        return (
            <div>
                {this.displayConvert()}
            </div>
        )
    }
}

export default AutoConvert
