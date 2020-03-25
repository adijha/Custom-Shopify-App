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
import { Route, Switch, Redirect } from "react-router-dom";
import jwt_decode from 'jwt-decode';

import AdminNavbar from "../components/Navbars/AdminNavbar";
import Footer from "../components/Footer/Footer";
import Sidebar from "../components/Sidebar/Sidebar";


import { style } from "../variables/Variables.jsx";

import routes from "../routes-merchant.js";

import image from "../assets/img/sidebar-3.jpg";

class Merchant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn:false,
      image: image,
      hasImage: true,
      fixedClasses: "dropdown show-dropdown open"
    };
    const token = localStorage.getItem("token")
    const decode = jwt_decode(token)
    if (token && decode.category==="merchant") {
    this.state.isLoggedIn = true
    }
  }

  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/merchant") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={props => (
              <prop.component
                {...props}
              />
            )}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Merchant";
  };
  handleImageClick = image => {
    this.setState({ image: image });
  };

  handleHasImage = hasImage => {
    this.setState({ hasImage: hasImage });
  };
  handleFixedClick = () => {
    if (this.state.fixedClasses === "dropdown") {
      this.setState({ fixedClasses: "dropdown show-dropdown open" });
    } else {
      this.setState({ fixedClasses: "dropdown" });
    }
  };

  componentDidUpdate(e) {
    if (
      window.innerWidth < 993 &&
      e.history.location.pathname !== e.location.pathname &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
    }
    if (e.history.action === "PUSH") {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainPanel.scrollTop = 0;
    }
  }
  render() {
    if (this.state.isLoggedIn===false) {
      return <Redirect to="/login-Merchant"/>
    }
    return (
      <div className="wrapper">
        <Sidebar {...this.props} routes={routes} image={this.state.image}
        hasImage={this.state.hasImage}/>
        <div id="main-panel" className="main-panel" ref="mainPanel" style={{position: 'absolute', margin: 'auto', right: 0}}>
          <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
          />
          <Switch>{this.getRoutes(routes)}</Switch>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Merchant;
