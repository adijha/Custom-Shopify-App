import React, { useState, useEffect } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import axios from "axios";
import jwt_decode from "jwt-decode";
import "../assets/css/settings.css";
import { NotificationManager } from "react-notifications";
import Card from "../components/Card/Card.jsx";
import CustomButton from "../components/CustomButton/CustomButton";

const SupplierPaymentDetails = () => {
  const [supplier_id, setSupplierId] = useState("")
  const [name, setName] = useState("");
  const [accountno, setAccountno] = useState()
  const [ifscCode, setIfscCode] = useState("")
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState('')
  const [phoneNo, setPhoneNo] = useState()
  const [pmethod, setPMethod] = useState('')
  const [sortCode, setSortCode] = useState("")
  const [profileId, setProfileId] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setlastName] = useState("")
  const [address, setAddress] = useState("")
  const [westernId, setWesternId] = useState("")
  const [savedDetails, setSavedDetails] = useState([])

  const token = localStorage.getItem("token");
  const decode = jwt_decode(token);

  useEffect(()=>{
    setSupplierId(decode.id);
    getDetails();
  },[])


  const saveBankDetails = async () =>{
    console.log({name, accountno, pmethod, ifscCode});
    try {

        let res = await axios.post("/api/paymentDetails", {name, accountno, pmethod, ifscCode, supplier_id});
        NotificationManager.success("Detail saved Successfully");
        getDetails();
      }

      catch (error) {
        NotificationManager.error("something unusual happened");
      }
  }

  const saveTransferwiseDetails = async () =>{
    console.log({name, accountno, pmethod, sortCode});
    try {

        let res = await axios.post("/api/paymentDetails", {name, accountno, pmethod, sortCode, supplier_id});
        NotificationManager.success("Detail saved Successfully");
        getDetails();
      }

      catch (error) {
        NotificationManager.error("something unusual happened");
      }
  }

  const savePaypalDetails =async  () =>{
    console.log({name, profileId, pmethod});
    try {

        let res = await axios.post("/api/paymentDetails", {name, profileId, pmethod, supplier_id});
        NotificationManager.success("Detail saved Successfully");
        getDetails();
      }

      catch (error) {
        NotificationManager.error("something unusual happened");
      }
  }

  const saveWesternDetails =  async () =>{
    console.log({firstName, lastName, westernId, address, pmethod, supplier_id});
    try {

        let res = await axios.post("/api/paymentDetails", {firstName, lastName, westernId, address, pmethod, supplier_id});
        NotificationManager.success("Detail saved Successfully");
        getDetails();
      }

      catch (error) {
        NotificationManager.error("something unusual happened");
      }
  }

const getDetails = () =>{
  axios.get('/api/paymentDetails/'+decode.id)
  .then(data=>{
    setSavedDetails(data.data);
  })
}


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
                  <div className="card card-input" style={{ marginTop: 30 }}>

                  <div className="form-group">
                    <label for="product_quantity">Select Payment info</label>
                    <select className="form-control" value={pmethod} onChange={(e)=>setPMethod(e.target.value)}>
                    <option value="select">Select Method</option>
                    <option value="transferwise">Transferwise</option>
                    <option value="paypal">Paypal</option>
                    <option value="bankTransfer">Bank Transfer</option>
                    <option value="westerUnion">Western Union</option>
                    </select>
                  </div>
                  <br/>
                  <div>
                  <h4>Saved Details</h4>
                  {savedDetails.map(item=>{
                    return(
                      <p>{item.info.pmethod} :-  {item.info.name} : {item.info.profileId || item.info.ifscCode}</p>
                    )
                  })}
                  </div>
                  <br/>

                  {(pmethod==="bankTransfer")? (
                    <div>
                    <h4 className="text-center">Enter Bank Details</h4>
                    <div className="form-group">
                      <label for="product_quantity">Account Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        min="0"
                        className="form-control"
                        id="product_id"
                        placeholder="Enter name"
                      />
                    </div>
                    <div className="form-group">
                      <label for="product_quantity">Account Number</label>
                      <input
                        type="number"
                        value={accountno}
                        onChange={(e) => setAccountno(e.target.value)}
                        min="0"
                        className="form-control"
                        id="product_id"
                        placeholder="Enter Account No."
                      />
                    </div>
                    <div className="form-group">
                      <label for="product_quantity">Bank IFSC Code</label>
                      <input
                        type="text"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value)}
                        min="0"
                        className="form-control"
                        id="product_id"
                        placeholder="Enter name"
                      />
                    </div>
                    <CustomButton  onClick={saveBankDetails}>Save Details</CustomButton>
                    </div>
                  )

                  :
                  (null)
                }

                {(pmethod==='transferwise')?
                (
                  <div>
                  <h4 className="text-center">Enter Transferwise Details</h4>
                  <div className="form-group">
                    <label for="product_quantity">Account Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      min="0"
                      className="form-control"
                      id="product_id"
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="form-group">
                    <label for="product_quantity">Account Number</label>
                    <input
                      type="number"
                      value={accountno}
                      onChange={(e) => setAccountno(e.target.value)}
                      min="0"
                      className="form-control"
                      id="product_id"
                      placeholder="Enter Account No."
                    />
                  </div>
                  <div className="form-group">
                    <label for="product_quantity">sortCode</label>
                    <input
                      type="text"
                      value={sortCode}
                      onChange={(e) => setSortCode(e.target.value)}
                      min="0"
                      className="form-control"
                      id="product_id"
                      placeholder="Enter name"
                    />
                  </div>
                  <CustomButton  onClick={saveTransferwiseDetails}>Save Details</CustomButton>
                  </div>
                )
                :(null)}

                {(pmethod==='paypal')?
                (
                  <div>
                  <h4 className="text-center">Enter Paypal Details</h4>

                  <div className="form-group">
                    <label for="product_quantity">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      min="0"
                      className="form-control"
                      id="product_id"
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="form-group">
                    <label for="product_quantity">Profile Id</label>
                    <input
                      type="text"
                      value={profileId}
                      onChange={(e) => setProfileId(e.target.value)}
                      min="0"
                      className="form-control"
                      id="product_id"
                      placeholder="Enter Paypal Profile id or username"
                    />
                  </div>
                  <CustomButton  onClick={savePaypalDetails}>Save Details</CustomButton>


                  </div>
                )
                :(null)}



                {(pmethod==='westerUnion')?
                (
                  <div>
                  <h4 className="text-center">Enter Western Union Details</h4>
                  <div className="form-group">
                    <label for="product_quantity">Id</label>
                    <input
                      type="text"
                      value={westernId}
                      onChange={(e) => setWesternId(e.target.value)}
                      min="0"
                      className="form-control"
                      id="product_id"
                      placeholder="Enter Western Union Id"
                    />
                  </div>
                  <div className="form-group">
                    <label for="product_quantity">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      min="0"
                      className="form-control"
                      id="product_id"
                      placeholder="Enter First Name"
                    />
                  </div>
                  <div className="form-group">
                    <label for="product_quantity">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setlastName(e.target.value)}
                      min="0"
                      className="form-control"
                      id="product_id"
                      placeholder="Enter Last Name"
                    />
                  </div>
                  <div className="form-group">
                    <label for="product_quantity">Residential Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      min="0"
                      className="form-control"
                      id="product_id"
                      placeholder="Enter Full Address"
                    />
                  </div>

                  <CustomButton  onClick={saveWesternDetails}>Save Details</CustomButton>

                  </div>
                )
                :(null)}




                  </div>
              }
            />






          </Col>


        </Row>
      </Grid>
    </div>
  );
};

export default SupplierPaymentDetails;
