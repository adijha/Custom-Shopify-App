import React, {useState, useEffect} from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import Card from "../components/Card/Card.jsx";
import Modal from "react-responsive-modal";

import axios from 'axios';



const ShopifyProduct = () => {

  const [products, setProducts] = useState([]);
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

  useEffect(()=>{
    getShopifyProduct()
  }, [])

  const getShopifyProduct = () =>{
    axios.get('/ShopifyProduct')
    .then(data=>{
      setProducts(data.data.products)
    })
  }

  const updateProductOpen = async (item) =>{
    let id = item.id;
    console.log(id);
    setCode(item.id)
    setName(item.title)
    setDescription(item.body_html)
    setCategory(item.product_type)

    setOpen(true)

  }

const UpdateProduct = async (e)=>{
  e.preventDefault();
    const product = {
      "product":{
      "id": code,
      "title": name,
      "body_html": description,
      "product_type": category
    }
  }
  console.log(product, "product is shopify")
    await axios.put('/ShopifyProduct/'+code, product)
    .then(data=>{
      console.log(data)
      setStatus("Product Updated Successfully")
      setOpen(false);
      getShopifyProduct()

    })
}

const deleteProduct = (data)=>{
  axios.delete('/ShopifyProduct/'+data.id)
  .then(data=>{
    console.log(data)
    setStatus("product deleted Successfully")
    getShopifyProduct()
  })
  .catch(error=>{
    console.log("front product shopify error", error)
  })
}

  return(

    <div>
    <br/>

    <div className="content">
      <Grid fluid>
        <Row>
          <Col md={12}>
            <Card
              title="Product List"
              category={"Total Products :"+ products.length}
              ctTableFullWidth
              ctTableResponsive
              content={
                <Table striped hover >
                  <thead >
                    <tr>
                      <th>Id</th>
                      <th>Title</th>
                      <th>Descrption</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item, key) => {
                      return (
                        <tr key={key}>

                          <td>{item.id}</td>
                          <td>{item.title}</td>
                          <td style={{width:'20%'}}>{item.body_html}</td>
                          <td>{item.product_type}</td>
                          <td><button className="btn btn-primary btn-sm" onClick={()=>updateProductOpen(item)}>Edit</button></td>
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

    <form onSubmit={UpdateProduct}>
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

  )
}

export default ShopifyProduct;
