import React, { useState, useEffect } from "react";
import "../assets/css/MerchantSupport.css";
import { Grid, Row, Col, Table } from "react-bootstrap";

const MerchantSupport = () => {
  return (
    <div>
      <div className="content second-portion">
        <Grid fluid>
          <Row>
            <Col md={4}>
              <div className="box">
                <div className="icon">
                  <div className="image">
                    <i className="fa fa-envelope" aria-hidden="true" />
                  </div>
                  <div className="info">
                    <h3 className="title">MAIL</h3>
                    <p>
                      <i className="fa fa-envelope" aria-hidden="true" /> &nbsp;
                      Support@support.com
                      <br />
                      <br />
                    </p>
                  </div>
                </div>
                <div className="space" />
              </div>
            </Col>
            <Col md={4}>
              <div className="box">
                <div className="icon">
                  <div className="image">
                    <i className="fa fa-mobile" aria-hidden="true" />
                  </div>
                  <div className="info">
                    <h3 className="title">CONTACT</h3>
                    <p>
                      <i className="fa fa-mobile" aria-hidden="true" /> &nbsp;
                      (+91)-9624XXXXX
                      <br />
                      <br />
                      <i className="fa fa-mobile" aria-hidden="true" /> &nbsp;
                      (+91)-756706XXXX
                    </p>
                  </div>
                </div>
                <div className="space" />
              </div>
            </Col>
            <Col md={4}>
              <div className="box">
                <div className="icon">
                  <div className="image">
                    <i className="fa fa-map-marker" aria-hidden="true" />
                  </div>
                  <div className="info">
                    <h3 className="title">ADDRESS</h3>
                    <p>
                      <i className="fa fa-map-marker" aria-hidden="true" />{" "}
                      &nbsp; 15/3 Junction Building
                      <br />
                      "ABC New Krishna Krupa", State - 110000.
                    </p>
                  </div>
                </div>
                <div className="space" />
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    </div>
  );
};
export default MerchantSupport;
