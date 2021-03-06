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
  const [savedDetails, setSavedDetails] = useState({})

  const token = localStorage.getItem("token");
  const decode = jwt_decode(token);

  useEffect(()=>{
    setSupplierId(decode.id);
    getDetails();
  },[])


  const saveBankDetails = async () =>{
    console.log({name, accountno, pmethod, ifscCode});
    try {
      if (name ==='' || accountno ==='' || pmethod ==='' || ifscCode === '') {
        NotificationManager.error("Please fill all fields");

      }
        else {
          let obj = {
            name: name,
            accountno: accountno
          }
          let res = await axios.post("/api/supplierPaymentUpdate", {name, accountno, pmethod, ifscCode, supplier_id});
          getDetails();
          NotificationManager.success("Detail saved Successfully");
        }

      }

      catch (error) {
        NotificationManager.error("something unusual happened");
      }
  }

  const saveTransferwiseDetails = async () =>{
    console.log({name, accountno, pmethod, sortCode});
    try {
      if (name ==='' || accountno==='' || pmethod==='' || sortCode === '') {
        NotificationManager.error("Please fill all fields");

      }
      else {
        let res = await axios.post("/api/supplierPaymentUpdate", {pmethod, name, accountno, sortCode, supplier_id});
        getDetails();
        NotificationManager.success("Detail saved Successfully");
      }


      }

      catch (error) {
        NotificationManager.error("something unusual happened");
      }
  }

  const savePaypalDetails =async  () =>{
    console.log({name, profileId, pmethod});
    try {
      if (name ==='' || profileId==='' || pmethod === '') {
        NotificationManager.error("Please fill all fields");

      }
      else if (!profileId.includes('@')||!profileId.includes('.com')) {
        NotificationManager.error("Invalid paypal profile id");

      }
      else {
        let res = await axios.post("/api/supplierPaymentUpdate", {name, profileId, pmethod, supplier_id});
        getDetails();
        NotificationManager.success("Detail saved Successfully");
      }


      }

      catch (error) {
        NotificationManager.error("something unusual happened");
      }
  }

  const saveWesternDetails =  async () =>{
    console.log({firstName, lastName, westernId, address, pmethod, supplier_id});
    try {
      if (firstName==='' || lastName==='' || westernId ==='' || address === '' || pmethod ==='' || supplier_id === '') {
        NotificationManager.error("Please fill all fields");
      }
      else {
        let res = await axios.post("/api/supplierPaymentUpdate", {firstName, lastName, westernId, address, pmethod, supplier_id});
        getDetails();
        NotificationManager.success("Detail saved Successfully");
      }


      }

      catch (error) {
        NotificationManager.error("something unusual happened");
      }
  }

const getDetails = () =>{
  axios.get('/api/paymentDetails/'+decode.id)
  .then(data=>{
    data.data.sort(function(a,b){
    return new Date(b.created_on) - new Date(a.created_on)
  })
    setSavedDetails(data.data[0].info);
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
                      {/*<p>{savedDetails._id}</p>
                      <p>{savedDetails.pmethod} :-  {savedDetails.name} : {savedDetails.profileId || savedDetails.ifscCode}</p>

                      {(savedDetails.pmethod==="bankTransfer")?():null}
                      {(savedDetails.pmethod==="westerUnion")?():null}
                      */}
                      {(savedDetails.pmethod==="transferwise")?(
                        <table className="table table-dark">
                        <thead>
                        <tr>
                          <th>Method</th>
                          <th>Name</th>
                          <th>Account No.</th>
                          <th>Sort Code</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                        <td>Transfer Wise</td>
                        <td>{savedDetails.name}</td>
                        <td>{savedDetails.accountno}</td>
                        <td>{savedDetails.sortCode}</td>
                        </tr>
                        </tbody>
                        </table>
                      ):null}

                      {(savedDetails.pmethod==="paypal")?(
                        <table className="table table-dark">
                        <thead>
                        <tr>
                          <th>Method</th>
                          <th>Name</th>
                          <th>Profile Id</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                        <td>Paypal</td>
                        <td>{savedDetails.name}</td>
                        <td>{savedDetails.profileId}</td>
                        </tr>
                        </tbody>
                        </table>
                      ):null}

                      {(savedDetails.pmethod==="bankTransfer")?(
                        <table className="table table-dark">
                        <thead>
                        <tr>
                          <th>Method</th>
                          <th>Name</th>
                          <th>Account No.</th>
                          <th>IFSC Code</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                        <td>Bank Transfer</td>
                        <td>{savedDetails.name}</td>
                        <td>{savedDetails.accountno}</td>
                        <td>{savedDetails.ifscCode}</td>
                        </tr>
                        </tbody>
                        </table>
                      ):null}

                      {(savedDetails.pmethod==="westerUnion")?(
                        <table className="table table-dark">
                        <thead>
                        <tr>
                          <th>Method</th>
                          <th>ID</th>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>Residential Address</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                        <td>Western Union</td>
                        <td>{savedDetails.westernId}</td>
                        <td>{savedDetails.firstName}</td>
                        <td>{savedDetails.lastName}</td>
                        <td>{savedDetails.address}</td>
                        </tr>
                        </tbody>
                        </table>
                      ):null}


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
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label for="product_quantity">Account Number</label>
                      <input
                        type="number"
                        value={accountno}
                        onChange={(e) => setAccountno(e.target.value)}
                        min="0"
                        maxLength="20"
                        className="form-control"
                        id="product_id"
                        placeholder="Enter Account No."
                        required
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
                        placeholder="Enter IFSC Code"
                        maxLength="12"
                        required
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
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label for="product_quantity">Account Number</label>
                    <input
                      type="number"
                      value={accountno}
                      onChange={(e) => setAccountno(e.target.value)}
                      min="0"
                      maxLength="40"
                      className="form-control"
                      id="product_id"
                      placeholder="Enter Account No."
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label for="product_quantity">sortCode</label>
                    <input
                      type="text"
                      value={sortCode}
                      onChange={(e) => setSortCode(e.target.value)}
                      min="0"
                      maxLength="20"
                      className="form-control"
                      id="product_id"
                      placeholder="Enter name"
                      required
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
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label for="product_quantity">Profile Id</label>

                    <input
                       type="email" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"
                      value={profileId}
                      onChange={(e) => setProfileId(e.target.value)}

                      className="form-control"

                      placeholder="Enter Paypal Profile id or username"
                      required
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
                      required
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
                      required
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
                      required
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
                      required
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
