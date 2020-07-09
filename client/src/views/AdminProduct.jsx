import React, { useState, useEffect } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Modal from "react-responsive-modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { NotificationManager } from "react-notifications";
import CustomButton from "../components/CustomButton/CustomButton.jsx";

import Card from "../components/Card/Card.jsx";
import "../assets/css/productList.css";

const AdminProduct = () => {
  const [productItems, setProductItems] = useState([]);
  const token = localStorage.getItem("token");
  const decode = jwt_decode(token);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [warranty, setWarranty] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const [itemId, setItemId] = useState("");
  const [open, setOpen] = useState(false);
  const [varient, setVarient] = useState([]);
  const [shippingDetails, setShippingDetails] = useState("");
  const [usa, setUsa] = useState(2.5);
  const [canada, setCanada] = useState(2.5);
  const [uk, setUk] = useState(2.5);
  const [australia, setAustralia] = useState(2.5);
  const [international, setInternational] = useState(2.5);

  const [search, setSearch] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [expand, setExpand] = useState("");
  const [sDetail, setSDetail] = useState({});
  const [productImage, setProductImage] = useState([])

  const modalStyle = {
    margin: "auto",
    position: "relative",
  };
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
  useEffect(() => {
    getProductData();
    getCategoryList();
  }, []);
  const updateFieldChanged = (index, ref) => (e) => {
    console.log("index: " + index);

    console.log("property name: " + e.target.name);

    let newArr = [...varient]; // copying the old datas array

    switch (ref) {
      case "price":
        newArr[index].price = e.target.value;
        break;
      case "quantity":
        newArr[index].quantity = e.target.value;
        break;
      case "sku":
        newArr[index].sku = e.target.value;
        break;
      default:
        newArr[index].price = e.target.value;
        break;
    }
    setVarient(newArr);
  };
  const getProductData = () => {
    axios.get("/api/customProductDetail").then((data) => {
      console.log("get api of product list", data);
      setProductItems(data.data);
    });
  };

  //filterItems
  const filterItems = productItems.filter((plist) => {
    return plist.name.toLowerCase().includes(search.toLowerCase());
  });

  const handlClick = (e) => {
    e.preventDefault();
    let unsorted = filterItems;
    console.log("unsorted", unsorted);
    if (e.target.value === "asce") {
      setProductItems(
        filterItems.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      );
    } else if (e.target.value == "desc") {
      setProductItems(
        filterItems.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
      );
    }
  };

  const getCategoryList = async () => {
    const cData = await axios.get("/api/totalCategory");
    setCategoryList(cData.data);
  };

  const handleCategory = (e) => {
    e.preventDefault();
    const selectedCategory = e.target.value;
    console.log("selectedCategory", selectedCategory);

    if (selectedCategory === "Select Category") {
      getProductData();
      setStatus("");
    } else {
      axios.get("/api/product/filter/" + selectedCategory).then((response) => {
        if (response.data.length) {
          setProductItems(response.data);
          setStatus("");
        } else {
          setStatus("No Product of This Category : " + selectedCategory);
        }
      });
    }
  };

  const updateProduct = (item) => {
    console.log("updateProduct", item._id);
    setName(item.name);
    setPrice(item.price);
    setQuantity(item.quantity);
    setWarranty(item.warranty);
    setDescription(item.description);
    setCategory(item.category);
    setCode(item.code);
    setItemId(item._id);
    setVarient(item.varientArray);
    setCanada(item.shippingCharge.canada);
    setAustralia(item.shippingCharge.australia);
    setInternational(item.shippingCharge.international);
    setUsa(item.shippingCharge.usa);
    setUk(item.shippingCharge.unitedKingdom);
    setShippingDetails(item.shippingCharge.method)
    setProductImage(item.productImage)
    setOpen(true);
  };

  const onCloseModal = () => {
    setOpen(false);
  };

  const deleteProduct = (item) => {
    console.log("delete" + item._id);
    axios.delete("/api/product/" + item._id).then((data) => {
      if (data) {
        NotificationManager.success("Product Deleted");
        getProductData();
      }
    });
  };

  const updateProductItem = (e) => {
    e.preventDefault();
    const object = {
      _id: itemId,
      name: name,
      price: price,
      quantity: quantity,
      warranty: warranty,
      description: description,
      category: category,
      code: code,
      varients: varient,
      shippingCharge: {
        australia,
        canada,
        international,
        uk,
        usa,
      },
      productImage: productImage

    };
    console.log(object);
    axios
      .patch("/api/product/update", object)
      .then((data) => {
        if (data) {
          NotificationManager.success("Product Updated Successfully");
          setName("");
          setPrice("");
          setQuantity("");
          setWarranty("");
          setDescription("");
          setCategory("");
          setCode("");
          setCanada("");
          setAustralia("");
          setInternational("");
          setUsa("");
          setUk("");
          setOpen(false);
          getProductData();
        }
      })
      .catch((err) => {
        NotificationManager.error("Something Unexpected Happened");
      });
  };

  const getSupplierDetail = async (id) => {
    console.log("id is", id);

    const supplierDetail = await axios.get("/api/supplierDetails/" + id);
    setSDetail(supplierDetail.data);
  };

  const getRange = (arr) => {
    console.log("arr", arr);
    let maxValue = arr.reduce(function (prev, curr) {
      return parseFloat(prev.price) > parseFloat(curr.price) ? prev : curr;
    });
    let minValue = arr.reduce(function (prev, curr) {
      return parseFloat(prev.price) < parseFloat(curr.price) ? prev : curr;
    });

    let range =
      "$" +
      `${new Intl.NumberFormat("en-US").format(
        parseFloat(minValue.price).toFixed(2)
      )}` +
      "-" +
      `${new Intl.NumberFormat("en-US").format(
        parseFloat(maxValue.price).toFixed(2)
      )}`;
    return range;
  };

  const getSellingRange = (arr) => {
    let maxSellingValue = arr.reduce(function (prev, curr) {
      return parseFloat(prev.selliingPrice) > parseFloat(curr.selliingPrice)
        ? prev
        : curr;
    });
    let minSellingValue = arr.reduce(function (prev, curr) {
      return parseFloat(prev.selliingPrice) < parseFloat(curr.selliingPrice)
        ? prev
        : curr;
    });
    let sellingRange =
      "$" +
      `${new Intl.NumberFormat("en-US").format(
        parseFloat(minSellingValue.selliingPrice).toFixed(2)
      )}` +
      "-" +
      `${new Intl.NumberFormat("en-US").format(
        parseFloat(maxSellingValue.selliingPrice).toFixed(2)
      )}`;
    console.log("selling", sellingRange);
    return sellingRange;
  };







    const showImage = async e =>{
      // e.preventDefault();
      // console.log("pLength", e.target.files.length);
      // let images = []
      // let images1=[]
      // for (var i = 0; i < e.target.files.length; i++) {
      //   images.push(e.target.files[i])
      //
      // }
      //
      // // images.forEach((item, i) => {
      // //   let imgUrl =  newBuffData(item)
      // //   console.log(imgUrl);
      // // });
      // //let data = await newBuffData(images)
      // setProductImage(...productImage, data)

    }

    const handleDeleteImage = (data, indexToRemove) =>{
      setProductImage([...productImage.filter((_, index) => index !== indexToRemove)]);

    }



  return (
    <div style={{ overflowX: "hidden" }}>
      <br />
      <div id="hideStatus" className="status text-center">
        {status}
      </div>
      <br />
      <div>
        <div className="text-right  arrow">
          <ul
            className="category text-center"
            style={{
              listStyle: "none",
              padding: "1em",
              position: "relative",
              display: "flex",
            }}
          >
            <li>
              <input
                type="search"
                onChange={(e) => setSearch(e.target.value)}
                className="primary"
                placeholder="search product"
                style={{ width: "400px" }}
              />
            </li>
            <li>
              <select onChange={(e) => handlClick(e)}>
                <option value="all">Sort: Price</option>
                <option value="asce">Sort: Low to High</option>
                <option value="desc">Sort: High to Low</option>
              </select>
            </li>
            <li>
              <select
                onChange={(e) => {
                  handleCategory(e);
                }}
                placeholder="Enter category"
              >
                <option value="Select Category">Select Category</option>
                {categoryList.map((item, i) => {
                  return (
                    <option key={i} value={item.category}>
                      {item.category}
                    </option>
                  );
                })}
              </select>
            </li>
          </ul>
        </div>
      </div>
      <div class="container">
        <div class="row">
          <div className="col-xs-offset 1 col-xs-11 col-sm-offset-2 col-sm-8 col-md-offset-3 col-md-6">
            <div className="btn-toolbar" role="toolbar">
              <div
                className="btn-group btn-group-justified"
                role="group"
                style={{}}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Product List"
                category={"Total Products :" + productItems.length}
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>image</th>
                        <th>Supplier Name</th>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>selliingPrice</th>
                        <th>Total No. Of Orders</th>
                        <th>Total Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterItems.map((item, key) => {
                        return (
                          <>
                            <tr
                              key={key}
                              onClick={() => {
                                if (expand === item._id) {
                                  setExpand(null);
                                } else {
                                  setExpand(item._id);
                                  getSupplierDetail(item.supplier_id);
                                }
                              }}
                            >
                              {/*  <td style={{width:"15%"}}><img className="product-logo" src={`data:image/jpeg;base64, ${item.productImage[0].imgBufferData}`} /></td>*/}
                              <td style={{ width: "16%" }}>
                                {item.productImage.length != 0 ? (
                                  <img
                                    className="product-logo"
                                    src={`data:image/jpeg;base64, ${item.productImage[0].imgBufferData}`}
                                  />
                                ) : (
                                  "No Image Available"
                                )}
                              </td>
                              <td>{item.supplier_name}</td>
                              <td>
                                <a href={"/admin/single-product/" + item._id}>
                                  {item.name}
                                </a>
                              </td>
                              <td>{item.code}</td>
                              <td>{item.category}</td>
                              <td>
                                {item.varientArray.length !== 0
                                  ? getRange(item.varientArray)
                                  : `$`(
                                      new Intl.NumberFormat("en-US").format(
                                        item.price.toFixed(2)
                                      )
                                    )}
                              </td>
                              <td>
                                {item.varientArray.length !== 0
                                  ? getSellingRange(item.varientArray)
                                  : `$`(
                                      new Intl.NumberFormat("en-US").format(
                                        item.selliingPrice.toFixed(2)
                                      )
                                    )}
                              </td>

                              <td>{item.order}</td>
                              <td>
                                $
                                {new Intl.NumberFormat("en-US").format(
                                  item.revenue
                                )}
                              </td>
                              <td>
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => updateProduct(item)}
                                >
                                  Edit
                                </button>
                              </td>
                              <td>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => deleteProduct(item)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>

                            {expand === item._id ? (
                              <tr key={9898989}>
                                <td colSpan="4">
                                  <th>Supplier Details</th>
                                  <tr>Id :- {sDetail.supplier_id}</tr>

                                  <tr>Name :- {sDetail.name || "NA"}</tr>
                                  <tr>Email :-{sDetail.email} </tr>
                                </td>

                                <td colSpan="4">
                                  <tr>
                                    Total no. of products :-{" "}
                                    {sDetail.product || 0}
                                  </tr>
                                  <tr>
                                    Total no. of orders :- {sDetail.order || 0}
                                  </tr>
                                  <tr>
                                    Total Revenue :- $
                                    {new Intl.NumberFormat("en-US").format(
                                      sDetail.revenue || 0
                                    )}
                                  </tr>
                                </td>
                              </tr>
                            ) : null}
                          </>
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
      <Modal open={open} onClose={() => setOpen(false)}>
        <br />
        <h3 style={{ color: "red" }} className="text-center">
          Edit Product Details:
        </h3>
        <br />

        <form style={modalStyle} onSubmit={updateProductItem}>
          <div className="card card-update">
            <div className="form-group">
              <label for="product_description">Description</label>
              <ReactQuill
                required
                theme={"snow"}
                style={{ maxHeight: '18em' }}
                onChange={(value) => setDescription(value)}
                value={description}
                modules={Editor.modules}
                formats={Editor.formats}
                placeholder={"Write description"}
              />
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
              <label for="product_category">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-control"
                id="product_category"
                placeholder="Enter category of Product"
                required
              />
            </div>

            <div className="form-group">
              <p style={{ marginBottom: 4, fontSize: 15 }}>Price</p>
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
                placeholder="Enter available quantity of product"
                required
              />
            </div>

            {/* ---------------------------- */}

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

            {/* ---------------------------- */}

            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ flex: 1 }}>Varient</p>
                <p style={{ flex: 1 }}>Price</p>
                <p style={{ flex: 1 }}>Quantity</p>
                <p style={{ flex: 1 }}>SKU</p>
              </div>
              {varient.map((e, index) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label style={{ flex: 1 }} for="product_warranty">
                    {e.varient}
                  </label>
                  <input
                    style={{ flex: 1 }}
                    type="text"
                    value={e.price}
                    onChange={updateFieldChanged(index, "price")}
                    className="form-control"
                    id="product_warranty"
                    placeholder="Price in dollers"
                    required
                  />
                  <input
                    style={{ flex: 1 }}
                    type="text"
                    value={e.quantity}
                    onChange={updateFieldChanged(index, "quantity")}
                    className="form-control"
                    id="product_warranty"
                    placeholder="Enter Quantity"
                    required
                  />
                  <input
                    style={{ flex: 1 }}
                    type="text"
                    value={e.sku}
                    onChange={updateFieldChanged(index, "sku")}
                    className="form-control"
                    id="product_warranty"
                    placeholder="Enter SKU"
                    required
                  />
                </div>
              ))}
            </div>
            <br/>
            <div className="form-group">
            {productImage.map((data, i)=>{
              return(
                <div className="col-md-3">
                <button style={{display:"flex"}} type="button" className="close" aria-label="Close" onClick={()=>handleDeleteImage(data, i)}>
                  <span aria-hidden="true">&times;</span>
                </button>

                <img src={`data:image/jpeg;base64, ${data.imgBufferData}`} alt="upload-Image" />
                </div>

              )
            })}
            </div>
          </div>


          <div className="card-button">
            <CustomButton round fill type="submit">
              Update Product
            </CustomButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProduct;
