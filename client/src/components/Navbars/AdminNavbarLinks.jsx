/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import { NavItem, Nav  } from "react-bootstrap";
import {Redirect} from 'react-router-dom';
import jwt_decoder from 'jwt-decode';

class AdminNavbarLinks extends Component {
  constructor(){
    super();
    let isLoggedIn = false;
    const token = localStorage.getItem("token")
    if (token) {
      isLoggedIn = true;
    }
    this.state = {
      email:"",
      isLoggedIn
    }

    let decoder = jwt_decoder(token)
    this.state.email = decoder.email;

    this.logout = this.logout.bind(this)
  }

  logout(){
   localStorage.removeItem("token");
   this.setState({
     isLoggedIn: false
   })
 }
  render() {
    if (this.state.isLoggedIn===false) {
       return <Redirect to ="/login-access"/>
    }

    return (
      <div>
        <Nav pullRight>
          <NavItem eventKey={1} >
            {this.state.email}
          </NavItem>
          <NavItem eventKey={2} onClick={this.logout}>
            Log out
          </NavItem>
        </Nav>
      </div>
    );
  }
}

export default AdminNavbarLinks;
