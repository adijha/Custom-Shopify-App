import React, { useState, useEffect } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import axios from "axios";
import jwt_decode from "jwt-decode";
import "../assets/css/settings.css";
import { NotificationManager } from "react-notifications";

import Card from "../components/Card/Card.jsx";
import CustomButton from "../components/CustomButton/CustomButton";

const AdminProfile = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState()
  const [password, setPassword] = useState('')

  const token = localStorage.getItem("token");
  const decode = jwt_decode(token);
  useEffect(() => {
    getAdminProfile();
    setId(decode.id);
  }, []);

  const getAdminProfile = () => {
    console.log("decode", decode.id)
    axios.get("/api/adminUser/" + decode.id).then((res) => {
      setEmail(res.data.email);
      setName(res.data.name);
      setUsername(res.data.username);
      setPhone(res.data.phoneNo)
    });
  };

  const updateSettings = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.patch("/api/adminAccount", { username,phone, name, id, email });
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
                      <label for="product_email">Name</label>
                      <input
                        type="text"
                        value={name || ''}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                        id="product_email"
                        placeholder="Your Name"
                      />
                    </div>
                    <div className="form-group">
                      <label for="product_quantity">Username</label>
                      <input
                        type="text"
                        value={username || ''}
                        onChange={(e) => setUsername(e.target.value)}
                        min="0"
                        className="form-control"
                        id="product_id"
                        placeholder="Enter Username"
                      />
                    </div>
                    <div className="form-group">
                      <label for="product_name">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        min="0"
                        className="form-control"
                        id="product_name"
                        placeholder="example@any.com"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label for="product_location">Phone No</label>

                      <input
                        type="number"
                        value={phone || ''}
                        onChange={(e) => setPhone(e.target.value)}
                        min="0"
                        className="form-control"
                        id="product_location"
                        placeholder="Enter Phone No."
                      />
                    </div>
                  {/*  <div className="form-group">
                      <label for="product_location">Password</label>

                      <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        min="0"
                        className="form-control"
                        id="product_location"
                        placeholder="Enter Password"
                      />
                    </div>*/}
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

export default AdminProfile;
