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
import React, {useState,useEffect} from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Modal from "react-responsive-modal";


import Card from "../components/Card/Card.jsx";

const ProductList = () => {

const [productItems, setProductItems] = useState([])
const token = localStorage.getItem("token")
const decode = jwt_decode(token);

const [name, setName] = useState("");
const [price, setPrice] = useState("");
const [quantity, setQuantity] = useState("");
const [warranty, setWarranty] = useState("");
const [description, setDescription] = useState("");
const [category, setCategory] = useState("");
const [code, setCode] = useState("");
const [status, setStatus] = useState("")
const [open, setOpen] = useState(false)


useEffect(()=>{
  getProductData();
},[])

const getProductData = () =>{
  axios.
  get('/shopify/listProduct', {supplier_id:decode.id})
  .then(products=>{
    setProductItems(products.data)
  })
}

const updateProduct = item =>{
  console.log("updateProduct", item._id)
  setName(item.name)
  setPrice(item.price)
  setQuantity(item.quantity)
  setWarranty(item.warranty)
  setDescription(item.description)
  setCategory(item.category)
  setCode(item.code)
  setOpen(true)
}

const onCloseModal = ()=>{
  setOpen(false)
}

    return (
      <div>
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Product List"
                category={"Total Products :"+ productItems.length}
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover >
                    <thead >
                      <tr>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productItems.map((item, key) => {
                        return (
                          <tr key={key}>
                            <td>{item.name}</td>
                            <td>{item.code}</td>
                            <td>{item.category}</td>
                            <td>{item.price}</td>
                            <td style={{width:'20%'}}>{item.description}</td>
                            <td><button className="btn btn-primary btn-sm" onClick={()=>updateProduct(item)}>Edit</button></td>
                            <td><button className="btn btn-danger btn-sm">Delete</button></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                }
              />
            </Col>
          </Row>
        </Grid>

      </div>
      <Modal open={open} onClose={()=>setOpen(false)}>
      <form>
    <div className="form-group">
      <label htmlFor="exampleInputEmail1">Email address</label>
      <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
      <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
    </div>
    <div className="form-group">
      <label htmlFor="exampleInputPassword1">Password</label>
      <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
    </div>
    <div className="form-group form-check">
      <input type="checkbox" className="form-check-input" id="exampleCheck1" />
      <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
    </div>
    <button type="submit" className="btn btn-primary">Submit</button>
  </form>


      </Modal>
      </div>
    );

}

export default ProductList;
