import React, { Component} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import  SidebarAgent from './SidebarAgent';
import Countdown from './Countdown';
import Top from './dashboard/top';
import Customer from './dashboard/tableCustomer';
var moment = require('moment');
class HomeAgent extends Component {
    alert=()=>{
         var a = moment().format('YYYY-MM-DD HH:mm:ss');
         var lastmember = this.props.user.lastmember;
         console.log(lastmember)
        if(a >=lastmember){
           return <h1>Selesai</h1>
        }
        return <Countdown date={lastmember} /> 
    }
    render(){
        const { username, status,level } = this.props.user;
         if( username !== "" && status === "Unverified" || level == null){
            return <Redirect to="/verify" />
        }
      
        if(username !== ""){
            return (
                <div className="container-fluid">
                    <div className="row">
                        <SidebarAgent dashboard="aktif"/>

                        <div className="col-md-10 bg-light pl-3 pt-3">
                                   
                              {this.alert()}  
                             <Top/>
                            <Customer/>
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

export default connect(mapStateToProps)(HomeAgent);