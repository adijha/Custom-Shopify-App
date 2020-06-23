import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Row, Col, Table, DropdownButton } from "react-bootstrap";
import Modal from "react-responsive-modal";
import jwt_decode from "jwt-decode";
import Card from "../components/Card/Card.jsx";
import "../assets/css/productPage.css";

const Products = () => {
  const [productList, setProductList] = useState([]);
  const [open, setOpen] = useState(false);
  const [singleProduct, setSingleProduct] = useState([]);
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState([]);
  const token = localStorage.getItem("token");
  let decode = jwt_decode(token);

  useEffect(() => {
    getProductList();
    getCategoryList();
  }, []);

  let str = decode.email;
  let VendorString = str.substring(0, str.lastIndexOf("@"));
  console.log(VendorString);

  const getProductList = () => {
    axios.get("/api/product").then((data) => {
      console.log("get api of product list", data);
      setProductList(data.data);
    });
  };

  const getProductId = (list) => {
    //console.log(list._id);
    axios.get("/api/product/" + list._id).then((item) => {
      console.log("single pronduct detail", item);
      setSingleProduct(item.data);
      setOpen(true);
    });
  };

  const onCloseModal = () => {
    setOpen(false);
    setMsg("");
  };

  const filterItems = productList.filter((plist) => {
    return plist.name.toLowerCase().includes(search.toLowerCase());
  });

  const handlClick = (e) => {
    e.preventDefault();
    let unsorted = filterItems;
    console.log("unsorted", unsorted);
    if (e.target.value === "asce") {
      setProductList(
        filterItems.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      );
    } else if (e.target.value == "desc") {
      setProductList(
        filterItems.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
      );
    }
  };

  const getCategoryList = () => {
    axios.get("/api/totalCategory/").then((response) => {
      setCategory(response.data);
    });
  };

  const handleCategory = (e) => {
    e.preventDefault();
    const selectedCategory = e.target.value;
    console.log("selectedCategory", selectedCategory);

    if (selectedCategory === "Select Category") {
      getProductList();
      setStatus("");
    } else {
      axios.get("/api/product/filter/" + selectedCategory).then((response) => {
        if (response.data.length) {
          setProductList(response.data);
          setStatus("");
        } else {
          setStatus("No Product of This Category : " + selectedCategory);
        }
      });
    }
  };

  const AddInShopify = (t) => {
    let imageArray = [];

    t.productImage.forEach((item, i) => {
      imageArray.push({
        attachment: item.imgBufferData,
      });
    });

    let tagArray = t.tag.split(", ");
    let colorArray = t.color.split(", ");
    let sizeArray = t.size.split(", ");
    let colorVariant = [];
    let str = decode.email;
    let VendorString = str.substring(0, str.lastIndexOf("@"));

    colorArray.forEach((single, j) => {
      colorVariant.push({
        option1: single,
        price: t.price,
        size: t.size,
        inventory_quantity: t.quantity,
        sku: t.code,
      });
    });

    let product = {
      product: {
        title: t.name,
        body_html: t.description,
        vendor: VendorString,
        product_type: t.category,
        tags: tagArray,
        variants: colorVariant,
      },
    };
    console.log("product added for shopify is", product);
    axios.post("/addToShopify/" + VendorString, product).then((data) => {
      setMsg("Product Added in Shopify");
    });
  };

  return (
    <div className="" style={{ overflowX: "hidden" }}>
      <div>
        <h2 className="text-center">
          Product <span style={{ color: "#ff9f1a" }}>Collection</span>
        </h2>

        <hr
          style={{ width: "20%", color: "antiquewhite", border: "1px solid" }}
        />
        <div
          className="text-right container arrow"
          style={{
            width: "80%",
            backgroundColor: "antiquewhite",
            marginLeft: "1rem",
          }}
        >
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
              >
                {category.map((item) => {
                  return (
                    <div class="btn-group" role="group">
                      <button
                        value={item.category}
                        onClick={(e) => handleCategory(e)}
                        className="btn btn-primary"
                      >
                        {item.category}
                      </button>
                    </div>

                    //<button style={{marginLeft:"10px"}}className="btn btn-primary" value={item.category} onClick={e=>console.log(e.target.value)}>{item.category}</button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="container-fluid"
        style={{ backgroundColor: "", padding: "6px", paddingTop: "2em" }}
      >
        <div className="text-center" style={{ color: "red" }}>
          {status}
        </div>
        {filterItems.map((list) => {
          return (
            <div className="col-sm-3" onClick={() => getProductId(list)}>
              <article className="col-item item column-item">
                <div className="photo">
                  <div className="options-cart-round">
                    <button className="btn btn-default" title="Add to cart">
                      <span
                        className="fa fa-eye"

                      />
                    </button>
                  </div>

                  <a href="#">
                    {list.productImage[0] ? (
                      <img
                        src={`data:image/jpeg;base64, ${list.productImage[0].imgBufferData}`}
                        className="img-responsive"
                        alt="Product Image"
                      />
                    ) : (
                      <h5>no image available</h5>
                    )}
                  </a>
                </div>
                <div className="info">
                  <div className="row">
                    <div className="price-details col-md-6">
                      <h1>
                        <b>{list.name}</b>
                      </h1>
                      <span className="price-new">
                        <b>&#8377;</b>
                        {list.price.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="container-fluid">
          <div className="text-center" style={{ color: "green" }}>
            {msg}
          </div>
          {singleProduct.map((product) => {
            return (
              <div className="card card-class">
                <div className="container-fliud">
                  <div className=" row">
                    <div className="preview col-md-6">
                      <div className="preview-pic tab-content">
                        <div className="tab-pane active" id="pic-1">
                          {product.productImage[0] ? (
                            <img
                              src={`data:image/jpeg;base64, ${product.productImage[0].imgBufferData}`}
                            />
                          ) : (
                            <h5>no image available</h5>
                          )}
                        </div>
                        <div className="tab-pane" id="pic-2">
                          {product.productImage[0] ? (
                            <img
                              src={`data:image/jpeg;base64, ${product.productImage[1].imgBufferData}`}
                            />
                          ) : (
                            <h5>no image available</h5>
                          )}
                        </div>
                      </div>
                      <ul className="preview-thumbnail nav nav-tabs">
                        <li className="active">
                          <a data-target="#pic-1" data-toggle="tab">
                            {product.productImage[0] ? (
                              <img
                                src={`data:image/jpeg;base64, ${product.productImage[0].imgBufferData}`}
                              />
                            ) : (
                              <h5>no image available</h5>
                            )}
                          </a>
                        </li>
                        <li>
                          <a data-target="#pic-2" data-toggle="tab">
                            {product.productImage[1] ? (
                              <img
                                src={`data:image/jpeg;base64, ${product.productImage[1].imgBufferData}`}
                              />
                            ) : (
                              <h5>no image available</h5>
                            )}
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="details col-md-6">
                      <h3 className="product-title">{product.name}</h3>
                      <div className="rating">
                        <div className="stars">
                          <span className="fa fa-star checked" />
                          <span className="fa fa-star checked" />
                          <span className="fa fa-star checked" />
                          <span className="fa fa-star" />
                          <span className="fa fa-star" />
                        </div>
                        <span className="review-no">41 reviews</span>
                      </div>
                      <p className="product-description">
                        HtmlConvert({product.description})
                      </p>
                      <h4 className="price">
                        current price: <span>&#x20b9;{product.price}</span>
                      </h4>
                      <p className="vote">
                        <strong>91%</strong> of buyers enjoyed this product!
                        <br /> <br />
                        <strong>87 votes</strong>
                      </p>
                      <h5 className="sizes">
                        Available Quantity: <span>{product.quantity}</span>
                      </h5>
                      <button
                        onClick={() => AddInShopify(product)}
                        className="btn btn-primary"
                      >
                        Add To Shopify
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};
export default Products;
