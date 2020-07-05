import React, { useState, useEffect } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import axios from "axios";
import jwt_decode from "jwt-decode";
import "../assets/css/settings.css";
import { NotificationManager } from "react-notifications";
import Card from "../components/Card/Card.jsx";
import CustomButton from "../components/CustomButton/CustomButton";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const MerchantProfileSetting = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState();

  const token = localStorage.getItem("token");
  const decode = jwt_decode(token);

  useEffect(() => {
    getSupplierProfile();
    setId(decode.id);
  }, []);

  const getSupplierProfile = () => {
    axios.get("/merchantProfile" + decode.id).then((res) => {
      setEmail(res.data.email);
      setFirstName(res.data.firstName);
      setLastName(res.data.lastName);
      setPhoneNo(
        res.data.phoneNo ? res.data.phoneNo.toString() : res.data.phoneNo
      );
    });
  };

  const updateSettings = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.post("/settingsUpdateMerchant", {
        firstName,
        lastName,
        email,
        phoneNo,
      });
      NotificationManager.success("Settings Updated Successfully");
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
                      <label for="product_quantity">First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        min="0"
                        className="form-control"
                        id="product_id"
                        placeholder="Your First Name"
                      />
                    </div>

                    <div className="form-group">
                      <label for="product_name">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        min="0"
                        className="form-control"
                        id="product_name"
                        placeholder="Your Last Name"
                        required
                      />
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
                      />
                    </div>

                    <div className="form-group">
                      <label for="product_location">Phone No.</label>
                      <PhoneInput
                        placeholder="Enter phone number"
                        className="form-control"
                        value={phoneNo}
                        onChange={setPhoneNo}
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

export default MerchantProfileSetting;
