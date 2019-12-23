import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';

class SidebarAdmin extends Component {
    render() {
        
        return (
            <nav className="col-md-2 d-none d-md-block bg-light sidebar border-right" style={{minHeight:"600px"}}>
                <div className="sidebar-sticky mt-2">
                    <ul className="nav flex-column text-left text-dark">
                        <li className={`nav-item ${this.props.dashboard}`}>
                            <Link to="/admin/home" className="nav-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>{' '}
                                Dashboard <span className="sr-only">(current)</span>
                            </Link>
                        </li>
                       
                        <li className={`nav-item ${this.props.orders}`}>
                            <Link to="/admin/verifyorder" className="nav-link">
                            <svg class="feather feather-inbox sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>{' '}
                                Orders
                            </Link>
                        </li>
                        <li className={`nav-item ${this.props.produk}`}>
                            <Link to="/admin/inputproduct" className="nav-link"> 
                            <svg class="feather feather-box sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>{' '}
                                Manage Products
                            </Link>
                        </li>
                        <li className={`nav-item ${this.props.superd}`}>
                            <Link to="/admin/superdata" className="nav-link"> 
                            <svg class="feather feather-box sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>{' '}
                                SuperData
                            </Link>
                        </li>
                        <li className={`nav-item ${this.props.track}`}>
                            <Link to="/admin/trackingJanio" className="nav-link "> 
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>{' '}
                                Tracking Janio
                            </Link>
                        </li>
                        <li className={`nav-item ${this.props.manageagent}`}>
                            <Link to="/admin/manageagent" className="nav-link "> 
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>{' '}
                                Manage Member
                            </Link>
                        </li>
                        <li className={`nav-item ${this.props.rSD}`}>
                            <Link to="/admin/reportsuperdata" className="nav-link ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-bar-chart-2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>{' '}
                                Reports SuperData
                            </Link>
                        </li>
                        <li className={`nav-item ${this.props.report}`}>
                            <Link to="/admin/report" className="nav-link ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-bar-chart-2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>{' '}
                                Reports
                            </Link>
                        </li>
                        <li className={`nav-item ${this.props.history}`}>
                            <Link to="/admin/history" className="nav-link ">
                            <svg class="feather feather-server sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6" y2="6"></line><line x1="6" y1="18" x2="6" y2="18"></line></svg>{' '}
                                History
                            </Link>
                        </li>
                        <li className={`nav-item ${this.props.pricing}`}>
                            <Link to="/admin/pricing" className="nav-link ">
                            <svg class="feather feather-percent sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>{' '}
                                Pricing 
                            </Link>
                        </li>

                        <li className={`nav-item ${this.props.category}`}>
                            <Link to="/admin/category" className="nav-link ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>{' '}
                                Category
                            </Link>
                        </li>
                        <li className={`nav-item ${this.props.country}`}>
                            <Link to="/admin/country" className="nav-link ">
                            <svg class="feather feather-flag sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>{' '}
                                Country
                            </Link>
                        </li>
                        <li className={`nav-item ${this.props.carousell}`}>
                            <Link to="/admin/carousell" className="nav-link ">
                            {/* <svg class="feather feather-flag sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>{' '} */}
                            <img src="../images/megaphone.svg" width="30" className="pr-2"/>
                                Carousell
                            </Link>
                        </li>
                    </ul>

                </div>
            </nav>
        );
    }
}

export default SidebarAdmin;