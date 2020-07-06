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
  const token = localStorage.getItem("token");
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
      setProductList(data.data);
      console.log(data.data);
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
    const selectedCategory = e;
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

    let vArray = []
    t.varientArray.forEach((item, i) => {
      vArray.push({
        "option1": item.varient,
        "price": item.price,
        "inventory_quantity": item.quantity,
        "sku": item.sku
      })
    });


    let product = {
      "product": {
        "title": t.name,
        "body_html": t.description,
        "vendor": decode.store,
        "product_type": t.category,

        "images": images,
        // tags: tagArray,
        "variants": vArray
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


  const getSellingRange = (arr) =>{

    let maxSellingValue = arr.reduce(function(prev, curr) {
      return parseFloat(prev.selliingPrice) > parseFloat(curr.selliingPrice) ? prev : curr;
    });
    let minSellingValue = arr.reduce(function(prev, curr) {
      return parseFloat(prev.selliingPrice) < parseFloat(curr.selliingPrice) ? prev : curr;
    });
    let sellingRange = ' $ '+`${new Intl.NumberFormat("en-US").format(parseFloat(minSellingValue.selliingPrice).toFixed(2))}`
                        + ' - ' +  `${new Intl.NumberFormat("en-US").format(parseFloat(maxSellingValue.selliingPrice).toFixed(2))}`
    console.log("selling", sellingRange);
    return  sellingRange
  }


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
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignSelf: "center",
                }}
              >
                {[
                  {
                    category: "Men’s Clothing & Accessories",
                    icon: "pe-7s-users",
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
                    category: "Jewellery & Watches",
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
                  ,
                  {
                    category: "More	",
                    icon: "pe-7s-more",
                  },
                ].map((item) => {
                  return (
                    <>
                      <div
                        role="group"
                        style={{
                          display: "flex",
                          width: 220,
                          backgroundColor: "#fff",
                          padding: 10,
                          alignItems: "center",
                          border: "2px solid #fafafa",
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          console.log(item.category);
                          handleCategory(e.target.childNodes[0]);
                          console.log(e.target.childNodes[0]);
                        }}
                      >
                        <i className={item.icon} style={{ fontSize: 40 }} />
                        <p
                          style={{
                            alignSelf: "center",
                            marginTop: 8,
                            marginLeft: 20,
                          }}
                        >
                          {item.category}
                        </p>
                      </div>
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
          {status}
        </div>
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
                      maxWidth: "200px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: "1.5rem",
                    }}
                  >
                    {list.name}
                  </p>
                  <b style={{ fontSize: "1.5rem" }}>
                  {(list.varientArray.length!==0)?(getSellingRange(list.varientArray))
                   :(

                      `$`(new Intl.NumberFormat("en-US").format(list.selliingPrice.toFixed(2)))
                 )
                 }
                  </b>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} className="model-test"style={{maxWidth:"100% !important"}}>
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
                      <h2 className="product-title">{product.name}</h2>
                      <br/>
                      <br/>

                      {(product.varientArray.length!==0)?(
                        <h5 className="price">
                          Price Range:
                          <span>{getSellingRange(product.varientArray)}
                          </span>
                          </h5>
                      ):(
                        <h5 className="price">
                          Price:
                          <span>{`$`(new Intl.NumberFormat("en-US").format(product.selliingPrice.toFixed(2)))}
                          </span>
                          </h5>
                      )}
                            {(product.varientArray.length!=0)?(
                              <div>
                                <div className="panel with-nav-tabs panel-default">
                                  <div className="panel-heading">
                                    <ul className="nav nav-tabs">
                                      <li className="active"><a href="#tab1default" data-toggle="tab">Varients</a></li>
                                      <li ><a href="#tab2default" data-toggle="tab">Shipping Detils</a></li>
                                      <li style={{float:"right"}}>Processing Time: <strong>1-3 days</strong></li>
                                    </ul>
                                  </div>
                                  <div className="panel-body">
                                    <div className="tab-content">

                                      <div className="tab-pane fade   in active" id="tab1default">
                                      <table className="table table-sm">
                                      <thead className="text-center">
                                      <tr>

                                      <th>Name</th>
                                      <th>Sku</th>
                                      <th>Qunantity</th>
                                      <th>Price</th>
                                      </tr>
                                      </thead>
                                      {product.varientArray.map((item, i)=>{
                                        return(

                                          <tbody>
                                            <tr>
                                              <td>{item.varient}</td>
                                              <td>{item.sku}</td>
                                              <td className="text-center">{item.quantity}</td>
                                              <td>${item.selliingPrice}</td>
                                            </tr>
                                          </tbody>
                                      )
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
                                      <td>${product.shippingCharge.canada}</td>
                                      </tr>

                                      <tr>
                                      <td>Australia</td>
                                      <td>10-12 days</td>
                                      <td>${product.shippingCharge.australia}</td>
                                      </tr>

                                      <tr>
                                      <td>UK</td>
                                      <td>10-12 days</td>
                                      <td>${product.shippingCharge.unitedKingdom}</td>
                                      </tr>

                                      <tr>
                                      <td>International</td>
                                      <td>Variable</td>
                                      <td>${product.shippingCharge.international}</td>
                                      </tr>

                                      </tbody>
                                      </table>
                                      </div>


                                    </div>
                                  </div>
                                </div>
                              </div>

):(
  <div>
    <div className="panel with-nav-tabs panel-default">
      <div className="panel-heading">
        <ul className="nav nav-tabs">
          <li className="active" ><a href="#tab2default" data-toggle="tab">Shipping Detils</a></li>
          <li style={{float:"right"}}>Processing Time: <strong>1-3 days</strong></li>
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
          <td>${product.shippingCharge.canada}</td>
          </tr>

          <tr>
          <td>Australia</td>
          <td>10-12 days</td>
          <td>${product.shippingCharge.australia}</td>
          </tr>

          <tr>
          <td>UK</td>
          <td>10-12 days</td>
          <td>${product.shippingCharge.unitedKingdom}</td>
          </tr>

          <tr>
          <td>International</td>
          <td>Variable</td>
          <td>${product.shippingCharge.international}</td>
          </tr>

          </tbody>
          </table>
          </div>


        </div>
      </div>
    </div>
  </div>

)}




                      <br/>
                      <br/>
                      <h5 className="price">Description:</h5>
                      <p>
                        {product.description
                          ? product.description.replace(/(<([^>]+)>)/gi, "")
                          : null}
                      </p>

                      <br/>
                      <br/>
                      {(product.varientArray.length===0)?(<div><h5 className="price">
                            Available Quantity:
                          </h5>
                           <p>{product.quantity}</p></div>):null}


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
