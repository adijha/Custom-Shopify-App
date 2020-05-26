import React, {useState, useEffect} from "react";
import axios from 'axios'
import {Redirect, Link, BrowserRouter as Router,

Switch,

Route} from 'react-router-dom';
import '../assets/css/Header.css'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.js';
import { Navbar, Nav, NavDropdown, Form,  FormControl, Button, Table} from 'react-bootstrap';



const Header=()=> {



  return (
    <div style={{overflow:"hidden"}}>
    <div style={{height:"100px"}}>
    <Navbar bg="light" expand="lg" style={{border:"none"}}>
    <div className="container">
    <div className="row">
    <div className="col-md-6">
    <Navbar.Brand href="#"><img        className="d-inline-block align-top navBrand"
 src={require('../assets/img/latestLogo.png')} style={{float:"left",display: "flex",
height: "300px",
padding: "0",
top: "-12rem",
position: "relative"}}/></Navbar.Brand>
</div>
<div className="col-md-6" style={{}}>

<div className="collapse navbar-collapse" id="navbarSupportedContent" style={{color:"blue"}}>

         <Nav className="mr-auto login" style={{ color:"blue", float:"right"}}>

           <NavDropdown title="Login" id="basic-nav-dropdown" >
               <li><a href="/login-admin" className="text-center" style={{float:"left", color:"black"}}>Admin <span className="glyphicon glyphicon-cog pull-left" /></a></li>
               <li><a href="/login-supplier" style={{float:"left", color:"black"}}>Supplier <span className="glyphicon glyphicon-stats pull-left" /></a></li>
               <li><a href="/login-merchant" style={{float:"left", color:"black"}}>Merchant <span className="glyphicon glyphicon-stats pull-left" /></a></li>
           </NavDropdown>
         </Nav>

     </div>




</div>
</div>
</div>
  </Navbar>
     </div>



</div>


  );
}
export default Header;
