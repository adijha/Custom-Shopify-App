import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-responsive-modal";
import jwt_decode from "jwt-decode";
import "../assets/css/productPage.css";
import { NotificationManager } from "react-notifications";

const Products = () => {
  const [productList, setProductList] = useState([]);
  const [open, setOpen] = useState(false);
  const [singleProduct, setSingleProduct] = useState([]);
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState([]);
  const [moreCategory, setMoreCategory] = useState(false);
  const token = localStorage.getItem("token");
  const [moreDesc, setMoreDesc] = useState(false);
  let decode = jwt_decode(token);

  useEffect(() => {
    getProductList();
    getCategoryList();
  }, []);

  let str = decode.email;
  let VendorString = str.substring(0, str.lastIndexOf("@"));
  console.log(VendorString);

  let storeName = `${decode.store}.myshopify.com`;
  console.log(storeName.toLowerCase(), "storeName final");

  const getProductList = () => {
    axios.get("/api/product").then((data) => {
      console.log("get api of product list", data);

      let all = data.data;
      all = all.sort(
        (a, b) => new Date(b.uploaded_on) - new Date(a.uploaded_on)
      );
      all.forEach((e, i) => {
        console.log({ e });
        if (e.varientArray.length > 0) {
          // console.log(getSellingRange(e.varientArray));

          all[i].lowRange = getSellingRange(e.varientArray);
          all[i].highRange = getHighRange(e.varientArray);
        } else {
          all[i].lowRange = e.price.toString();
          all[i].highRange = e.price.toString();
        }
      });
      console.log({ all });
      console.log(data.data);
      setProductList(all);
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
  //sort
  const handlClick = (e) => {
    e.preventDefault();
    let unsorted = filterItems;
    console.log("unsorted", unsorted);
    if (e.target.value === "asce") {
      setProductList(
        filterItems.sort((a, b) => {
          return parseFloat(a.lowRange) - parseFloat(b.lowRange);
        })
      );
    } else if (e.target.value == "desc") {
      setProductList(
        filterItems.sort((a, b) => {
          return parseFloat(b.highRange) - parseFloat(a.highRange);
        })
      );
    }
  };

  const getCategoryList = () => {
    axios.get("/api/totalCategory/").then((response) => {
      setCategory(response.data);
    });
  };

  const handleCategory = (e) => {
    const selectedCategory = e;
    console.log("selectedCategory", selectedCategory);

    if (selectedCategory === "Select Category") {
      getProductList();
      setStatus("");
    } else {
      axios.get("/api/product/filter/" + selectedCategory).then((data) => {
        if (data.data.length) {
          let all = data.data;
          all = all.sort(
            (a, b) => new Date(b.uploaded_on) - new Date(a.uploaded_on)
          );
          all.forEach((e, i) => {
            console.log({ e });
            if (e.varientArray.length > 0) {
              // console.log(getSellingRange(e.varientArray));

              all[i].lowRange = getSellingRange(e.varientArray);
              all[i].highRange = getHighRange(e.varientArray);
            } else {
              all[i].lowRange = e.price.toString();
              all[i].highRange = e.price.toString();
            }
          });
          console.log({ all });
          console.log(data.data);
          setProductList(all);
          setStatus("");
        } else {
          setStatus("No product found");
        }
      });
    }
  };

  const AddInShopify = (t) => {
    let images = [];

    t.productImage.forEach((item, i) => {
      images.push({
        attachment: item.imgBufferData,
      });
    });

    // let tagArray = t.tag.split(", ");
    // let colorArray = t.color.split(", ");
    // let sizeArray = t.size.split(", ");
    // let colorVariant = [];
    // let str = decode.email;
    // let VendorString = str.substring(0, str.lastIndexOf("@"));
    //
    // colorArray.forEach((single, j) => {
    //   colorVariant.push({
    //     option1: single,
    //     price: t.price,
    //     size: t.size,
    //     inventory_quantity: t.quantity,
    //     sku: t.code,
    //   });
    // });

    let vArray = [];
    t.varientArray.forEach((item, i) => {
      vArray.push({
        option1: item.varient,
        price: item.selliingPrice,
        inventory_quantity: item.quantity,
        sku: item.sku,
      });
    });

    let product = {
      product: {
        title: t.name,
        body_html: t.description,
        vendor: decode.store,
        product_type: t.category,

        images: images,
        // tags: tagArray,
        variants: vArray,
        price: t.selliingPrice,
        inventory_quantity: t.quantity,
        sku: t.sku,
      },
    };

    console.log("product added for shopify is", product);
    axios
      .post("/addToShopify/" + storeName.toLowerCase(), product)
      .then((data) => {
        if (data.data.includes("success")) {
          NotificationManager.success("product Added to Shopify");

          //console.log(filterItems.length, "length of filterItems")
        } else {
          NotificationManager.error("Something wrong");
        }
      });
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
    let sellingRange = minSellingValue.selliingPrice;
    console.log("selling", sellingRange);
    return sellingRange;
  };


  const getHighRange = (arr) => {
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
    let sellingRange = maxSellingValue.selliingPrice;
    console.log("selling", sellingRange);
    return sellingRange;
  };

  return (
    <div
      className=""
      style={{ overflowX: "hidden" }}
      style={{ backgroundColor: "#fff" }}
    >
      <div>
        <div style={{ backgroundColor: "#F7F7F8" }}>
          <h2 className="text-center">
            Product <span style={{ color: "#ff9f1a" }}>Collection</span>
          </h2>
          <hr
            style={{ width: "20%", color: "antiquewhite", border: "1px solid" }}
          />
        </div>
        <div
          className="text-center container arrow"
          style={{
            width: "77%",
            backgroundColor: "antiquewhite",
            marginBottom: "2rem",
            alignSelf: "center",
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
      <div class="container" style={{ backgroundColor: "#fff" }}>
        <div class="row">
          <div className="">
            <div role="toolbar">
              <div
                className="text-center category-container-mx"
                onChange={(e) => {
                  // setCategory(e.target.value);
                  console.log(e.target, "div cat");
                  handleCategory(e.target.value);
                }}
              >
                {[
                  {
                    category: "Men’s Clothing & Accessories",
                    icon: "pe-7s-users",
                    value: "Men’s Clothing & Accessories",
                  },
                  {
                    category: "Women’s Clothing & Accessories",
                    icon: "pe-7s-user-female",
                  },
                  {
                    category: "Toys & Hobbies",
                    icon: "pe-7s-arc",
                  },
                  {
                    category: "Health & Beauty",
                    icon: "pe-7s-gym",
                  },
                  {
                    category: "Pet Supplies",
                    icon: "pe-7s-piggy",
                  },
                  {
                    category: "Electronics",
                    icon: "pe-7s-wristwatch",
                  },
                  {
                    category: "Home & Garden",
                    icon: "pe-7s-leaf",
                  },
                  {
                    category: "Mother & Kids",
                    icon: "pe-7s-joy",
                  },
                  {
                    category: "Sports",
                    icon: "pe-7s-ball",
                  },
                  {
                    category: "More",
                    icon: "pe-7s-more",
                  },
                ].map((item) => {
                  return (
                    <>
                      {item.category === "More" ? (
                        <div className="category-mx">
                          <i className={`${item.icon} category-mx-icon`} />
                          <select
                            className="form-control"
                            id="product_category"
                            onChange={(e) => {
                              // setCategory(e.target.value);
                              handleCategory(e.target.value);
                            }}
                            style={{ border: "none" }}
                            placeholder="Enter category"
                            required
                          >
                            <option>{item.category}</option>
                            {category.map((itemm, i) => {
                              // console.log(itemm);
                              return (
                                <option key={i} value={itemm.category}>
                                  {itemm.category}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      ) : (
                        <div
                          className="category-mx"
                          onClick={(e) => {
                            console.log(item.category);
                            handleCategory(item.category.toString());
                            console.log(e.target.childNodes[0]);
                          }}
                        >
                          <i className={`${item.icon} category-mx-icon`} />
                          <p className="category-mx-name">{item.category}</p>
                        </div>
                      )}
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="container-fluid"
        style={{
          backgroundColor: "#fff",
          padding: "6px",
          paddingTop: "2rem",
          margin: 20,
        }}
      >
        <div
          className="text-center"
          style={{ color: "red" }}
          style={{ backgroundColor: "#fff" }}
        >
          {status!==''?(<div>

            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-exclamation-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
</svg>  {status}
            </div>):null}
        </div>
        <br/>
        {filterItems.map((list) => {
          return (
            <div
              className="col-sm-3 card"
              onClick={() => {
                getProductId(list);
              }}
              style={{
                padding: 10,
                border: "1px solid #F0F0F0",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <div>
                {list.productImage[0] ? (
                  <img
                    src={`data:image/jpeg;base64, ${list.productImage[0].imgBufferData}`}
                    alt="Product Image"
                    className="scale-product-img img-responsive"
                    style={{
                      width: "100%",
                      alignSelf: "center",
                      height: "250px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <p style={{ height: "250px" }}> No Image Available</p>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 20,
                    paddingLeft: "3%",
                    paddingRight: "3%",
                  }}
                >
                  <p
                    style={{
                      maxWidth: "120px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: "1.4rem",
                    }}
                  >
                    {list.name}
                  </p>
                  <b
                    style={{
                      maxWidth: "120px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: "1.4rem",
                    }}
                  >
                    ${new Intl.NumberFormat("en-US").format(list.lowRange)}
                    {list.lowRange === list.highRange ? null : "-"}
                    {list.lowRange === list.highRange
                      ? null
                      : new Intl.NumberFormat("en-US").format(list.highRange)}
                  </b>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setMoreDesc(false);
        }}
        className="model-test"
        style={{ maxWidth: "100% !important" }}
      >
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
                        {product.productImage.map((image, index) => {
                          return (
                            <div className="tab-pane" id={`pic-${index + 2}`}>
                              <img
                                src={`data:image/jpeg;base64, ${image.imgBufferData}`}
                              />
                            </div>
                          );
                        })}
                      </div>
                      <ul className="preview-thumbnail nav nav-tabs">
                        <li style={{ display: "flex", width: "100%" }}>
                          {product.productImage.length !== 0
                            ? product.productImage.map((image, index) => {
                                return (
                                  <a
                                    data-target={`#pic-${index + 1}`}
                                    data-toggle="tab"
                                  >
                                    <img
                                      src={`data:image/jpeg;base64, ${image.imgBufferData}`}
                                    />
                                  </a>
                                );
                              })
                            : "No Image Available"}
                        </li>
                      </ul>
                    </div>
                    <div className="details col-md-6">
                      <h2 className="product-title">{product.name}</h2>
                      <br />
                      <br />

                      {product.varientArray.length !== 0 ? (
                        <h5 className="price">
                          Price Range:
                          <span>{getSellingRange(product.varientArray)}</span>
                        </h5>
                      ) : (
                        <h5 className="price">
                          Price:
                          <span>
                            {`$`(
                              new Intl.NumberFormat("en-US").format(
                                product.selliingPrice.toFixed(2)
                              )
                            )}
                          </span>
                        </h5>
                      )}
                      {product.varientArray.length != 0 ? (
                        <div>
                          <div className="panel with-nav-tabs panel-default">
                            <div className="panel-heading">
                              <ul className="nav nav-tabs">
                                <li className="active">
                                  <a href="#tab1default" data-toggle="tab">
                                    Variants
                                  </a>
                                </li>
                                <li>
                                  <a href="#tab2default" data-toggle="tab">
                                    Shipping Details
                                  </a>
                                </li>
                                <li style={{ float: "right" }}>
                                  Processing Time: <strong>1-3 days</strong>
                                </li>
                              </ul>
                            </div>
                            <div className="panel-body">
                              <div className="tab-content">
                                <div
                                  className="tab-pane fade   in active"
                                  id="tab1default"
                                >
                                  <table className="table table-sm">
                                    <thead className="text-center">
                                      <tr>
                                        <th>Name</th>
                                        <th>Sku</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                      </tr>
                                    </thead>
                                    {product.varientArray.map((item, i) => {
                                      return (
                                        <tbody>
                                          <tr>
                                            <td>{item.varient}</td>
                                            <td>{item.sku}</td>
                                            <td className="text-center">
                                              {item.quantity}
                                            </td>
                                            <td>${item.selliingPrice}</td>
                                          </tr>
                                        </tbody>
                                      );
                                    })}
                                  </table>
                                </div>

                                <div className="tab-pane fade" id="tab2default">
                                  <table className="table table-sm">
                                    <thead>
                                      <th>Country</th>
                                      <th>Est. Delivery Time</th>
                                      <th>Cost</th>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>USA</td>
                                        <td>10-12 days</td>
                                        <td>${product.shippingCharge.usa}</td>
                                      </tr>

                                      <tr>
                                        <td>Canada</td>
                                        <td>10-12 days</td>
                                        <td>
                                          ${product.shippingCharge.canada}
                                        </td>
                                      </tr>

                                      <tr>
                                        <td>Australia</td>
                                        <td>10-12 days</td>
                                        <td>
                                          ${product.shippingCharge.australia}
                                        </td>
                                      </tr>

                                      <tr>
                                        <td>UK</td>
                                        <td>10-12 days</td>
                                        <td>
                                          $
                                          {product.shippingCharge.unitedKingdom}
                                        </td>
                                      </tr>

                                      <tr>
                                        <td>International</td>
                                        <td>Variable</td>
                                        <td>
                                          $
                                          {product.shippingCharge.international}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="panel with-nav-tabs panel-default">
                            <div className="panel-heading">
                              <ul className="nav nav-tabs">
                                <li className="active">
                                  <a href="#tab2default" data-toggle="tab">
                                    Shipping Details
                                  </a>
                                </li>
                                <li style={{ float: "right" }}>
                                  Processing Time: <strong>1-3 days</strong>
                                </li>
                              </ul>
                            </div>
                            <div className="panel-body">
                              <div className="tab-content">
                                <div className="tab-pane fade" id="tab2default">
                                  <table className="table table-sm">
                                    <thead>
                                      <th>Country</th>
                                      <th>Est. Delivery Time</th>
                                      <th>Cost</th>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>USA</td>
                                        <td>10-12 days</td>
                                        <td>${product.shippingCharge.usa}</td>
                                      </tr>

                                      <tr>
                                        <td>Canada</td>
                                        <td>10-12 days</td>
                                        <td>
                                          ${product.shippingCharge.canada}
                                        </td>
                                      </tr>

                                      <tr>
                                        <td>Australia</td>
                                        <td>10-12 days</td>
                                        <td>
                                          ${product.shippingCharge.australia}
                                        </td>
                                      </tr>

                                      <tr>
                                        <td>UK</td>
                                        <td>10-12 days</td>
                                        <td>
                                          $
                                          {product.shippingCharge.unitedKingdom}
                                        </td>
                                      </tr>

                                      <tr>
                                        <td>International</td>
                                        <td>Variable</td>
                                        <td>
                                          $
                                          {product.shippingCharge.international}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <br />
                      <br />
                      <h5 className="price">Description:</h5>
                      <p>
                        {moreDesc ? (
                          <div>
                            {product.description ? (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: product.description,
                                }}
                              ></div>
                            ) : null}
                            <u
                              onClick={() => setMoreDesc(false)}
                              style={{ color: "blue" }}
                            >
                              {" "}
                              show less
                            </u>
                          </div>
                        ) : (
                          <p>
                            {product.description
                              ? product.description
                                  .replace(/(<([^>]+)>)/gi, " ")
                                  .replace(/&nbsp;/gi, " ")
                                  .slice(0, 200)
                              : null}

                            <br />
                            {product.description.length > 200 ? (
                              <u
                                onClick={() => setMoreDesc(true)}
                                style={{ color: "blue" }}
                              >
                                {" "}
                                more
                              </u>
                            ) : null}
                          </p>
                        )}
                      </p>

                      <br />
                      <br />
                      {product.varientArray.length === 0 ? (
                        <div>
                          <h5 className="price">Available Quantity:</h5>
                          <p>{product.quantity}</p>
                        </div>
                      ) : null}

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
