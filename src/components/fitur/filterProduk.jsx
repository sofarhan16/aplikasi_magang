import React, { Component } from 'react';
import { KONEKSI } from '../../support/config';
import axios from 'axios';
import queryString from 'query-string';

class FilterProduk extends Component{
    state={
        kategori:[]
    }
    componentDidMount(){
        this.getKategori()
    }
    getKategori=()=>{
        axios.get(`${KONEKSI}/product/getallcategory`
        ).then((res) => {
            this.setState({kategori: res.data});
            console.log(this.state.kategori)
        }).catch((err) => {
            console.log(err);
        })
    }
    putCountrydata=()=>{
        const Kategori = this.state.kategori.map(item=>{
            if(item.id == this.props.id){
                return(
              
                    <div className='category-item'>
                        <div className="active">
                        <a href={`/negara?country=${this.props.negara}&&id=${item.id}`} className='text-white'><span className='col-md-10'>{item.nama}</span></a>
                        </div>
                    </div>
                  
                )
            }
            return(
              
                <div className='category-item'>
                    <div className="">
                    <a href={`/negara?country=${this.props.negara}&&id=${item.id}`} className='text-dark'><span className='col-md-10'>{item.nama}</span></a>
                    </div>
                </div>
              
            )
        })
        return Kategori
    }
    all=()=>{
        if(this.props.id == null){
            return(
                <div className='category-item'>
                <div className=" active">
                <a href={`/negara?country=${this.props.negara}`} className='text-white'><span className='col-md-10'>All</span></a>
                </div>
            </div>
            )
        }
        return(
            <div className='category-item'>
            <div className="">
            <a href={`/negara?country=${this.props.negara}`} className='text-dark'><span className='col-md-10'>All</span></a>
            </div>
        </div>
        )
    }
    render(){
        return(
            <div className=" text-left p-1 m-1">
            <h6 className="bold">Kategori: </h6>
           <div className='text-secondary filter-produk'>
                {this.all()}
                {this.putCountrydata()}  
           </div>
            </div>
        );
    }
}
export default FilterProduk;