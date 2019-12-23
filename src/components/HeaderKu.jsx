import React,  { Component } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import { onUserLogout, keepLogin, loadOfCart } from '../actions';
import $ from 'jquery';
import queryString from 'query-string';
import { KONEKSI } from '../support/config';
const cookies = new Cookies();

class HeaderKu extends Component{
    
    constructor(props) {
        super(props);
        
        this.toggle = this.toggle.bind(this);
        this.onLogoutClick = this.onLogoutClick.bind(this)
        this.state = {
        isOpen: false,
        search:""
      };
    }
    toggle() {
       this.setState({
         isOpen: !this.state.isOpen
       });
    }
    componentDidMount(){
        $(document).ready(function() {
            // Transition effect for navbar 
            $(window).scroll(function() {
              // checks if window is scrolled more than 500px, adds/removes solid class
              if($(this).scrollTop() > 10) { 
                  $('.navbar').addClass('solid');
              } else if($(this).scrollTop() < 10){
                $('.navbar').addClass('transparant');
                $('.navbar').removeClass('solid');
              }else {
                  $('.navbar').removeClass('solid');
              }
            });
    });
    }

    renderLinkIsAdmin = () => {
        if(this.props.role === "Admin"){
            return(
                <Link to="/admin/home">
                    <NavLink className="border-right">
                        <i class="fas fa-cogs"></i> Dashboard Admin 
                    </NavLink>
                </Link>
            );
        }
        // return(
        //     <Link to="/cart">
        //         <NavLink className="border-right">
        //             <i className="fas fa-shopping-cart"></i> Keranjang { this.renderBadgeCart() }
        //         </NavLink>
        //     </Link>
        // );
    }
    // verify=()=>{
    //     if(this.props.role !== "Admin"){
    //         return(
    //         <NavItem>
    //             <Link to="/verify"><NavLink className="myLogin btn btn-default " style={{fontSize:"14px"}}> Verify</NavLink></Link>
    //         </NavItem>
    //         )
    //     }
    // }
    renderLinkIsAgent = () => {
        if(this.props.role !== "User" && this.props.role !== "Admin"){
            return(
                <Link to="/shopper/home">
                    <NavLink className="border-right">
                        <i class="fas fa-cogs"></i> Dashboard Shopper
                    </NavLink>
                </Link>
                )
        }else if(this.props.role !== "Admin" && this.props.level != null){
            return(
                <Link to="/agent/home">
                    <NavLink className="border-right">
                        <i class="fas fa-cogs"></i> Dashboard Member
                    </NavLink>
                </Link>
            );
        }else if(this.props.role !== "Admin"){
            return(
                <NavItem>
                    <Link to="/verify"><NavLink className="myLogin btn btn-default " style={{fontSize:"14px"}}> Verify</NavLink></Link>
                </NavItem>
                )
        }
    }
   
    onLogoutClick = () => {
        this.props.onUserLogout();
        cookies.remove('myPengguna', { path: '/' });
        window.location='/'
        //cookies.remove('myKey');
    }

    renderBadgeCart = () => {
        if( this.props.load.total_item > 0 ) {
            return (
                <span class="badge badge-pill badge-danger">{this.props.load.total_item}</span>
            );
        }
    }
    searchproduk=()=>{
        console.log(this.refs.searchproduk.value)
        var search = this.refs.searchproduk.value;
        if(search != ''){
            window.location.href=`/product?search=${search}`;
            this.setState({search:search})
        }else{
            alert('Masukan kata kunci untuk melakukan pencarian')
        }
        
    }
    renderOnKeyPress = (event) => {
        if (event.key === 'Enter'){
            // alert('Enter has been pressed')
            this.searchproduk()
        }
    }
    searchbar =()=>{
        return(
                 <div className="input-group  mr-2" style={{width:"250px"}}>
                    <input type="text" ref="searchproduk" id="search-field" className="form-control" placeholder="Search" aria-label="Masukkan keyword judul, No.ISBN, atau Penulis" aria-describedby="button-addon2" onKeyPress={this.renderOnKeyPress}/>
                    <div className="input-group-append mr-2">
                        <button className="btn border-secondary" type="submit" id="button-addon2" onClick={()=>this.searchproduk()}><i className="fas fa-search" /></button>
                    </div>
                </div> 
        )
    }

    displayUser = () => {

        var {gambar} = this.props.user
        if(gambar == null){
            return (
                <DropdownToggle nav caret>
                    <img src="https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png" alt="" width="30px" height="30px" style={{ borderRadius:"100px", border: "1px solid black" }}/> Hello, <p className="text-capitalize" style={{display:"inline"}}>{this.props.username}</p>
                </DropdownToggle>
            )
        }else{
            return (
                <DropdownToggle nav caret>
                    <img src={KONEKSI+gambar} alt="" width="30px" height="30px" style={{ borderRadius:"100px", border: "1px solid black" }}/> Hello, <p className="text-capitalize" style={{display:"inline"}}>{this.props.username}</p>
                </DropdownToggle>
            )
        }
        

    }
    
    editProfile = () => {

        if(this.props.user.role != 'User' || this.props.user.level == null){
            return ''
        }else{
            return (

                <DropdownItem>
                    <Link to="/editprofile"><i className="fas fa-user-edit text-danger" width="20"></i> Edit Profile </Link>
                </DropdownItem>

            )
        }

    }


    displayMenus = () => {

        if(this.props.user.role == "User"){

            return (
                <NavItem className="c_menu">
                    <Link to="/agent/home" className="nav-link">Dashboard</Link>
                    <Link to="/agent/inputConsument" className="nav-link">Pelanggan</Link>
                    <Link to="/agent/cart" className="nav-link">Keranjang</Link>
                    <Link to="/agent/order" className="nav-link">Pesanan</Link>
                    <Link to="/agent/confirmpayment" className="nav-link">Konfirmasi pembayaran</Link>
                </NavItem>
            )

        }else if(this.props.role == "Shopper"){

            return (
                <NavItem className="c_menu">
                    <Link to="/shopper/home" className="nav-link">Dashboard</Link>
                    <Link to="/shopper/superdata" className="nav-link">List Produk</Link>
                    <Link to="/shopper/listcustomer" className="nav-link">SuperData</Link>
                </NavItem>
            )

        }
        

    }
    

    render(){
        console.log(this.props.user.level)
        if (this.props.username === ""){ 
            return(
                <div>
                 {/* <div style={{marginBottom:"50px"}}> */}
                    <Navbar  light expand="md" fixed="top">
                        <NavbarBrand href="/" className="ml-2 font-templates" ><img src="../logo.png" width='50px'/><span className='logo-text'>Warehousenesia</span></NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                {this.searchbar()}
                                </NavItem>
                                <NavItem>
                                    <Link to="/login"><NavLink className="myLogin" style={{fontSize:"15px",fontFamily:"lato",color:"#1C2D46"}}>Sign In</NavLink></Link>
                                </NavItem>
                                <NavItem>
                                    <Link to="/register"><NavLink className="myLogin mr-1 font-weight-medium" style={{fontSize:"15px"}}>Register</NavLink></Link>
                                </NavItem>  
                            </Nav>
                        </Collapse>
                    </Navbar>
                </div>
            );
        }else{
            return(
                <div >
                    <Navbar  light expand="md" fixed="top">
                        {/* <NavbarBrand href="/" className="ml-2"><img src="http://localhost:3000/buku3.png" alt="brand" width="90px" /></NavbarBrand> */}
                        <NavbarBrand href="/home" className="ml-2" ><img src="../logo.png" width='50px' className="mr-3"/>Warehousenesia</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                {this.searchbar()}
                                </NavItem>
                                <NavItem>
                                    {this.renderLinkIsAgent()}
                                </NavItem>
                                <NavItem>
                                    {this.renderLinkIsAdmin()}                            
                                </NavItem>
                                
                                {this.displayMenus()}

                                <UncontrolledDropdown nav inNavbar>
                                    {this.displayUser()}
                                    <DropdownMenu right>
                                        
                                        {this.editProfile()}   
                                        <a href='https://api.whatsapp.com/send?phone=6281977718191'>
                                            <DropdownItem >
                                                <i class="fab fa-whatsapp"></i> Whatsapp us
                                            </DropdownItem>
                                        </a>
                                        <DropdownItem onClick={this.onLogoutClick}>
                                            <Link to="/"><i className="fas fa-sign-out-alt text-danger"></i> Logout </Link>
                                        </DropdownItem>
                                    
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </Nav>
                        </Collapse>
                    </Navbar>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth,
        username: state.auth.username,
        role: state.auth.role,
        load: state.loadOfCart,
        level:state.auth.level
    }
}

export default connect(mapStateToProps, {onUserLogout, keepLogin, loadOfCart})(HeaderKu);