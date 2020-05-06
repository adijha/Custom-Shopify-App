import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // ES6
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
  const [color, setColors] = useState("");
  const [tags, setTags] = useState([]);
  const [tag1, setTag1] = useState([]);
  const [tag2, setTag2] = useState([]);
  const [varien, setVarien] = useState(true);
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const token = localStorage.getItem("token");
  const decode = jwt_decode(token);
  const [moreOption, setMoreOption] = useState(false);
  const [moreOption1, setMoreOption1] = useState(false);
  const [combo, setCombo] = useState([]);
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
  const addProduct = (e) => {
    e.preventDefault();

    const data = new FormData();
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
    data.append("color", color);
    // data.append("tag", tag);
    console.log("data", data);
    // axios
    //   .post('/api/addProduct', data)
    //   .then(item => {
    //     if (item) {
    //       NotificationManager.success("Product Added Successfully");
    //       console.log(item.config)
    //       setStatus("Product Added Successfully")
    //       setName("")
    //       setPrice("")
    //       setQuantity("")
    //       setWarranty("")
    //       setDescription("")
    //       setCategory("")
    //       setCode("")
    //       setProductImage([])
    //     }
    //   })
    //   .catch(err => {
    //     console.log("add product error is:", err.message)
    //   })

    NotificationManager.error(
      "We are improving varient section, until you cannot add product"
    );
  };

  //Add Product from CSV File
  const addCSvProduct = (e) => {
    e.preventDefault();
    const scvdata = new FormData();
    scvdata.append("file", csvData[0]);
    scvdata.append("supplier_id", decode.id);
    axios
      .post("/api/product/csv", scvdata)
      .then((item) => {
        console.log("file uploaded");
        setStatus("File uploaded Successfully");
      })
      .catch((error) => {
        console.log("csv product :", error.message);
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
        if (i == max) r.push(a);
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
        if (str == "") {
          str = element;
        } else str = str + " / " + element;
      }
      r[i] = str;
      res = r;
    }

    return res;
  }

  //Fetch category List
  const getCategoryList = () => {
    axios.get("/api/totalCategory").then((data) => {
      console.log("category list is", data.data);
      setCategoryList(data.data);
    });
  };

  useEffect(() => {
    if (varien) document.getElementById("myAnchor").focus();
  }, [tags]);
  useEffect(() => {
    handelDelete();
  }, [tags]);
  useEffect(() => {
    if (moreOption) document.getElementById("myAnchor1").focus();
  }, [tag1]);
  useEffect(() => {
    handelDelete();
  }, [tag1]);
  useEffect(() => {
    if (moreOption1) document.getElementById("myAnchor2").focus();
  }, [tag2]);
  useEffect(() => {
    handelDelete();
  }, [tag2]);

  //tags
  const TagsInput = (props) => {
    const removeTags = (indexToRemove) => {
      setTags([...tags.filter((_, index) => index !== indexToRemove)]);
    };
    const addTags = (event) => {
      if (event.target.value !== "") {
        let value = event.target.value.replace(/,/g, "");
        setTags([...tags, value]);
        props.selectedTags([...tags, value]);
        event.target.value = "";
      }
    };
    return (
      <div className="tags-input">
        <ul id="tags">
          {tags.map((tag, index) => (
            <li key={index} className="tag">
              <span className="tag-title">{tag}</span>
              <span
                className="tag-close-icon"
                onClick={() => removeTags(index)}
              >
                x
              </span>
            </li>
          ))}
        </ul>
        <input
          type="text"
          id="myAnchor"
          onKeyUp={(event) => (event.key === "," ? addTags(event) : null)}
          placeholder="Press ',' to add tags"
        />
      </div>
    );
  };

  const TagsInput1 = (props) => {
    const removeTag1 = (indexToRemove) => {
      setTag1([...tag1.filter((_, index) => index !== indexToRemove)]);
    };
    const addTag1 = (event) => {
      if (event.target.value !== "") {
        let value = event.target.value.replace(/,/g, "");
        setTag1([...tag1, value]);
        props.selectedTag1([...tag1, value]);
        // props.selectedTag1([value]);
        event.target.value = "";
      }
    };
    return (
      <div className="tags-input">
        <ul id="tags">
          {tag1.map((tag, index) => (
            <li key={index} className="tag">
              <span className="tag-title">{tag}</span>
              <span
                className="tag-close-icon"
                onClick={() => removeTag1(index)}
              >
                x
              </span>
            </li>
          ))}
        </ul>
        <input
          type="text"
          id="myAnchor1"
          onKeyUp={(event) => (event.key === "," ? addTag1(event) : null)}
          placeholder="Press ',' to add tags"
        />
      </div>
    );
  };
  const TagsInput2 = (props) => {
    const removeTag2 = (indexToRemove) => {
      setTag2([...tag2.filter((_, index) => index !== indexToRemove)]);
    };
    const addTag2 = (event) => {
      if (event.target.value !== "") {
        let value = event.target.value.replace(/,/g, "");
        setTag2([...tag2, value]);
        props.selectedTag2([...tag2, value]);
        event.target.value = "";
      }
    };
    return (
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
          onKeyUp={(event) => (event.key === "," ? addTag2(event) : null)}
          placeholder="Press ',' to add tags"
        />
      </div>
    );
  };
  const logcombo = (params) => {
    console.log(tags);
    console.log(tag1);
    console.log(tag2);
    console.log(combo);
    console.log(" ");
  };

  const selectedTags = (tag) => {
    if (!moreOption || !moreOption1) {
      if (tag.length != 0 && tag1.length == 0 && tag2.length == 0) {
        let r = makeCombo(tag);
        setCombo(r);
      }
      if (tags.length != 0 && tag1.length != 0 && tag2.length == 0) {
        let r = makeCombo(tags, tag1);
        setCombo(r);
      }
      if (tags.length != 0 && tag1.length != 0 && tag2.length != 0) {
        let r = makeCombo(tags, tag1, tag2);
        setCombo(r);
      }
    }
  };

  const handelDelete = () => {
    if (tags.length != 0 && tag1.length == 0 && tag2.length == 0) {
      let r = makeCombo(tags);
      setCombo(r);
    }
    if (tags.length != 0 && tag1.length != 0 && tag2.length == 0) {
      let r = makeCombo(tags, tag1);
      setCombo(r);
    }
    if (tags.length != 0 && tag1.length != 0 && tag2.length != 0) {
      let r = makeCombo(tags, tag1, tag2);
      setCombo(r);
    }
    //!empty bug fixing
    // if (tags.length == 0) {
    //   let r = makeCombo(tag1, tag2);
    //   setCombo(r);
    // }
  };

  const selectedTag1 = (tag1) => {
    if (!moreOption1) {
      if (tags.length != 0 && tag1.length == 0 && tag2.length == 0) {
        let r = makeCombo(tags);
        setCombo(r);
      }
      if (tags.length != 0 && tag1.length != 0 && tag2.length == 0) {
        let r = makeCombo(tags, tag1);
        setCombo(r);
      }
      if (tags.length != 0 && tag1.length != 0 && tag2.length != 0) {
        let r = makeCombo(tags, tag1, tag2);
        setCombo(r);
      }
    }
  };
  const selectedTag2 = (tag2) => {
    if (tags.length != 0 && tag1.length == 0 && tag2.length == 0) {
      let r = makeCombo(tags);
      setCombo(r);
    }
    if (tags.length != 0 && tag1.length != 0 && tag2.length == 0) {
      let r = makeCombo(tags, tag1);
      setCombo(r);
    }
    if (tags.length != 0 && tag1.length != 0 && tag2.length != 0) {
      let r = makeCombo(tags, tag1, tag2);
      setCombo(r);
    }
  };

  return (
    <div className="container-fluid">
      <br />
      <form onSubmit={addProduct}>
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
                varien ? setVarien(false) : setVarien(true);
              }}
            />
            <span class="checkmarkk"></span>
          </label>

          <div onClick={() => logcombo()}>logcombo</div>
          {varien ? (
            <>
              <div
                style={{
                  maxWidth: 480,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <h5>Option 1</h5>
                <h5 onClick={() => varien(false)}>cancel</h5>
              </div>
              <div>
                <div>
                  <select
                    style={{
                      width: 150,
                      height: 40,
                      border: "1px solid grey",
                      borderRadius: 5,
                      marginBottom: 13,
                    }}
                    onChange={(value) => setOption1(value)}
                  >
                    <option value="color">Color</option>
                    <option value="size">Size</option>
                    <option value="style">Style</option>
                    <option value="material">Material</option>
                    <option value="title">Title</option>
                  </select>
                </div>

                <TagsInput selectedTags={selectedTags} tags={[]} />
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
                    <h5 onClick={() => setMoreOption(false)}>cancel</h5>
                  </div>
                  <div>
                    <div>
                      <select
                        style={{
                          width: 150,
                          height: 40,
                          border: "1px solid grey",
                          borderRadius: 5,
                          marginBottom: 13,
                        }}
                        onChange={(value) => setOption1(value)}
                      >
                        <option value="color">Color</option>
                        <option value="size">Size</option>
                        <option value="style">Style</option>
                        <option value="material">Material</option>
                        <option value="title">Title</option>
                      </select>
                    </div>

                    <TagsInput1 selectedTag1={selectedTag1} tags1={[]} />
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
                    <h5 onClick={() => moreOption1(false)}>cancel</h5>
                  </div>
                  <div>
                    <div>
                      <select
                        style={{
                          width: 150,
                          height: 40,
                          border: "1px solid grey",
                          borderRadius: 5,
                          marginBottom: 13,
                        }}
                        onChange={(value) => setOption1(value)}
                      >
                        <option value="color">Color</option>
                        <option value="size">Size</option>
                        <option value="style">Style</option>
                        <option value="material">Material</option>
                        <option value="title">Title</option>
                      </select>
                    </div>
                    <TagsInput2 selectedTag2={selectedTag2} tag2={[]} />
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

              {/* <div className="form-group" style={{ marginTop: 20 }}>
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
            </div> */}
            </>
          ) : null}
        </div>
        {/* 
        <div className="card card-input">
          <div className="form-group">
            <label for="product_category">Category</label>
            <select
              className="form-control"
              id="product_category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category of Product"
            >
              {categoryList.map((item, i) => {
                return <option key={i}>{item.category}</option>;
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
              required
            />
          </div>
        </div> */}
        {/* 
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
              required
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
            <p style={{ marginBottom: 4, fontSize: 15 }}>PRICE</p>
            <div
              class="form-control "
              style={{
                border: "1px solid #ddd",
                display: "flex",
                flexDirection: "row",
              }}>
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
                required
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
              required
            />
          </div>
          <div className="form-group">
            <label for="product_warranty">Weight</label>
            <input
              type="number"
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
        </div> */}

        <div className="card-button">
          <button type="submit" className="btn btn-primary btn-sm">
            Save Product
          </button>
        </div>
      </form>
      {/* <br />
      <div className="container-fluid">
        <form onSubmit={addCSvProduct}>
          <div className="card card-input">
            <div className="form-group">
              <p className="text-center">
                <br />
                <strong>Or Upload CSV File</strong>
              </p>
              <input
                type="file"
                className="form-control text-center"
                name="avatar"
                onChange={(e) => setCsvData(e.target.files)}
                encType="multipart/form-data"
              />
              <br />
              <button
                className="btn btn-primary btn-sm"
                type="submit"
                name="button"
              >
                submit
              </button>
            </div>
          </div>
        </form>
      </div>
      <br /> */}
    </div>
  );
};

export default AddProduct;
