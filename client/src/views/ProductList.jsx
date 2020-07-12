import React, { useState, useEffect } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Modal from "react-responsive-modal";
import { NotificationManager } from "react-notifications";
import Card from "../components/Card/Card.jsx";
import "../assets/css/productList.css";
import CustomButton from "../components/CustomButton/CustomButton.jsx";
const imageToBase64 = require("image-to-base64");

const ProductList = () => {
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
  const [shippingStatus, setShippingStatus] = useState("");
  const [productImage, setProductImage] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [autoMargin, setAutoMargin] = useState()
  const [addOnImage, setAddOnImage] = useState()
  const [multerImage, setMulterImage] = useState([]);

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

  const getProductData = () => {
    axios.get("/api/supplier/product/" + decode.id).then((products) => {
      // console.log(products.data);
      let all = products.data;
      all = all.sort(
        (a, b) => new Date(b.uploaded_on) - new Date(a.uploaded_on)
      );
      all.forEach((e, i) => {
        console.log({ e });
        if (e.varientArray.length > 0) {
          // console.log(getSellingRange(e.varientArray));

          all[i].lowRange = getLowRange(e.varientArray);
          all[i].highRange = getHighRange(e.varientArray);
        } else {
          all[i].lowRange = e.price.toString();
          all[i].highRange = e.price.toString();
        }
      });
      // console.log({ all });
      setProductItems(all);

    });
  };

  const getCategoryList = () => {
    axios.get('/api/totalCategory').then((data) => {
      setCategoryList(data.data);

    });
  };

  const updateProduct = (item) => {
    console.log("updateProduct", item);
    setMulterImage([])
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

    setShippingDetails(item.shippingCharge.method);
    setProductImage(item.productImage);
    categoryList.forEach((Cat, i) => {
      if (Cat.category===item.category) {
        if (item.margin!==undefined||null) {
          setAutoMargin(Cat.margin)
        }
        else {
          setAutoMargin(0)
        }
      }
    });

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

  const updateProductItem = async (e) => {
    e.preventDefault();
    // const object = {
    //   _id: itemId,
    //   name: name,
    //   price: price,
    //   quantity: quantity,
    //   warranty: warranty,
    //   description: description,
    //   category: category,
    //   code: code,
    //   varientArray: varient,
    //   shippingCharge: {
    //     method:shippingDetails,
    //     australia:australia,
    //     canada:canada,
    //     international:international,
    //     unitedKingdom:uk,
    //     usa:usa,
    //   },
    //   productImage: productImage,
    // };
    // console.log(object);

    const data = await new FormData();
    console.log(productImage, 'add button image');
    data.append('addOnImage', addOnImage[0]);
    data.append('addOnImage', addOnImage[1]);
    data.append('addOnImage', addOnImage[2]);
    data.append('addOnImage', addOnImage[3]);
    data.append('addOnImage', addOnImage[4]);
    data.append('addOnImage', addOnImage[5]);
    data.append('addOnImage', addOnImage[6]);
    data.append('name', name);
    data.append('price', price);
    data.append('quantity', quantity);
    data.append('warranty', warranty);

    data.append('description', description);
    data.append('category', category);
    data.append('code', code);

    data.append('method', shippingDetails);
    data.append('usa', usa);
    data.append('canada', canada);
    data.append('uk', uk);
    data.append('australia', australia);
    data.append('international', international);
    data.append('varientArray', JSON.stringify(varient));
    data.append('_id', itemId)
    data.append("productImage", JSON.stringify(productImage))


    axios
      .patch("/api/product/update", data)
      .then((data) => {
        if (data) {
          NotificationManager.success("Product Updated Successfully");
          setName('');
          setPrice('');
          setQuantity('');
          setWarranty('');
          setDescription('');
          setCategory('');
          setCode('');
          setCanada('');
          setAustralia('');
          setInternational('');
          setUsa('');
          setUk('');
          setOpen(false);
          setMulterImage([])
          getProductData();
        }
      })
      .catch((err) => {
        NotificationManager.error("Something unexpected happened");
        console.log("update product error is:", err.message);
      });
  };
  const updateFieldChanged = (index, ref) => (e) => {
    console.log("index: " + index);
    console.log("property name: " + e.target.name);
    let newArr = [...varient]; // copying the old datas array
    switch (ref) {
      case "price":
        newArr[index].price = e.target.value;
        newArr[index].selliingPrice = parseInt(e.target.value) + parseInt((e.target.value * autoMargin)/100)
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
    console.log("autoMargin", autoMargin);
    console.log(newArr);
    setVarient(newArr);
  };

  const getLowRange = (arr) => {
    console.log("arr", arr);
    let minValue = arr.reduce(function (prev, curr) {
      return parseFloat(prev.price) < parseFloat(curr.price) ? prev : curr;
    });
    let baseHighRange = minValue.price;
    console.log("selling", baseHighRange);
    return baseHighRange;
  };


  const getHighRange = (arr) => {
    console.log("arr", arr);
    let maxValue = arr.reduce(function (prev, curr) {
      return parseFloat(prev.price) > parseFloat(curr.price) ? prev : curr;
    });

    let range =maxValue.price
    return range;
  };


  let newBuffData = (arr) => {
    let encodedData = [];
    arr.forEach((item, i) => {
      let reader = new FileReader();
      reader.readAsDataURL(item);
      reader.onloadend = () => {
        let obj = { imgBufferData: reader.result };
        encodedData.push(obj);
      };
    });
    console.log(encodedData);
    return encodedData;
  };



  const showImage = (e) => {
    e.preventDefault();
    console.log('pLength', e.target.files);
    let images = [];
    let images1 = [];
    for (var i = 0; i < e.target.files.length; i++) {
      images1.push(e.target.files[i]);
      images.push({
        url: URL.createObjectURL(e.target.files[i]),
        name: e.target.files[i].name,
      });
    }
    setAddOnImage(images1);
    setMulterImage(images);
    console.log(addOnImage, 'pImage array');
  };

  const handleDeleteImage = (data, indexToRemove) => {
    setMulterImage([
      ...multerImage.filter((_, index) => index !== indexToRemove),
    ]);
    setAddOnImage([
      ...addOnImage.filter((_, index) => index !== indexToRemove),
    ]);
    // let tempArray = []
    // multerImage.forEach((image, i) => {
    //   productImage.forEach((item, j) => {
    //     console.log({item});
    //     if (multerImage[i].name === productImage[j].name) {
    //         tempArray.push(productImage[j])
    //     }
    //   });
    //
    //   });
    //   setProductImage(tempArray)
  };

  return (
    <div>
      <br />
      <div id="hideStatus" className="status text-center">
        {status}
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
                        <th>No.</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productItems.map((item, key) => {
                        return (
                          <tr key={key}>
                            <td>{key + 1}</td>
                            <td style={{ width: "15%" }}>
                              {item.productImage[0] ? (
                                !!item.productImage[0].imgBufferData ? (
                                  <img
                                    className="product-logo"
                                    src={`data:image/jpeg;base64, ${item.productImage[0].imgBufferData}`}
                                  />
                                ) : (
                                  "Image not Available"
                                )
                              ) : (
                                "Image not Available"
                              )}
                            </td>
                            <td>{item.name}</td>
                            <td>{item.code}</td>
                            <td>{item.category}</td>
                            <td>
                            ${new Intl.NumberFormat("en-US").format(item.lowRange)}
                    {item.lowRange === item.highRange ? null : "-"}
                    {item.lowRange === item.highRange
                      ? null
                      : new Intl.NumberFormat("en-US").format(item.highRange)}
                            </td>
                            <td>
                              <div
                                style={{
                                  maxWidth: "160px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {item.description
                                  ? item.description.replace(/<[^>]*>/g, "")
                                  : null}
                              </div>
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
                style={{ height: '18em', marginBottom: 20 }}
                onChange={(value) => setDescription(value)}
                value={description}
                modules={Editor.modules}
                formats={Editor.formats}
                placeholder={"Write description"}
              />
              <br/><br/>
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
              <select
                className='form-control'
                id='product_category'
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  categoryList.forEach((item, i) => {
                    if (item.category===e.target.value) {
                      if (item.margin!==undefined||null) {
                        setAutoMargin(item.margin)
                      }
                      else {
                        setAutoMargin(0)
                      }
                    }
                  });

                }}
                placeholder='Enter category'
                required
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
                  checked={shippingDetails === `freeShipping`}
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
                  checked={shippingDetails === `standardShipping`}
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
                          required
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
                          required
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
                          required
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
                          required
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
                          required
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
                <p style={{ flex: 1 }}>Variant</p>
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
            <br />
            <div className='form-group'>
                <label for='productImage'>Add More Images</label>
                <input
                  type='file'
                  name='addOnImage'
                  className='form-control'
                  onChange={(e) => {
                    setAddOnImage(e.target.files);
                    showImage(e);
                  }}
                  multiple
                  accept='image/*'
                />
              </div>
              {multerImage.length !== 0 ? (
                <div className='image-preview'>
                  {multerImage.map((image, i) => {
                    return (
                      <div className='col-md-4'>
                        <button
                          style={{ display: 'flex' }}
                          type='button'
                          className='close'
                          aria-label='Close'
                          onClick={() => handleDeleteImage(image, i)}
                        >
                          <span aria-hidden='true'>&times;</span>
                        </button>
                        <img
                          src={image.url}
                          alt='upload-image'
                          className='process_Image'
                        />
                      </div>
                    );
                  })}
                </div>
              ) : null}
            <div className="form-group">
              {productImage.map((data, i) => {
                return (
                  <div className="col-md-3">
                    <button
                      style={{ display: "flex" }}
                      type="button"
                      className="close"
                      aria-label="Close"
                      onClick={() => handleDeleteImage(data, i)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                    {data.imgBufferData ? (
                      <img
                        src={`data:image/jpeg;base64, ${data.imgBufferData}`}
                        alt="upload-Image"
                      />
                    ) : (
                      <p>no image available</p>
                    )}
                  </div>
                );
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

export default ProductList;
