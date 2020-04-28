import React, { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // ES6
import axios from 'axios';
import jwt_decode from 'jwt-decode'
import "../assets/css/addProduct.css"


const AddProduct = () => {

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [warranty, setWarranty] = useState("");
  const [weight, setWeight] = useState("")
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [productImage, setProductImage] = useState([])
  const [csvData, setCsvData] = useState([])
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("")
  const [categoryList, setCategoryList] = useState([])
  const [size, setSize] = useState("")
  const [color, setColors] = useState("")
  const [tag, setTag] = useState("")

  const token = localStorage.getItem("token")
  const decode = jwt_decode(token)


  useEffect(() => {
    getCategoryList();
  }, [])


  //Add Product
  const addProduct = e => {
    e.preventDefault();

    const data = new FormData()
    data.append('productImage', productImage[0])
    data.append('productImage', productImage[1])
    data.append('productImage', productImage[2])
    data.append('productImage', productImage[3])
    data.append('productImage', productImage[4])
    data.append('productImage', productImage[5])
    data.append('productImage', productImage[6])
    data.append("supplier_id", decode.id)
    data.append("name", name)
    data.append("price", price)
    data.append("quantity", quantity)
    data.append("warranty", warranty)
    data.append("weight", weight)
    data.append("description", description)
    data.append("category", category)
    data.append("code", code)
    data.append("size", size)
    data.append("color", color)
    data.append("tag", tag)
    console.log("data", data)
    axios
      .post('/api/addProduct', data)
      .then(item => {
        if (item) {
          console.log(item.config)
          setStatus("Product Added Successfully")
          setName("")
          setPrice("")
          setQuantity("")
          setWarranty("")
          setDescription("")
          setCategory("")
          setCode("")
          setProductImage([])
        }
      })
      .catch(err => {
        console.log("add product error is:", err.message)
      })
  }

  //Add Product from CSV File
  const addCSvProduct = (e) => {
    e.preventDefault();
    const scvdata = new FormData()
    scvdata.append('file', csvData[0])
    scvdata.append('supplier_id', decode.id)
    axios
      .post('/api/product/csv', scvdata)
      .then(item => {
        console.log("file uploaded");
        setStatus("File uploaded Successfully")
      })
      .catch(error => {
        console.log("csv product :", error.message)
      })
  }

  //Fetch category List
  const getCategoryList = () => {
    axios
      .get('/api/totalCategory')
      .then(data => {
        console.log("category list is", data.data)
        setCategoryList(data.data)
      })
  }
  return (
    <div className="container-fluid">
      <br />
      <form onSubmit={addProduct}>
        <div className="card card-input" >
          
          <div className="form-group">
            <label for="product_name">Title</label>
            <input type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              id="product_name"
              placeholder="Enter Title of Product"
              required
            />
          </div>
          <div className="form-group">
            <label for="product_description">Detail Description</label>

            <ReactQuill value={description}
              onChange={(value) => setDescription(value.toString())} />
          </div>
          <div className="form-group">
            <label for="productImage">Image upload</label>
            <input type="file"
              name="productImage"
              className="form-control"
              onChange={(e) => setProductImage(e.target.files)}
              multiple accept="image/*"
            />
          </div>
         
        </div>
        <div className="card card-input" >
          <div className="form-group">
            <label for="product_price">Price</label>
            <input type="number"
              min="0" value={price}
              onChange={(e) => setPrice(e.target.value)}
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
              onChange={(e) => setQuantity(e.target.value)}
              min="0"
              className="form-control"
              id="product_quantity"
              placeholder="Enter Available Quanity of Product"
              required
            />
          </div>
          <div className="form-group">
            <label for="product_warranty">Weight</label>
            <input type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="form-control"
              id="product_warranty"
              placeholder="Enter Weight of Product in Grams"

            />
          </div>
          <div className="form-group">
            <label for="product_warranty">Warranty</label>
            <input type="text"
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
              className="form-control"
              id="product_warranty"
              placeholder="Enter Available warranty of Product"

            />
          </div>
        </div>

        <div className="card card-input" >
          <h3 className="text-center">Variants</h3>
          <div className="form-group">
            <label for="product_size">Size</label>
            <input type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="form-control"
              id="product_size"
              placeholder="Enter Differnet sizes seperated by ',' commas"
            />
          </div>
          <div className="form-group">
            <label for="product_colors">Colors</label>
            <input type="text"
              value={color}
              onChange={(e) => setColors(e.target.value)}
              className="form-control"
              id="product_colors"
              placeholder="Enter Differnet colors seperated by ',' commas"
            />
          </div>
          <div className="form-group">
            <label for="product_colors">Tags</label>
            <input type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="form-control"
              id="product_colors"
              placeholder="Enter Differnet Tags seperated by ',' commas"
            />
          </div>
        </div>

        <div className="card card-input" >
          <div className="form-group">
            <label for="product_category">Category</label>
            <select className="form-control" id="product_category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category of Product">
              {categoryList.map((item, i) => {
                return (
                  <option key={i}>{item.category}</option>
                )
              })}
            </select>
          </div>
          <div className="form-group">
            <label for="product_id">ID/SKU</label>
            <input type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="form-control"
              id="product_id"
              placeholder="Enter Unique Id of Product"
              required
            />
          </div>
        
        </div>
        <div className="card-button">
          <button
            type="submit"
            className="btn btn-primary btn-sm"
          >
            Save Product
          </button>
        </div>
      </form>
      <br />
      <div className="container-fluid">
        <form onSubmit={addCSvProduct}>
          <div className="card card-input" >
            <div className="form-group">
              <p className="text-center"><br /><strong>Or Upload CSV File</strong></p>
              <input type="file" className="form-control text-center" name="avatar" onChange={(e) => setCsvData(e.target.files)}
                encType="multipart/form-data"
              />
              <br />
              <button className="btn btn-primary btn-sm" type="submit" name="button">submit</button>
            </div>
          </div>
        </form>
      </div>
      <br />
      <div className="status text-center">{status}</div>
      <br />
    </div>

  )
}

export default AddProduct;
