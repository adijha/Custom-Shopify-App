import React, { useState, useEffect } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import axios from "axios";
import jwt_decode from "jwt-decode";
import "../assets/css/settings.css";
import { NotificationManager } from "react-notifications";
import Card from "../components/Card/Card.jsx";
import CustomButton from "../components/CustomButton/CustomButton";
import moment from 'moment';

const RequestProduct = () => {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [id, setId] = useState("");
  const [description, setDescription] = useState("");
  let date, merchantId
  const token = localStorage.getItem("token");
  const decode = jwt_decode(token);

  useEffect(() => {
    getSupplierProfile();
    setId(decode.id);
  }, []);

  const getSupplierProfile = () => {

  };

  const updateSettings = async (e) => {
    e.preventDefault()
    let d = moment().format('DD-MM-YY')

    console.log({name, link, description, d, id});
    axios.post('/api/requestProduct', {name, link, description, d, id})
    .then(res=>{
      if (res.data) {
        NotificationManager.success(
          'Request Product Submitted Successfully'
        );
        setName("")
        setDescription("")
        setLink("")
      }
      else{
        NotificationManager.error("something unusual happened");
      }
    })
  };

  return (
    <div className="content">
      <Grid fluid>
        <Row>
          <Col md={12}>
            <Card
              title="Product Request Form"
              ctTableFullWidth
              ctTableResponsive
              content={
                <form onSubmit={updateSettings}>
                  <div className="card card-input" style={{ marginTop: 30 }}>

                  <div className="form-group">
                    <label for="product_quantity">Product Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      min="0"
                      className="form-control"
                      id="product_id"
                      placeholder="Enter Product Name"
                    />
                  </div>

                  <div className="form-group">
                    <label for="product_name">Product Description</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      min="0"
                      className="form-control"
                      id="product_name"
                      placeholder="Enter Product Description "
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label for="product_name">Link</label>
                    <input
                      type="text"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      min="0"
                      className="form-control"
                      id="product_name"
                      placeholder="Enter Product Link"
                      required
                    />
                  </div>



                    <CustomButton round fill type="submit" name="button">
                      Reduest Product
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

export default RequestProduct;
