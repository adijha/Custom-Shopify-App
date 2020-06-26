import React, {useState, useEffect} from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import Card from "../components/Card/Card.jsx";
import Modal from "react-responsive-modal";
import "../assets/css/shopifyProduct.css";
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';



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
  const [tag, setTag] = useState("")
  const [varian, setVarian] = useState([])
  const [selling, setSelling] = useState('')

  useEffect(()=>{
    getShopifyProduct()
  }, [])

  const token = localStorage.getItem("token")
  let decode = jwt_decode(token)
  let storeName = `${decode.store}.myshopify.com`
  console.log(storeName.toLowerCase(), "storeName final");

  let str = decode.email;
    //let VendorString = str.substring(0, str.lastIndexOf("@"));
    // console.log(VendorString);


  const getShopifyProduct = () =>{

    axios.get('/ShopifyProduct/'+storeName.toLowerCase() )
    .then(data=>{
      console.log("data daat products", data.data.products);
      let checkStoreShopify = []
      data.data.products.forEach((item, i) => {
        if (data.data.products[i].vendor.toLowerCase()===decode.store.toLowerCase()) {
          checkStoreShopify.push(data.data.products[i]);
        }
      });
      console.log(checkStoreShopify, "after");

      setProducts(checkStoreShopify)
    })
  }

  const updateProductOpen = async (item) =>{
    let id = item.id;
    let tagString = item.tags.toString();
    console.log(id);
    setCode(item.id)
    setName(item.title)
    setDescription(item.body_html)
    setCategory(item.product_type)
    setTag(tagString)
    setVarian(item.variants)

    setOpen(true)

  }

const UpdateProduct = async (e)=>{
  e.preventDefault();
  // let tagArray = tag.split(", ")
  //
  // let newVariant = []
  //
  // varian.forEach((single, j) => {
  //
  //   newVariant.push({
  //     "option1" :single.title,
  //     "price":selling,
  //     "sku":single.code
  //   })
  // });


    let product={

        "product": {
          "title": name,
          "body_html": description,
          "vendor": decode.store,
          "product_type": category
          // "tags": tagArray,
          // "variants":newVariant

        }

  }



  console.log(product, "Update product is shopify")
    await axios.put('/ShopifyProduct/'+storeName.toLowerCase()+'/'+code, product)
    .then(data=>{
      console.log(data)
      if (data) {
        getShopifyProduct()
        NotificationManager.success('Product Updated in Shopify Successfully');

        setOpen(false);


      }
    else {
      NotificationManager.error('Something wrong');

    }
    })
}

const deleteProduct = (data)=>{
  axios.delete('/ShopifyProduct/'+storeName.toLowerCase()+'/'+data.id)
  .then(data=>{
    if (data) {
      getShopifyProduct()
      NotificationManager.success('product Deleted  from Shopify Successfully');


    }
  else {
    NotificationManager.error('Something wrong');

  }
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
          <label for="product_id">Shopify Product ID</label>
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
          <label for="product_category">Product Type</label>
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
      <h3 className="text-center">Variants</h3>

      <div className="form-group">
        <label for="product_tag">Tags</label>
        <input type="text"
                value={tag}
                onChange={(e)=>setTag(e.target.value)}
                className="form-control"
                id="product_tag"
                placeholder="Enter Tags of Product seperated by Commas"

        />
      </div>

      <div className="form-group">
        <table className="variant">
        <thead>
        <tr>
          <th className="th-variant">Title</th>
          <th className="th-variant">SKU</th>
          <th className="th-variant">Retail Price</th>
          <th className="th-variant">Selling Price</th>
          <th className="th-variant">Profit</th>
          </tr>
        </thead>

        <tbody>

              {varian.map((sss, i)=>{
                return(
                  <tr key={i}>
                  <td  className="td-variant">{sss.title}</td>
                  <td className="td-variant">&#8377; {sss.price}</td>
                  <td className="td-variant">{sss.sku}</td>
                  <td className="td-variant"><input type="number"
                          value={selling}
                          onChange={(e)=>setSelling(e.target.value)}
                          className="form-control"
                          id="product_tag"
                          placeholder="selling Price"/></td>
                  <td className="td-variant">&#8377; {selling-sss.price}</td>
                  </tr>
                )
              })}



        </tbody>

        </table>

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
