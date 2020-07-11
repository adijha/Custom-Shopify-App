import React, { useState, useEffect } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import axios from "axios";
import jwt_decode from "jwt-decode";
import "../assets/css/settings.css";
import { NotificationManager } from "react-notifications";
import Card from "../components/Card/Card.jsx";
import CustomButton from "../components/CustomButton/CustomButton";

const SupplierOrders = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phoneNo, setPhoneNo] = useState();
  const [password, setPassword] = useState("");
  const token = localStorage.getItem("token");
  const decode = jwt_decode(token);

  useEffect(() => {
    getSupplierProfile();
    setId(decode.id);
  }, []);

  const getSupplierProfile = () => {
    axios.get("/supplierProfile" + decode.id).then((res) => {
      setEmail(res.data.email);
      setId(res.data.supplier_id);
      setName(res.data.name);
      setLocation(res.data.location);
      setBusinessName(res.data.businessName);
      setPhoneNo(res.data.phoneNo);
    });
  };

  const updateSettings = async (e) => {
    e.preventDefault();
    try {
      if (password === "") {
        NotificationManager.error("Please Enter Password");
      } else {
        let res = await axios.post("/settingsUpdate", {
          location,
          name,
          id,
          businessName,
          phoneNo,
          password,
        });
        NotificationManager.success("Settings Updated Successfully");
      }
    } catch (error) {
      NotificationManager.error("something unusual happened");
    }
  };

  return (
    <div className="content">
      <Grid fluid>
        <Row>
          <Col md={12}>
            <Card
              title="Accounts Settings"
              ctTableFullWidth
              ctTableResponsive
              content={
                <form onSubmit={updateSettings}>
                  <div className="card card-input" style={{ marginTop: 30 }}>
                    <div className="form-group">
                      <label for="product_quantity">Supplier ID</label>
                      <input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        min="0"
                        className="form-control"
                        id="product_id"
                        placeholder="@id"
                        disabled="disabled"
                      />
                    </div>

                    <div className="form-group">
                      <label for="product_name">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        min="0"
                        className="form-control"
                        id="product_name"
                        placeholder="Your Name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label for="product_name">Business Name</label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        min="0"
                        className="form-control"
                        id="product_name"
                        placeholder="Your Business Name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label for="product_name">Phone No.</label>

                      <input
                        type="tel"
                        value={phoneNo}
                        onChange={(e) => setPhoneNo(e.target.value)}
                        min="0"

                        className="form-control"
                        id="phone"
                        placeholder="Enter your mobile no. 0123456789"
                        pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                        required
                      />
                      <small>Enter 10 digit number</small>
                    </div>

                    <div className="form-group">
                      <label for="product_email">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        id="product_email"
                        placeholder="example@any.com"
                        disabled="disabled"
                      />
                    </div>

                    <div className="form-group">
                      <label for="product_location">Location</label>

                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        min="0"
                        className="form-control"
                        id="product_location"
                        placeholder="Short Address"
                      />
                    </div>

                    <div className="form-group">
                      <label for="product_quantity">Password</label>
                      <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        min="0"
                        className="form-control"
                        id="product_id"
                        placeholder="Enter New Password"
                        required
                      />
                    </div>

                    <CustomButton round fill type="submit" name="button">
                      Update Profile
                    </CustomButton>
                  </div>
                </form>
              }
            />
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

export default SupplierOrders;
