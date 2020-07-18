import React, { useState } from "react";
import "../assets/css/SupplierForm.css";
import PhoneInput from "react-phone-number-input";
import axios from "axios";
import { NotificationManager } from "react-notifications";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
  Table,
} from "react-bootstrap";

const SupplierForm = () => {
  const [tab, setTab] = useState(1);
  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [website, setWebsite] = useState("");
  const [VAT, setVAT] = useState("");
  const [categories, setCategories] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [epacket, setEpacket] = useState("");
  const [epacketShipping, setEpacketShipping] = useState("");
  const [processing, setProcessing] = useState("");
  const [nonEpacketCountry, setNonEpacketCountry] = useState("");
  const [fastUS, setFastUS] = useState("");
  const [brandedInvoice, setBrandedInvoice] = useState("");
  const [brandedPackaging, setBrandedPackaging] = useState("");
  const [minimumOrder, setMinimumOrder] = useState("");
  const [returnManagement, setReturnManagement] = useState("");
  const [terms, setTerms] = useState(false);
  const [epacketCountry, setEpacketCountry] = useState("");
  const [carrierName, setCarrierName] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState("");
  const [deliveryPeriod, setDeliveryPeriod] = useState("");
  const getFormData = async (e) => {
    try {
      const submitData = await axios.post("/api/SupplierForm", {
        name,
        phoneNo,
        email,
        businessName,
        website,
        VAT,
        categories,
        warehouse,
        epacket,
        epacketShipping,
        processing,
        epacketCountry,
        nonEpacketCountry,
        fastUS,
        brandedInvoice,
        brandedPackaging,
        minimumOrder,
        returnManagement,
        carrierName,
        deliveryCharge,
        deliveryPeriod,
      });

      if (submitData.data.includes("success")) {
        NotificationManager.success("submitted Successfully");
      }
    } catch (error) {
      NotificationManager.error("Something wrong");
    }
    console.log({
      name,
      phoneNo,
      email,
      businessName,
      website,
      VAT,
      categories,
      warehouse,
      epacket,
      epacketShipping,
      processing,
      nonEpacketCountry,
      fastUS,
      brandedInvoice,
      brandedPackaging,
      minimumOrder,
      returnManagement,
      carrierName,
      deliveryCharge,
      deliveryPeriod,
    });
  };

  const changeFastUS = (e) => {
    console.log("radio", e.target.value);
    setFastUS(e.target.value);
  };

  return (
    <div>
      <div style={{ height: "100px" }}>
        <Navbar bg="light" expand="lg" style={{ border: "none" }}>
          <div className="container">
            <div className="row">
              <div className="col-md-6 head-img">
                <Navbar.Brand href="#">
                  <img
                    className="d-inline-block align-top navBrand"
                    src={require("../assets/img/latestLogo.png")}
                    style={{
                      float: "left",
                      display: "flex",
                      height: "300px",
                      padding: "0",
                      top: "-12rem",
                      position: "relative",
                    }}
                  />
                </Navbar.Brand>
              </div>
              <div className="col-md-6" style={{}}>
                <div
                  className="collapse navbar-collapse"
                  id="navbarSupportedContent"
                  style={{ color: "blue" }}
                >
                  <Nav
                    className="mr-auto login"
                    style={{ color: "blue", float: "right" }}
                  >
                    <NavDropdown title="Login" id="basic-nav-dropdown">
                      <li>
                        <a
                          href="/login-admin"
                          className="text-center"
                          style={{ float: "left", color: "black" }}
                        >
                          Admin{" "}
                          <span className="glyphicon glyphicon-cog pull-left" />
                        </a>
                      </li>
                      <li>
                        <a
                          href="/login-supplier"
                          style={{ float: "left", color: "black" }}
                        >
                          Supplier{" "}
                          <span className="glyphicon glyphicon-stats pull-left" />
                        </a>
                      </li>
                      <li>
                        <a
                          href="/login-merchant"
                          style={{ float: "left", color: "black" }}
                        >
                          Merchant{" "}
                          <span className="glyphicon glyphicon-stats pull-left" />
                        </a>
                      </li>
                    </NavDropdown>
                  </Nav>
                </div>
              </div>
            </div>
          </div>
        </Navbar>
      </div>

      {/* Form*/}
      <section id="banner">
        <div className="formTab" style={{ height: "100px" }}></div>
        <div className="container-fluid" style={{ maxWidth: 800 }}>
          <div
            className="sup-form-tabs"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 30,
            }}
          >
            <div
              className="sup-form-tab"
              style={{ cursor: "pointer" }}
              onClick={() => setTab(1)}
            >
              <h5 className="sup-form-tab-inner">Personal Details</h5>
              {tab === 1 ? <hr className="tab-hr" /> : null}
            </div>
            <div
              onClick={() => {
                name && email && phoneNo
                  ? setTab(2)
                  : console.log("do nothing");
              }}
              style={{ cursor: "pointer" }}
            >
              <h5>Company Details</h5>
              {tab === 2 ? <hr className="tab-hr" /> : null}
            </div>
            <div
              onClick={() => {
                website && businessName && warehouse && categories && VAT
                  ? setTab(3)
                  : console.log("do nothing");
              }}
              style={{ cursor: "pointer" }}
            >
              <h5>Shipping Details</h5>
              {tab === 3 ? <hr className="tab-hr" /> : null}
            </div>
            <div
              onClick={() => {
                epacket && processing && nonEpacketCountry && fastUS
                  ? setTab(4)
                  : console.log("do nothing");
              }}
              style={{ cursor: "pointer" }}
            >
              <h5>Branding and Return Management</h5>
              {tab === 4 ? <hr className="tab-hr" /> : null}
            </div>
          </div>
          <div>
            {tab === 1 ? (
              <div>
                <div className="card card-input">
                  <div className="form-group">
                    <h5
                      style={{ marginBottom: -7, marginTop: 15, fontSize: 15 }}
                    >
                      Full Name
                    </h5>
                    <input
                      type="name"
                      className="sup-input-box"
                      placeholder="Enter Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <h5
                      style={{ marginBottom: -7, marginTop: 15, fontSize: 15 }}
                    >
                      Email Address
                    </h5>
                    <input
                      type="email"
                      className="sup-input-box"
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <h5
                      style={{ marginBottom: -7, marginTop: 15, fontSize: 15 }}
                    >
                      Phone Number with country code
                    </h5>
                    <input
                      type="text"
                      className="sup-input-box"
                      placeholder="Enter Phone Number"
                      value={phoneNo}
                      onChange={(e) => setPhoneNo(e.target.value)}
                      required
                    />
                    <button
                      disabled={name && email && phoneNo ? false : true}
                      type="submit"
                      className="signup-btn"
                      onClick={() => setTab(2)}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            ) : tab === 2 ? (
              <div>
                <div className="card card-input">
                  <div className="form-group">
                    <h5
                      style={{ marginBottom: -7, marginTop: 15, fontSize: 15 }}
                    >
                      Business Name
                    </h5>
                    <input
                      type="name"
                      className="sup-input-box"
                      placeholder="Enter Business Name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                    />
                    <h5
                      style={{ marginBottom: -7, marginTop: 15, fontSize: 15 }}
                    >
                      Business Website
                    </h5>
                    <input
                      type="text"
                      className="sup-input-box"
                      placeholder="Enter Website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      required
                    />
                    <h5
                      style={{ marginBottom: -7, marginTop: 15, fontSize: 15 }}
                    >
                      VAT or Tax ID
                    </h5>
                    <input
                      type="text"
                      className="sup-input-box"
                      placeholder="Enter VAT or Tax ID"
                      value={VAT}
                      onChange={(e) => setVAT(e.target.value)}
                      required
                    />
                    <h5
                      style={{ marginBottom: -7, marginTop: 15, fontSize: 15 }}
                    >
                      What and all categories of product you are dealing with?
                    </h5>
                    <input
                      type="text"
                      className="sup-input-box"
                      placeholder="Enter Categories"
                      value={categories}
                      onChange={(e) => setCategories(e.target.value)}
                      required
                    />
                    <h5
                      style={{ marginBottom: -7, marginTop: 15, fontSize: 15 }}
                    >
                      Please tell us your different warehouse locations around
                      the world
                    </h5>
                    <input
                      type="text"
                      className="sup-input-box"
                      placeholder="Enter Warehouse Locations"
                      value={warehouse}
                      onChange={(e) => setWarehouse(e.target.value)}
                      required
                    />
                    <button
                      disabled={
                        website &&
                        businessName &&
                        warehouse &&
                        categories &&
                        VAT
                          ? false
                          : true
                      }
                      type="submit"
                      className="signup-btn"
                      onClick={() => setTab(3)}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            ) : tab === 3 ? (
              <div>
                <div className="card card-input">
                  <div className="form-group">
                    <h5
                      style={{ marginBottom: -7, marginTop: 15, fontSize: 15 }}
                    >
                      Do you use e-packet shipping? (Yes/No)
                    </h5>
                    <input
                      type="name"
                      className="sup-input-box"
                      placeholder="Yes or No"
                      value={epacket}
                      onChange={(e) => setEpacket(e.target.value)}
                      required
                    />
                    {epacket.toLowerCase() === "no" ? (
                      <>
                        <h5
                          style={{
                            marginBottom: -7,
                            marginTop: 15,
                            fontSize: 15,
                          }}
                        >
                          If No, then What shipping method you use for e-packet
                          countries?
                        </h5>
                        <input
                          type="text"
                          className="sup-input-box"
                          placeholder="Enter shipping method"
                          value={epacketShipping}
                          onChange={(e) => setEpacketShipping(e.target.value)}
                        />
                      </>
                    ) : (
                      <div></div>
                    )}

                    <h5
                      style={{ marginBottom: -7, marginTop: 15, fontSize: 15 }}
                    >
                      Please tell us the approximate processing time of the
                      order. (We are only looking for suppliers who can agree to
                      process the order in 1-3 days)
                    </h5>
                    <input
                      type="text"
                      className="sup-input-box"
                      placeholder="Enter Processing time"
                      value={processing}
                      onChange={(e) => setProcessing(e.target.value)}
                      required
                    />
                    <h5
                      style={{ marginBottom: -7, marginTop: 15, fontSize: 15 }}
                    >
                      Approximate number of days for delivery to e-packet
                      countries- Non e-packet countries-
                    </h5>
                    <input
                      type="text"
                      className="sup-input-box"
                      placeholder="Enter delivery time for e-packet countries"
                      value={epacketCountry}
                      onChange={(e) => setEpacketCountry(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      className="sup-input-box"
                      placeholder="Enter delivery time for non-epacket countries"
                      value={nonEpacketCountry}
                      onChange={(e) => setNonEpacketCountry(e.target.value)}
                      required
                    />
                    <h5
                      style={{ marginBottom: -7, marginTop: 15, fontSize: 15 }}
                    >
                      Do you provide fastest shipping or express shipping to US?
                      Please tell us the shipping courier name, shipping charges
                      and approximate days of delivery.
                    </h5>
                    <br />

                    <div className="form-group">
                      <div className="custom-control custom-checkbox">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="exampleRadios"
                          id="exampleRadios1"
                          style={{ marginRight: "10px" }}
                          value="yes"
                          onChange={(e) => setFastUS(e.target.value)}
                        />
                        <label
                          className="form-check-label shippinglabel"
                          for="exampleRadios1"
                        >
                          Yes
                        </label>
                      </div>
                      <div className="custom-control custom-checkbox">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="exampleRadios"
                          id="exampleRadios2"
                          style={{ marginRight: "10px" }}
                          value="no"
                          onChange={(e) => setFastUS(e.target.value)}
                        />
                        <label
                          className="form-check-label shippinglabel"
                          for="exampleRadios2"
                        >
                          No
                        </label>
                      </div>
                      <br />
                      {fastUS === "yes" ? (
                        <div>
                          <div className="form-group row">
                            <label className="col-sm-5 col-form-label">
                              Shipping Carrier Name
                            </label>
                            <div className="col-sm-7">
                              <div
                                class="form-control "
                                style={{
                                  border: "1px solid #ddd",
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <input
                                  class="input-with-icon"
                                  id="form-name"
                                  type="text"
                                  min="0"
                                  value={carrierName}
                                  onChange={(e) =>
                                    setCarrierName(e.target.value)
                                  }
                                  id="product_price"
                                  style={{ border: "none" }}
                                  placeholder="Enter Shipping Carrier."
                                />
                              </div>
                            </div>
                          </div>

                          <div className="form-group row">
                            <label className="col-sm-5 col-form-label">
                              Shipping Charges
                            </label>
                            <div className="col-sm-7">
                              <div
                                class="form-control "
                                style={{
                                  border: "1px solid #ddd",
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <span class="icon-wrapp">
                                  <i class="input-icon fa fa-usd"></i>
                                </span>
                                <input
                                  class="input-with-icon"
                                  id="form-name"
                                  type="text"
                                  min="0"
                                  value={deliveryCharge}
                                  onChange={(e) =>
                                    setDeliveryCharge(e.target.value)
                                  }
                                  id="product_price"
                                  style={{ border: "none" }}
                                  placeholder="Enter Shipping Charges."
                                />
                              </div>
                            </div>
                          </div>

                          <div className="form-group row">
                            <label className="col-sm-5 col-form-label">
                              Delivery Period (in days)
                            </label>
                            <div className="col-sm-7">
                              <div
                                class="form-control "
                                style={{
                                  border: "1px solid #ddd",
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <input
                                  class="input-with-icon"
                                  id="form-name"
                                  type="text"
                                  min="0"
                                  value={deliveryPeriod}
                                  onChange={(e) =>
                                    setDeliveryPeriod(e.target.value)
                                  }
                                  id="product_price"
                                  style={{ border: "none" }}
                                  placeholder="Enter Delivery Period (in days)"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <button
                      disabled={
                        epacket && processing && nonEpacketCountry && fastUS
                          ? false
                          : true
                      }
                      type="submit"
                      className="signup-btn"
                      onClick={() => setTab(4)}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            ) : tab === 4 ? (
              <div>
                <div className="card card-input">
                  <div className="form-group">
                    <h5
                      style={{ marginBottom: -7, marginTop: 15, fontSize: 15 }}
                    >
                      Will you be able to provide branded invoicing? (Yes/No)
                    </h5>
                    <input
                      type="name"
                      className="sup-input-box"
                      placeholder="Yes or No"
                      value={brandedInvoice}
                      onChange={(e) => setBrandedInvoice(e.target.value)}
                      required
                    />
                    <h5
                      style={{ marginBottom: -7, marginTop: 15, fontSize: 15 }}
                    >
                      Will you be able to branded packaging? (Yes/No)
                    </h5>
                    <input
                      type="text"
                      className="sup-input-box"
                      placeholder="Yes or No"
                      value={brandedPackaging}
                      onChange={(e) => setBrandedPackaging(e.target.value)}
                      required
                    />
                    <h5
                      style={{ marginBottom: -7, marginTop: 15, fontSize: 15 }}
                    >
                      What is the minimum number of orders you require for
                      branded packaging?
                    </h5>
                    <input
                      type="text"
                      className="sup-input-box"
                      placeholder="Enter minimum order"
                      value={minimumOrder}
                      onChange={(e) => setMinimumOrder(e.target.value)}
                      required
                    />
                    <h5
                      style={{ marginBottom: -7, marginTop: 15, fontSize: 15 }}
                    >
                      If we have any return in case of damage or any other
                      reason. Will you buy back or replace it and let us know
                      your return management.
                    </h5>
                    <input
                      type="text"
                      className="sup-input-box"
                      placeholder="Enter return management details"
                      value={returnManagement}
                      onChange={(e) => setReturnManagement(e.target.value)}
                      required
                    />
                    <br />
                    <p className="text-center">
                      Please read our Supplier Aggrement from{" "}
                      <a href="/supplier-t&c" target="_blank">
                        here
                      </a>
                    </p>
                    <br />
                    <p className="text-center">
                      <span className="check">
                        <input
                          type="checkbox"
                          required
                          value={terms}
                          onChange={() => setTerms(true)}
                        />
                      </span>
                      I agree to the terms & conditions
                    </p>
                    <button
                      disabled={
                        returnManagement &&
                        minimumOrder &&
                        brandedPackaging &&
                        brandedInvoice &&
                        terms
                          ? false
                          : true
                      }
                      type="submit"
                      className="signup-btn"
                      onClick={(e) => getFormData()}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
      <section id="footer">
        <footer id="footer-Section">
          <div className="footer-top-layout">
            <div className="container">
              <div className="row">
                <div className="col-md-12" style={{ height: "100px" }}>
                  <div className="col-sm-3 footer-logo">
                    <img
                      className="footer-img"
                      src={require("../assets/img/latestLogo.png")}
                    />
                  </div>
                  <div className="col-sm-3">
                    <a
                      className="btn btn-primary text-center affliliateBtn"
                      style={{ backgroundColor: "white", float: "right" }}
                      href="#"
                    >
                      Become An Affiliate
                    </a>
                  </div>
                  <div className="col-sm-6">
                    <div className="text-center footer-social">
                      <a href="/contact-us"> Support</a>
                      <a href="/login-merchant"> Login</a>
                      <a href="/merchant-signup">Sign Up</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom-layout">
            <div className="container">
              <div className="row">
                <div className="col-md-4">
                  <p
                    className="text-center copyright"
                    style={{ float: "left" }}
                  >
                    Copyright © 2020 Melisxpress.com
                  </p>
                </div>
                <div className="col-md-6 footer-company">
                  <a href="/terms&condtions" target="_blank">Terms & Conditions</a>
                  <a href="/privacy-policy" target="_blank">Privacy policy</a>
                  <a href="/supplier-form" target="_blank">
                    Become a supplier
                  </a>
                </div>
                <div className="col-md-2">
                  <a className="btn btn-info" href="/contact-us">
                    Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default SupplierForm;
