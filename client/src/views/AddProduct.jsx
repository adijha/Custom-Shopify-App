import React, {useState} from "react";
import axios from 'axios';
import "../assets/css/addProduct.css"


const AddProduct = () => {

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [warranty, setWarranty] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("")

  const addProduct = e =>{
    e.preventDefault();
    const object = {
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
    .post('/supplier/addproduct', object)
    .then(item=>{
      if (item) {
        setStatus("Added Successfully:"+ item)
        setName("")
        setPrice("")
        setQuantity("")
        setWarranty("")
        setDescription("")
        setCategory("")
        setCode("")

      }
    })
    .catch(err=>{
      console.log("add product error is:", err.message)
    })
  }

  return (
    <div className="container">
    <h1>Add Product</h1>
    <form className="form-horizontal" onSubmit={addProduct}>
    <fieldset className="fieldset">

      <div className="form-group">
        <label className="col-md-4 control-label" htmlFor="product_id">
          PRODUCT ID
        </label>
        <div className="col-md-6">
          <input
            id="product_id"
            name="product_id"
            placeholder="PRODUCT ID"
            className="form-control input-md"
            required
            type="text"
            value={code}
            onChange={(e)=>setCode(e.target.value)}
          />
        </div>
      </div>
      {/* Text input*/}
      <div className="form-group">
        <label className="col-md-4 control-label" htmlFor="product_name">
          PRODUCT NAME
        </label>
        <div className="col-md-6">
          <input
            id="product_name"
            name="product_name"
            placeholder="PRODUCT NAME"
            className="form-control input-md"
            required
            type="text"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />
        </div>
      </div>
      {/* Text input*/}
      <div className="form-group">
        <label className="col-md-4 control-label" htmlFor="product_price">
          PRODUCT PRICE
        </label>
        <div className="col-md-6">
          <input
            id="product_price"
            name="product_price"
            placeholder="PRODUCT PRICE"
            className="form-control input-md"
            required
            type="number"
            value={price}
            onChange={(e)=>setPrice(e.target.value)}
          />
        </div>
      </div>
      {/* Select Basic */}
      <div className="form-group">
        <label className="col-md-4 control-label" htmlFor="product_category">
          PRODUCT CATEGORY
        </label>
        <div className="col-md-6">
        <input
          id="product_category"
          name="product_category"
          placeholder="PRODUCT CATEGORY "
          className="form-control input-md"
          required
          type="text"
          value={category}
          onChange={(e)=>setCategory(e.target.value)}
        />
        </div>
      </div>
      {/* Text input*/}
      <div className="form-group">
        <label className="col-md-4 control-label" htmlFor="available_quantity">
          AVAILABLE QUANTITY
        </label>
        <div className="col-md-6">
          <input
            id="available_quantity"
            name="available_quantity"
            placeholder="AVAILABLE QUANTITY"
            className="form-control input-md"
            required
            type="number"
            value={quantity}
            onChange={(e)=>setQuantity(e.target.value)}
          />
        </div>
      </div>
      {/* Text input*/}

      {/* Textarea */}
      <div className="form-group">
        <label className="col-md-4 control-label" htmlFor="product_description">
          PRODUCT DESCRIPTION
        </label>
        <div className="col-md-6">
          <textarea
            className="form-control"
            id="product_description"
            name="product_description"
            placeholder="Detailed Description"
            defaultValue={""}
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
          />
        </div>
      </div>
      {/* Textarea */}

      {/* Text input*/}
      <div className="form-group">
        <label className="col-md-4 control-label" htmlFor="percentage_warranty">
          WARRANTY
        </label>
        <div className="col-md-6">
          <input
            id="percentage_warranty"
            name="percentage_warranty"
            placeholder="Product warranty"
            className="form-control input-md"
            required
            type="text"
            value={warranty}
            onChange={(e)=>setWarranty(e.target.value)}
          />
        </div>
      </div>
      {/* Text input*/}

          {/* File Button */}
          <div className="form-group">
            <label className="col-md-4 control-label" htmlFor="filebutton">
              main_image
            </label>
            <div className="col-md-6">
              <input
                id="filebutton"
                name="filebutton"
                className="input-file"
                type="file"
              />
            </div>
          </div>
          {/* File Button */}

          {/* Button */}
          <div className="form-group">

            <div className="col-md-4">
              <button
                id="singlebutton"
                name="singlebutton"
                className="btn btn-primary"
              >
                Save
              </button>
              <div className="col-md-6">{status}</div>

            </div>
          </div>

    </fieldset>
  </form>
    </div>
  )
}

export default AddProduct;
