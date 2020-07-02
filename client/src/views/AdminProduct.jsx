import React, { useState, useEffect } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Modal from "react-responsive-modal";

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
  const [search, setSearch] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [expand, setExpand] = useState("");
  const [sDetail, setSDetail] = useState({});

  const modalStyle = {
    margin: "auto",
    position: "relative",
  };

  useEffect(() => {
    getProductData();
    getCategoryList();
  }, []);

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
    setOpen(true);
  };

  const onCloseModal = () => {
    setOpen(false);
  };

  const deleteProduct = (item) => {
    console.log("delete" + item._id);
    axios.delete("/api/product/" + item._id).then((data) => {
      if (data) {
        setStatus("Product Deleted");
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
    };
    console.log(object);
    axios
      .patch("/api/product/update", object)
      .then((data) => {
        if (data) {
          setStatus("Product Updated Successfully");
          setName("");
          setPrice("");
          setQuantity("");
          setWarranty("");
          setDescription("");
          setCategory("");
          setCode("");
          setOpen(false);
          getProductData();
        }
      })
      .catch((err) => {
        console.log("update product error is:", err.message);
      });
  };

  const getSupplierDetail = async (id) => {
    console.log("id is", id);

    const supplierDetail = await axios.get("/api/supplierDetails/" + id);
    setSDetail(supplierDetail.data);
  };

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
                        <th>Supplier Id</th>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Category</th>
                        <th>Price</th>
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
                              <td style={{width:"16%"}}>
                                {item.productImage.length != 0 ? (
                                  <img
                                    className="product-logo"
                                    src={`data:image/jpeg;base64, ${item.productImage[0].imgBufferData}`}
                                  />
                                ) : (
                                  "No Image Available"
                                )}
                              </td>
                              <td>{item.supplier_id}</td>
                              <td>
                                <a href={"/admin/single-product/" + item._id}>
                                  {item.name}
                                </a>
                              </td>
                              <td>{item.code}</td>
                              <td>{item.category}</td>
                              <td>${item.price.toFixed(2)}</td>
                              <td>{item.order}</td>
                              <td>${item.revenue}</td>
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
                                    Total Revenue :- ${sDetail.revenue || 0}
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
          </div>
          <div className="card card-update">
            <div className="form-group">
              <label for="product_price">Price</label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="form-control"
                id="product_price"
                placeholder="Enter Price of Product"
                required
              />
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
              <label for="product_warranty">Warranty</label>
              <input
                type="text"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                className="form-control"
                id="product_warranty"
                placeholder="Enter Available warranty of Product"
                required
              />
            </div>
          </div>
          <div className="card card-update">
            <div className="form-group">
              <label for="product_description">Detail Description</label>
              <textarea
                className="form-control"
                rows="6"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="product_description"
                placeholder="Enter Description of Product"
                required
              />
            </div>
          </div>
          <div className="card-button">
            <button type="submit" className="btn btn-primary btn-sm">
              Update Product
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProduct;
