import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import jwt_decode from "jwt-decode";
import "../assets/css/addProduct.css";
import { NotificationManager } from "react-notifications";
import CustomButton from "../components/CustomButton/CustomButton";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [warranty, setWarranty] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [productImage, setProductImage] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [size, setSize] = useState("");
  const [tag0, setTag0] = useState([]);
  const [tag1, setTag1] = useState([]);
  const [tag2, setTag2] = useState([]);
  const [varien, setVarien] = useState(false);
  const [option1, setOption1] = useState("color");
  const [option2, setOption2] = useState("size");
  const [option3, setOption3] = useState("material");
  const token = localStorage.getItem("token");
  const decode = jwt_decode(token);

  const [moreOption, setMoreOption] = useState(false);
  const [moreOption1, setMoreOption1] = useState(false);
  const [combo, setCombo] = useState([]);
  const [varients, setVarients] = useState([]);
  const [prices, setPrices] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [skus, setSkus] = useState([]);
  const [shippingDetails, setShippingDetails] = useState("");
  const [usa, setUsa] = useState(2.5);
  const [canada, setCanada] = useState(2.5);
  const [uk, setUk] = useState(2.5);
  const [australia, setAustralia] = useState(2.5);
  const [international, setInternational] = useState(2.5);


  const [length, setLength] = useState()


  useEffect(() => {
    getCategoryList();
  }, []);


  let Editor = {};
  Editor.modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold"],
      ["italic"],
      ["underline"],
      ["strike"],
      ["blockquote"],
      [{ list: "ordered" }],
      [{ list: "bullet" }],
      [{ indent: "+1" }],
      [{ indent: "-1" }],
      ["link"],
      ["video"],
      ["image"],
    ],
  };

  Editor.formats = [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];
  //Add Product
  const addProduct = async (e) => {
    e.preventDefault();



    let options = [
      { name: option1, values: tag0 },
      { name: option2, values: tag1 },
      { name: option3, values: tag2 },
    ];

    let tempVarientArray = []
    console.log("length is", length);
    for (var i = 0; i < length; i++) {
      let obj = {
          "varient": document.getElementById(`varientName${i}`).value,
          "price": document.getElementById(`varientPrice${i}`).value,
          "quantity": document.getElementById(`varientQuantity${i}`).value,
          "sku": document.getElementById(`varientSku${i}`).value
      }
    // console.log({
    //   varient: document.getElementById(`varientName${i}`).value,
    //   price: document.getElementById(`varientPrice${i}`).value,
    //   quantity: document.getElementById(`varientQuantity${i}`).value,
    //   sku: document.getElementById(`varientSku${i}`).value
    // });
    tempVarientArray.push(obj)

}
    const data = await new FormData();
    data.append("productImage", productImage[0]);
    data.append("productImage", productImage[1]);
    data.append("productImage", productImage[2]);
    data.append("productImage", productImage[3]);
    data.append("productImage", productImage[4]);
    data.append("productImage", productImage[5]);
    data.append("productImage", productImage[6]);
    data.append("supplier_id", decode.id);
    data.append("name", name);
    data.append("price", price);
    data.append("quantity", quantity);
    data.append("warranty", warranty);
    data.append("weight", weight);
    data.append("description", description);
    data.append("category", category);
    data.append("code", code);
    data.append("size", size);
    data.append("varients", JSON.stringify(varients));
    data.append("options", JSON.stringify(options));
    data.append("method", shippingDetails);
    data.append("usa", usa);
    data.append("canada", canada);
    data.append("uk", uk);
    data.append("australia", australia);
    data.append("international", international);
    data.append("varientArray", JSON.stringify(tempVarientArray));
    //console.log("tempVarientArray", JSON.parse(JSON.stringify(tempVarientArray)));
    axios
      .post("/api/addProduct", data)
      .then((res) => {
       if (res.data.includes("Success")) {
          NotificationManager.success("Product Added Successfully");
          setName("");
          setPrice("");
          setQuantity("");
          setWarranty("");
          setDescription("");
          setCategory("");
          setCode("");
          setProductImage([]);
          setVarients([]);
        } else {
          res.data.error
            ? NotificationManager.error(res.data.error.toString())
            : NotificationManager.error("There is a problem with your entries");
        }
      })
      .catch((err) => {
        err
          ? NotificationManager.error(err.toString())
          : NotificationManager.error("There is a problem with your entries");
        //setVarients([]);
      });
  };

  //Add Product from CSV File
  const addCSvProduct = (e) => {
    e.preventDefault();
    const scvdata = new FormData();
    scvdata.append("file", csvData[0]);
    scvdata.append("supplier_id", decode.id);
    axios
      .post("/api/product/csv", scvdata)
      .then((res) => {
        if (res.data.includes("Success")) {
          NotificationManager.success("File uploaded Successfully");
        } else {
          res.data.error
            ? NotificationManager.error(res.data.error.toString())
            : NotificationManager.error("There is a problem with this csv");
        }
      })
      .catch((error) => {
        error
          ? NotificationManager.error(error.toString())
          : NotificationManager.error("There is a problem with this csv");
      });
  };

  //making commination from tags ,tag1,tag2 array
  function makeCombo() {
    var r = [],
      arg = arguments,
      max = arg.length - 1;
    function helper(arr, i) {
      for (var j = 0, l = arg[i].length; j < l; j++) {
        var a = arr.slice(0); // clone arr
        a.push(arg[i][j]);
        if (i === max) r.push(a);
        else helper(a, i + 1);
      }
    }
    helper([], 0);

    let res = [];
    for (let i = 0; i < r.length; i++) {
      const e = r[i];
      let str = "";
      for (let j = 0; j < e.length; j++) {
        const element = e[j];
        if (str === "") {
          str = element;
        } else str = str + " / " + element;
      }
      r[i] = str;
      res = r;
    }
    setLength(res.length)
    return res;
  }

  //Fetch category List
  const getCategoryList = () => {
    axios.get("/api/totalCategory").then((data) => {
      setCategoryList(data.data);
    });
  };
  //tags
  useEffect(() => {
    handelDelete();
  }, [tag0]);
  useEffect(() => {
    handelDelete();
  }, [tag1]);
  useEffect(() => {
    handelDelete();
  }, [tag2]);
  const removeTag0 = (indexToRemove) => {
    setTag0([...tag0.filter((_, index) => index !== indexToRemove)]);
  };
  const addTag0 = (event) => {
    if (event.target.value !== "") {
      let value = event.target.value.replace(/,/g, "");
      setTag0([...tag0, value]);
      selectedTags([...tag0, value]);
      event.target.value = "";
    }
  };
  const removeTag1 = (indexToRemove) => {
    setTag1([...tag1.filter((_, index) => index !== indexToRemove)]);
  };
  const addTag1 = (event) => {
    if (event.target.value !== "") {
      let value = event.target.value.replace(/,/g, "");
      setTag1([...tag1, value]);
      selectedTag1([...tag1, value]);
      event.target.value = "";
    }
  };

  const removeTag2 = (indexToRemove) => {
    setTag2([...tag2.filter((_, index) => index !== indexToRemove)]);
  };
  const addTag2 = (event) => {
    if (event.target.value !== "") {
      let value = event.target.value.replace(/,/g, "");
      setTag2([...tag2, value]);
      selectedTag2([...tag2, value]);
      event.target.value = "";
    }
  };
  const selectedTags = (tag) => {
    if (!moreOption || !moreOption1) {
      if (tag.length != 0 && tag1.length === 0 && tag2.length === 0) {
        let r = makeCombo(tag);
        setCombo(r);
      }
      if (tag0.length != 0 && tag1.length != 0 && tag2.length === 0) {
        let r = makeCombo(tag0, tag1);
        setCombo(r);
      }
      if (tag0.length != 0 && tag1.length != 0 && tag2.length != 0) {
        let r = makeCombo(tag0, tag1, tag2);
        setCombo(r);
      }
    }
  };

  const handelDelete = () => {
    //! normal user flow
    if (tag0.length != 0 && tag1.length === 0 && tag2.length === 0) {
      let r = makeCombo(tag0);
      setCombo(r);
    }
    if (tag0.length != 0 && tag1.length != 0 && tag2.length === 0) {
      let r = makeCombo(tag0, tag1);
      setCombo(r);
    }
    if (tag0.length != 0 && tag1.length != 0 && tag2.length != 0) {
      let r = makeCombo(tag0, tag1, tag2);
      setCombo(r);
    }
    //! one empty array two not empty
    if (tag0.length === 0 && tag1.length != 0 && tag2.length != 0) {
      let r = makeCombo(tag1, tag2);
      setCombo(r);
    }
    if (tag0.length != 0 && tag1.length === 0 && tag2.length != 0) {
      let r = makeCombo(tag0, tag2);
      setCombo(r);
    }
    if (tag0.length != 0 && tag1.length != 0 && tag2.length === 0) {
      let r = makeCombo(tag0, tag1);
      setCombo(r);
    }
    //! two empty array one not empty
    if (tag0.length === 0 && tag1.length != 0 && tag2.length === 0) {
      let r = makeCombo(tag1);
      setCombo(r);
    }
    if (tag0.length === 0 && tag1.length === 0 && tag2.length != 0) {
      let r = makeCombo(tag2);
      setCombo(r);
    }
    if (tag0.length != 0 && tag1.length === 0 && tag2.length === 0) {
      let r = makeCombo(tag0);
      setCombo(r);
    }
    //! all empty array
    if (tag0.length === 0 && tag1.length === 0 && tag2.length === 0) {
      let r = makeCombo([]);
      setCombo(r);
    }
  };

  const selectedTag1 = (tag1) => {
    if (!moreOption1) {
      if (tag0.length != 0 && tag1.length === 0 && tag2.length === 0) {
        let r = makeCombo(tag0);
        setCombo(r);
      }
      if (tag0.length != 0 && tag1.length != 0 && tag2.length === 0) {
        let r = makeCombo(tag0, tag1);
        setCombo(r);
      }
      if (tag0.length != 0 && tag1.length != 0 && tag2.length != 0) {
        let r = makeCombo(tag0, tag1, tag2);
        setCombo(r);
      }
    }
  };
  const selectedTag2 = (tag2) => {
    if (tag0.length != 0 && tag1.length === 0 && tag2.length === 0) {
      let r = makeCombo(tag0);
      setCombo(r);
    }
    if (tag0.length != 0 && tag1.length != 0 && tag2.length === 0) {
      let r = makeCombo(tag0, tag1);
      setCombo(r);
    }
    if (tag0.length != 0 && tag1.length != 0 && tag2.length != 0) {
      let r = makeCombo(tag0, tag1, tag2);
      setCombo(r);
    }
  };

  return (
    <div className="container-fluid">
      <br />
      <form onSubmit={addProduct}>
        <div className="card card-input">
          <div className="form-group">
            <label for="product_name">Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              id="product_name"
              placeholder="Enter Title of Product"
            />
          </div>
          <div className="form-group">
            <label for="product_description">Detail Description</label>
            <ReactQuill
              theme={"snow"}
              onChange={(value) => setDescription(value)}
              style={{ minHeight: "18em" }}
              value={description}
              modules={Editor.modules}
              formats={Editor.formats}
              placeholder={"Write something"}
            />
          </div>
          <div className="form-group">
            <label for="productImage">Image upload</label>
            <input
              type="file"

              name="productImage"
              className="form-control"
              onChange={(e) => setProductImage(e.target.files)}
              multiple
              accept="image/*"
            />
          </div>
        </div>
        <div className="card card-input">
          <div className="form-group">
            <label for="product_category">Category</label>
            <select
              className="form-control"
              id="product_category"
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              placeholder="Enter category"
            >
              {categoryList.map((item, i) => {
                return (
                  <option key={i} value={item.category}>
                    {item.category}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-group">
            <label for="product_id">ID/SKU</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="form-control"
              id="product_id"
              placeholder="Enter Unique Id of Product"

            />
          </div>
        </div>
        <div className="card card-input">
          <div className="form-group">
            <p style={{ marginBottom: 4, fontSize: 15 }}>PRICE</p>
            <div
              class="form-control "
              style={{
                border: "1px solid #ddd",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <span class="icon-wrapp">
                <i class="input-icon fa fa-usd"></i>
              </span>
              <input
                class="input-with-icon"
                id="form-name"
                type="text"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                id="product_price"
                style={{ border: "none", width: "48vw" }}
                placeholder="Enter Price"
              />
            </div>
          </div>

          <div className="form-group">
            <label for="product_quantity">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="0"
              className="form-control"
              id="product_quantity"
              placeholder="Enter Available Quanity of Product"
            />
          </div>
          <div className="form-group">
            <label for="product_warranty">Weight</label>
            <input
              type="text"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="form-control"
              id="product_warranty"
              placeholder="Enter Weight of Product in Grams"
            />
          </div>
          <div className="form-group">
            <label for="product_warranty">Warranty</label>
            <input
              type="text"
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
              className="form-control"
              id="product_warranty"
              placeholder="Enter Available warranty of Product"
            />
          </div>
          <div className="form-group" style={{ marginTop: 20 }}>
            <label for="product_size">Size</label>
            <input
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="form-control"
              id="product_size"
              placeholder="Enter Different sizes seperated by ',' commas"
            />
          </div>

          <div className="form-group">
            <label className="productImage">Shipping Details</label>
            <div className="custom-control custom-checkbox">
              <input
                className="form-check-input"
                type="radio"
                name="exampleRadios"
                id="exampleRadios1"
                style={{ marginRight: "10px" }}
                value="freeShipping"
                onChange={(e) => setShippingDetails(e.target.value)}
              />
              <label
                className="form-check-label shippinglabel"
                for="exampleRadios1"
              >
                Free ePacket Shipping
              </label>
            </div>
            <div className="custom-control custom-checkbox">
              <input
                className="form-check-input"
                type="radio"
                name="exampleRadios"
                id="exampleRadios2"
                style={{ marginRight: "10px" }}
                value="standardShipping"
                onChange={(e) => setShippingDetails(e.target.value)}
              />
              <label
                className="form-check-label shippinglabel"
                for="exampleRadios2"
              >
                Standard ePacket Shipping
              </label>
            </div>
            <br />
            {shippingDetails === "standardShipping" ? (
              <div>
                <h5>Shipping Price</h5>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">USA</label>
                  <div className="col-sm-10">
                    <div
                      class="form-control "
                      style={{
                        border: "1px solid #ddd",
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <span class="icon-wrapp">
                        <i class="input-icon fa fa-usd"></i>
                      </span>
                      <input
                        class="input-with-icon"
                        id="form-name"
                        type="text"
                        min="0"
                        value={usa}
                        onChange={(e) => setUsa(e.target.value)}
                        id="product_price"
                        style={{ border: "none" }}
                        placeholder="Enter Shipping Charges."
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">Canada</label>
                  <div className="col-sm-10">
                    <div
                      class="form-control "
                      style={{
                        border: "1px solid #ddd",
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <span class="icon-wrapp">
                        <i class="input-icon fa fa-usd"></i>
                      </span>
                      <input
                        class="input-with-icon"
                        id="form-name"
                        type="text"
                        min="0"
                        value={canada}
                        onChange={(e) => setCanada(e.target.value)}
                        id="product_price"
                        style={{ border: "none" }}
                        placeholder="Enter Shipping Charges."
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">
                    United Kingdom
                  </label>
                  <div className="col-sm-10">
                    <div
                      class="form-control "
                      style={{
                        border: "1px solid #ddd",
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <span class="icon-wrapp">
                        <i class="input-icon fa fa-usd"></i>
                      </span>
                      <input
                        class="input-with-icon"
                        id="form-name"
                        type="text"
                        min="0"
                        value={uk}
                        onChange={(e) => setUk(e.target.value)}
                        id="product_price"
                        style={{ border: "none" }}
                        placeholder="Enter Shipping Charges."
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">Australia</label>
                  <div className="col-sm-10">
                    <div
                      class="form-control "
                      style={{
                        border: "1px solid #ddd",
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <span class="icon-wrapp">
                        <i class="input-icon fa fa-usd"></i>
                      </span>
                      <input
                        class="input-with-icon"
                        id="form-name"
                        type="text"
                        min="0"
                        value={australia}
                        onChange={(e) => setAustralia(e.target.value)}
                        id="product_price"
                        style={{ border: "none" }}
                        placeholder="Enter Shipping Charges."
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">
                    International
                  </label>
                  <div className="col-sm-10">
                    <div
                      class="form-control "
                      style={{
                        border: "1px solid #ddd",
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <span class="icon-wrapp">
                        <i class="input-icon fa fa-usd"></i>
                      </span>
                      <input
                        class="input-with-icon"
                        id="form-name"
                        type="text"
                        min="0"
                        value={international}
                        onChange={(e) => setInternational(e.target.value)}
                        id="product_price"
                        style={{ border: "none" }}
                        placeholder="Enter Shipping Charges."
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="card card-input py-0 ll">
          <h4 className="text-left" style={{ margin: 0, marginBottom: 15 }}>
            Variants
          </h4>
          <label class="containerr">
            This product has multiple options, like different sizes or colors
            <input
              type="checkbox"
              value={varien}
              onChange={() => {
                if (varien) {
                  setVarien(false);
                  setTag0([]);
                  setTag1([]);
                  setTag2([]);
                } else {
                  setVarien(true);
                  setTag0([]);
                  setTag1([]);
                  setTag2([]);
                }
              }}
            />
            <span class="checkmarkk"></span>
          </label>
          {varien ? (
            <>
              <div
                style={{
                  maxWidth: 480,
                  marginTop: 30,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              ></div>
              <div>
                <div>
                  {/* <select
                    style={{
                      width: 150,
                      height: 40,
                      border: '1px solid grey',
                      borderRadius: 5,
                      marginBottom: 13,
                    }}
                    onChange={(e) => setOption1(e.target.value)}
                  >
                    <option value='color'>Color</option>
                    <option value='size'>Size</option>
                    <option value='style'>Style</option>
                    <option value='material'>Material</option>
                    <option value='title'>Title</option>
                  </select> */}
                  {/* <div> */}
                  <input
                    type="text"
                    name="city"
                    list="variantOptions"
                    onChange={(e) => setOption1(e.target.value)}
                    style={{
                      width: 150,
                      height: 40,
                      border: "1px solid grey",
                      borderRadius: 5,
                      marginBottom: 13,
                    }}
                  />
                  <datalist id="variantOptions">
                    <option value="color">Color</option>
                    <option value="size">Size</option>
                    <option value="style">Style</option>
                    <option value="material">Material</option>
                    <option value="title">Title</option>
                  </datalist>
                  {/* </div> */}
                </div>
                <div className="tags-input">
                  <ul id="tags">
                    {tag0.map((tag, index) => (
                      <li key={index} className="tag">
                        <span className="tag-title">{tag}</span>
                        <span
                          className="tag-close-icon"
                          onClick={() => removeTag0(index)}
                        >
                          x
                        </span>
                      </li>
                    ))}
                  </ul>
                  <input
                    type="text"
                    id="myAnchor"
                    onKeyUp={(event) =>
                      event.key === "," ? addTag0(event) : null
                    }
                    placeholder="Press ',' to add tags"
                  />
                </div>
              </div>

              {moreOption ? (
                <>
                  <div
                    style={{
                      maxWidth: 480,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <h5>Option 2</h5>
                    <h5
                      onClick={() => {
                        setMoreOption(false);
                        setTag1([]);
                      }}
                    >
                      cancel
                    </h5>
                  </div>
                  <div>
                    <div>
                      <input
                        type="text"
                        name="city"
                        list="variantOptions"
                        onChange={(e) => setOption2(e.target.value)}
                        style={{
                          width: 150,
                          height: 40,
                          border: "1px solid grey",
                          borderRadius: 5,
                          marginBottom: 13,
                        }}
                      />
                    </div>
                    <div className="tags-input">
                      <ul id="tags">
                        {tag1.map((tag, index) => (
                          <li key={index} className="tag">
                            <span className="tag-title">{tag}</span>
                            <span
                              className="tag-close-icon"
                              onClick={() => removeTag1(index)}
                            >
                              {" "}
                              x
                            </span>
                          </li>
                        ))}
                      </ul>
                      <input
                        type="text"
                        id="myAnchor1"
                        onKeyUp={(event) =>
                          event.key === "," ? addTag1(event) : null
                        }
                        placeholder="Press ',' to add tags"
                      />
                    </div>
                  </div>
                </>
              ) : null}
              {moreOption1 ? (
                <>
                  <div
                    style={{
                      maxWidth: 480,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <h5>Option 3</h5>
                    <h5
                      onClick={() => {
                        setMoreOption1(false);
                        setTag2([]);
                      }}
                    >
                      cancel
                    </h5>
                  </div>
                  <div>
                    <div>
                      <input
                        type="text"
                        name="city"
                        list="variantOptions"
                        onChange={(e) => setOption3(e.target.value)}
                        style={{
                          width: 150,
                          height: 40,
                          border: "1px solid grey",
                          borderRadius: 5,
                          marginBottom: 13,
                        }}
                      />
                    </div>
                    <div className="tags-input">
                      <ul id="tags">
                        {tag2.map((tag, index) => (
                          <li key={index} className="tag">
                            <span className="tag-title">{tag}</span>
                            <span
                              className="tag-close-icon"
                              onClick={() => removeTag2(index)}
                            >
                              x
                            </span>
                          </li>
                        ))}
                      </ul>
                      <input
                        type="text"
                        id="myAnchor2"
                        onKeyUp={(event) =>
                          event.key === "," ? addTag2(event) : null
                        }
                        placeholder="Press ',' to add tags"
                      />
                    </div>
                  </div>
                </>
              ) : null}
              {!moreOption1 ? (
                <div
                  onClick={() => {
                    if (moreOption) {
                      setMoreOption1(true);
                    } else {
                      setMoreOption(true);
                    }
                  }}
                  className="meraButton"
                >
                  More Option
                </div>
              ) : null}
              {!combo ? null : (
                <div >
                  <h4>Preview</h4>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <h5
                      style={{
                        flex: 1,
                      }}
                    >
                      Varient
                    </h5>
                    <h5
                      style={{
                        flex: 1,
                        marginLeft: -28,
                      }}
                    >
                      Price
                    </h5>
                    <h5
                      style={{
                        flex: 1,
                        marginLeft: -30,
                      }}
                    >
                      Quantity
                    </h5>
                    <h5
                      style={{
                        flex: 1,
                        marginRight: -50,
                      }}
                    >
                      SKU
                    </h5>
                  </div>
                  {combo.map((item, index) => (
                    <div key={index}>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          flexDirection: "row",
                        }}
                      >
                        <input
                        id={`varientName${index}`}
                          type="text"
                          style={{
                            flex: 1,
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                          }}
                          value={item}
                          disabled

                          className="form-control"
                        />
                        <div style={{ display: "flex", flex: 1 }}>
                          <h5
                            style={{
                              border: "1px solid #E3E3E3",
                              width: 20,
                              height: 40,
                              marginTop: 0,
                              borderRightWidth: 0,
                              borderRadius: "4px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              borderTopRightRadius: 0,
                              borderBottomRightRadius: 0,
                            }}
                          >
                            $
                          </h5>
                          <input
                          id={`varientPrice${index}`}
                            type="text"
                            style={{
                              flex: 1,
                              borderTopLeftRadius: 0,
                              borderBottomLeftRadius: 0,
                            }}
                            value={item.price}

                            className="form-control"
                          />
                        </div>
                        <input
                          type="text"
                          value={item.quantity}
                          className="form-control"
                          id={`varientQuantity${index}`}
                          style={{ flex: 1 }}
                        />
                        <input
                          type="text"
                          value={item.sku}
                          className="form-control"
                          id={`varientSku${index}`}
                          style={{ flex: 1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : null}

          <div className="card-button" style={{ marginTop: 20 }}>
            <CustomButton round fill type="submit">
              Save Product
            </CustomButton>
          </div>
        </div>
      </form>
      <br />
      <div className="container-fluid">
        <form onSubmit={addCSvProduct}>
          <div className="card card-input">
            <div className="form-group">
              <p className="text-center">
                <br />
                <strong>Or Upload CSV File</strong>
              </p>
              <div id="fileContents"></div>
              <input
                type="file"
                className="form-control text-center"
                name="avatar"
                onChange={(e) => {
                  console.log(e.target);
                  console.log(e.target.value);
                  console.log(e.target.files);
                  setCsvData(e.target.files);
                }}
                encType="multipart/form-data"
                accept=".csv"
              />
              <br />
              <div className="card-button">
                <CustomButton round fill type="submit">
                  Upload Products
                </CustomButton>
              </div>
            </div>
          </div>
        </form>
      </div>
      <br />
    </div>
  );
};

export default AddProduct;