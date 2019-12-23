import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SidebarAgent extends Component {
    render() {
        return (
            <nav className="col-md-2 d-none d-md-block bg-light sidebar border-right" style={{minHeight:"600px"}}>
                <div className="sidebar-sticky mt-2">
                    <ul className="nav flex-column text-left text-dark">
                        <li className={`nav-item ${this.props.dashboard}`}>
                            <Link to="/shopper/home" className="nav-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>{' '}
                                Dashboard <span className="sr-only">(current)</span>
                            </Link>
                        </li>
                        <li className={`nav-item ${this.props.superd}`}>
                            <Link to="/shopper/superdata" className="nav-link">
                                <svg class="feather feather-box sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>{' '}
                                List Produk
                            </Link>
                        </li>
                        <li className={`nav-item ${this.props.listC}`}>
                            <Link to="/shopper/listcustomer" className="nav-link">
                                <svg class="feather feather-box sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>{' '}
                                SuperData
                            </Link>
                        </li>
                        {/* <li className={`nav-item ${this.props.shipping}`}>
                            <Link to="/shopper/shippingLabel" className="nav-link">
                                <svg class="feather feather-box sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>{' '}
                                Shipping Label
                            </Link>
                        </li> */}
                    </ul>

                </div>
            </nav>
        );
    }
}

export default SidebarAgent;