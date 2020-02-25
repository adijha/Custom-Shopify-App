import React, {useState} from "react";
import axios from 'axios';
import jwt_decode from 'jwt-decode'
import "../assets/css/addProduct.css"


const AddProduct = () => {

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [warranty, setWarranty] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [productImage, setProductImage] = useState([])
  const [csvData, setCsvData] =useState([])
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("")

  const token = localStorage.getItem("token")
  const decode = jwt_decode(token)

  const addProduct = e =>{
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
    data.append("description", description)
    data.append("category", category)
    data.append("code", code)
console.log("data", data)
    axios
    .post('/api/addProduct', data)
    .then(item=>{
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
    .catch(err=>{
      console.log("add product error is:", err.message)
    })
  }

  const addCSvProduct = (e) =>{
    e.preventDefault();
    const scvdata = new FormData()
    scvdata.append('file', csvData[0])
    scvdata.append('supplier_id', decode.id)
    axios
    .post('/api/product/csv',scvdata)
    .then(item=>{
      console.log("file uploaded");
      setStatus("File uploaded Successfully")
    })
    .catch(error=>{
      console.log("csv product :", error.message)
    })
  }
  return (

    <div className="container-fluid">
    <br/>
      <form onSubmit={addProduct}>
        <div className="card card-input" >
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
        <div className="card card-input" >
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
            <label for="product_warranty">Weight</label>
            <input type="number"
                    value={warranty}
                    onChange={(e)=>setWarranty(e.target.value)}
                    className="form-control"
                    id="product_warranty"
                    placeholder="Enter Available warranty of Product"
                    required
            />
          </div>
        </div>
        <div className="card card-input" >
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
          <div className="form-group">
            <label for="productImage">Image upload</label>
            <input type="file"
            name="productImage"
                      className="form-control"
                      onChange={(e)=>setProductImage(e.target.files)}
                      multiple accept="image/*"
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
      <br/>
      <div className="container-fluid">
      <form onSubmit={addCSvProduct}>
      <div className="card card-input" >
        <div className="form-group">
      <p className="text-center"><br/><strong>Or Upload CSV File</strong></p>
        <input type="file" className="form-control text-center" name="avatar" onChange={(e)=>setCsvData(e.target.files)}
        enctype="multipart/form-data"
        />
        <br/>
        <button className="btn btn-primary btn-sm" type="submit" name="button">submit</button>
        </div>
        </div>
      </form>
      </div>
      <br/>
      <div className="status text-center">{status}</div>
      <br/>
    </div>

  )
}

export default AddProduct;
