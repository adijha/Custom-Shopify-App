import React, { Component, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "../assets/css/supplierOrders.css";
import Card from "../components/Card/Card.jsx";
// import { Grid, Row, Col, Table } from "react-bootstrap";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Modal from "react-responsive-modal";

const token = localStorage.getItem("token");
const decode = jwt_decode(token);
var store = {
  headerOffset: null,
};

let data = [
  {
    id: 0,
    name: "name 0",
    details: "details 0",
    state: "live",
  },
  {
    id: 1,
    name: "name 1",
    details: "details 1",
    state: "live",
  },
  {
    id: 2,
    name: "name 2",
    details: "details 2",
    state: "draft",
  },
];

let cols = [
  {
    icon: "",
    label: "Order ID",
  },
  {
    icon: "",
    label: "SKU",
  },
  {
    icon: "",
    label: "Customer",
  },
  {
    icon: "",
    label: "State",
  },
];

class RowItem extends React.Component {
  constructor() {
    super();

    this.state = {
      open: false,
    };
  }

  toggleRow(e) {
    console.log("toggleRow");

    this.setState({ open: !this.state.open });
  }

  render() {
    let classes = "";
    if (this.state.open) {
      classes = "open";
    }

    return (
      <li onClick={this.toggleRow.bind(this)} className={classes}>
        <div className="heading">
          <div className="col">{this.props.id}</div>
          <div className="col">{this.props.name}</div>
          <div className="col">{this.props.details}</div>{" "}
          <div className="col">{this.props.state}</div>
        </div>
        <RowContent open={this.state.open} />
        {this.props.children}
      </li>
    );
  }
}

class RowContent extends React.Component {
  clicker() {}

  render() {
    let jsxhtml = (
      <div className="content" onClick={this.clicker.bind(this)}>
        row content
        {this.props.children}
      </div>
    );

    if (this.props.open) {
      jsxhtml = (
        <div className="content open" onClick={this.clicker.bind(this)}>
          row content
          {this.props.children}
        </div>
      );
    }

    return <div>{jsxhtml}</div>;
  }
}

class Table extends React.Component {
  constructor() {
    super();
    this.state = {
      headerOffset: null,
      headerFixed: true,
    };
  }

  //   handleScroll(e) {
  //     let scrollTop = e.srcElement.body.scrollTop;
  //     console.log('scroll...', scrollTop, this.state.headerOffset);
  //     this.setState({
  //       headerFixed: true
  //     });
  //   }

  componentDidMount() {
    //   window.addEventListener('scroll', this.handleScroll.bind(this));
    // THIS SEEMS THE ONLY PLACE WE CAN PICK UP THE REF FOR THE HEADER
    console.log("reactdom: ", ReactDOM.findDOMNode(this.refs.header));
    store.headerOffset = ReactDOM.findDOMNode(
      this.refs.header
    ).getBoundingClientRect().top;
    console.log("store:", store.headerOffset);
    // this.setState({headerOffset:ReactDOM.findDOMNode(this.refs.header)});
  }

  render() {
    let columns = this.props.columns.map((item, inx) => {
      return <HeaderColumn label={item.label} />;
    });
    //go through the rows
    let rows = this.props.data.map((item, inx) => {
      return <RowItem {...item}></RowItem>;
    });
    let classes = "header";
    if (this.props.headerFixed) {
      classes = "header fixed";
    }
    return (
      <div className="table">
        {this.props.children}
        <div className={classes} ref="header">
          {columns}
          <div className="shadow"></div>
        </div>
        <ul>{rows}</ul>
      </div>
    );
  }
}

class HeaderColumn extends React.Component {
  constructor() {
    super();
  }
  render() {
    return <div className="hcol">{this.props.label}</div>;
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      tableHeader: null,
      tableHeaderFixed: false,
      ordersData: "",
    };
  }

  handleScroll(e) {
    let scrollTop = e.srcElement.body.scrollTop;
    console.log("app scroll...", scrollTop, store.headerOffset);
    if (scrollTop >= store.headerOffset) {
      this.setState({
        tableHeaderFixed: true,
      });
    } else {
      this.setState({
        tableHeaderFixed: false,
      });
    }
  }
  getOrderList = () => {
    axios.get("/api/ordersList/" + decode.id).then((res) => {
      this.setState({ ordersData: res.data });
    });
  };

  componentDidMount() {
    this.getOrderList();
    window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  render() {
    return (
      <div className="content">
        <div className="order-container">
          <Table
            data={data}
            columns={cols}
            headerFixed={this.state.tableHeaderFixed}
            scrollFn=""
          />
        </div>
      </div>
    );
  }
}

export default App;
