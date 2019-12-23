import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class SidebarAgent extends Component {
    render() {
        const { username, role } = this.props.user;
    
        if(username !== "" && role !== "User"){
            return <Redirect to="/" />
        }
        return (
            <nav className="col-md-2 d-none d-md-block bg-light sidebar border-right" style={{minHeight:"600px"}}>
                <div className="sidebar-sticky mt-2">
                    <ul className="nav flex-column text-left text-dark">
                        <li className={`nav-item ${this.props.dashboard}`}>
                            <Link to="/agent/home" className="nav-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>{' '}
                                Dashboard <span className="sr-only">(current)</span>
                            </Link>
                        </li>
                        <li className={`nav-item ${this.props.customers}`}>
                            <Link to="/agent/inputConsument" className="nav-link "> 
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>{' '}
                                Pelanggan
                            </Link>
                        </li>
                        <li className={`nav-item ${this.props.cart}`}>
                            <Link to="/agent/cart" className="nav-link ">
                            <svg class="feather feather-shopping-cart sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-reactid="1096"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>  Keranjang
                            </Link>
                        </li>
                        <li className={`nav-item ${this.props.order}`}>
                            <Link to="/agent/order" className="nav-link ">
                            <svg class="feather feather-inbox sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg> Pesanan
                            </Link>
                        </li>
                        <li className={`nav-item ${this.props.payment}`}>
                            <Link to="/agent/confirmpayment" className="nav-link ">
                            <div className="row">
                                <div className="col-md-2">
                                <svg class="feather feather-credit-card sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-reactid="441"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg> 
                                </div>
                                <div className="col-md-6">
                                Konfirmasi pembayaran
                                </div>
                            </div>
                            </Link>
                        </li>
                    </ul>

                </div>
            </nav>
        );
    }
}

const mapStateToProps = (state) => {
    return { 
        user: state.auth
    };
}

export default connect(mapStateToProps)(SidebarAgent);