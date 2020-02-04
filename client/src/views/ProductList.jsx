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
import "../assets/css/productList.css"


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
const [itemId, setItemId] = useState("")
const [open, setOpen] = useState(false)

const modalStyle = {
                    margin:"auto",
                    position: "relative",
                  };


useEffect(()=>{
  getProductData();
},[])

const getProductData = () =>{
  axios.
  get('/shopify/supplier/product/'+decode.id)
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
  setItemId(item._id)
  setOpen(true)
}

const onCloseModal = ()=>{
  setOpen(false)
}

const deleteProduct = item=>{
  console.log("delete"+item._id)
    axios
    .delete('/shopify/product/'+item._id)
    .then(data=>{
      if (data) {
        setStatus("Product Deleted")
        getProductData();
      }
    })
}

const updateProductItem = e =>{
  e.preventDefault();
  const object = {
    _id:itemId,
    name: name,
    price: price,
    quantity: quantity,
    warranty: warranty,
    description: description,
    category:category,
    code:code
  }
  console.log(object)
  axios
  .patch('/shopify/product/update', object)
  .then(data=>{

    if (data) {
      setStatus("Product Updated Successfully")
      setName("")
      setPrice("")
      setQuantity("")
      setWarranty("")
      setDescription("")
      setCategory("")
      setCode("")
      setOpen(false)
      getProductData();
    }

  })
  .catch(err=>{
    console.log("update product error is:", err.message)
  })
}

    return (
      <div>
      <br/>
      <div id="hideStatus" className="status text-center">{status}</div>

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
                        <th>f</th>
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

                          <td style={{width:"15%"}}><img className="product-logo" src={`data:image/jpeg;base64, ${item.productImage[0].imgBufferData}`} /></td>
                            <td>{item.name}</td>
                            <td>{item.code}</td>
                            <td>{item.category}</td>
                            <td>{item.price}</td>
                            <td style={{width:'20%'}}>{item.description}</td>
                            <td><button className="btn btn-primary btn-sm" onClick={()=>updateProduct(item)}>Edit</button></td>
                            <td><button className="btn btn-danger btn-sm" onClick={()=>deleteProduct(item)}>Delete</button></td>
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
      <br/>
      <h3 style={{color:"red"}}className="text-center">Edit Product Details:</h3>
      <br/>

      <form style={modalStyle } onSubmit={updateProductItem}>
        <div className="card card-update" >
          <div className="form-group">
            <label for="product_id">ID/SKU</label>
            <input type="text"
                    value={code}
                    onChange={(e)=>setCode(e.target.value)}
                    className="form-control"
                    id="product_id"
                    placeholder="Enter Unique Id of Product"
                    required
            />
          </div>
          <div className="form-group">
            <label for="product_name">Title</label>
            <input type="text"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    className="form-control"
                    id="product_name"
                    placeholder="Enter Title of Product"
                    required
            />
          </div>
          <div className="form-group">
            <label for="product_category">Category</label>
            <input type="text"
                    value={category}
                    onChange={(e)=>setCategory(e.target.value)}
                    className="form-control"
                    id="product_category"
                    placeholder="Enter category of Product"
                    required
            />
          </div>
        </div>
        <div className="card card-update" >
          <div className="form-group">
            <label for="product_price">Price</label>
            <input type="number"
                    min="0" value={price}
                    onChange={(e)=>setPrice(e.target.value)}
                    className="form-control"
                    id="product_price"
                    placeholder="Enter Price of Product"
                    required
            />
          </div>
          <div className="form-group">
            <label for="product_quantity">Quantity</label>
            <input type="number"
                    value={quantity}
                    onChange={(e)=>setQuantity(e.target.value)}
                    min="0"
                    className="form-control"
                    id="product_quantity"
                    placeholder="Enter Available Quanity of Product"
                    required
            />
          </div>
          <div className="form-group">
            <label for="product_warranty">Warranty</label>
            <input type="text"
                    value={warranty}
                    onChange={(e)=>setWarranty(e.target.value)}
                    className="form-control"
                    id="product_warranty"
                    placeholder="Enter Available warranty of Product"
                    required
            />
          </div>
        </div>
        <div className="card card-update" >
          <div className="form-group">
            <label for="product_description">Detail Description</label>
            <textarea className="form-control"
                      rows="6"
                      value={description}
                      onChange={(e)=>setDescription(e.target.value)}
                      id="product_description"
                      placeholder="Enter Description of Product"
                      required
            />
          </div>
        </div>
        <div className="card-button">
          <button
          type="submit"
          className="btn btn-primary btn-sm"
          >
          Update Product
          </button>
        </div>
      </form>


      </Modal>
      </div>
    );

}

export default ProductList;
