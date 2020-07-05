import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import Modal from 'react-responsive-modal';
import jwt_decode from 'jwt-decode';
import CustomButton from '../components/CustomButton/CustomButton.jsx';
import ReactQuill from 'react-quill';

import Card from '../components/Card/Card.jsx';
import '../assets/css/productPage.css';

const SingleProductDetail = (props) => {
  const [open, setOpen] = useState(false);
  const [singleProduct, setSingleProduct] = useState([]);
  const [msg, setMsg] = useState('');

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [warranty, setWarranty] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [itemId, setItemId] = useState('');

  const token = localStorage.getItem('token');
  let decode = jwt_decode(token);

  useEffect(() => {
    getProductId();
  }, []);

  const modalStyle = {
    margin: 'auto',
    position: 'relative',
  };

  let Editor = {};
  Editor.modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold'],
      ['italic'],
      ['underline'],
      ['strike'],
      ['blockquote'],
      [{ list: 'ordered' }],
      [{ list: 'bullet' }],
      [{ indent: '+1' }],
      [{ indent: '-1' }],
      ['link'],
      ['video'],
      ['image'],
    ],
  };

  Editor.formats = [
    'header',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
  ];

  const getProductId = () => {
    let productId = props.match.params.id;

    //console.log(list._id);
    axios.get('/api/product/' + productId).then((item) => {
      console.log('single pronduct detail', item);
      setSingleProduct(item.data);
      console.log(item.data);
    });
  };

  //update product
  const updateProduct = (item) => {
    console.log('updateProduct', item._id);
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
    console.log('delete' + item._id);
    axios.delete('/api/product/' + item._id).then((data) => {
      if (data) {
        setStatus('Product Deleted');
        getProductId();
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
      .patch('/api/product/update', object)
      .then((data) => {
        if (data) {
          setStatus('Product Updated Successfully');
          setName('');
          setPrice('');
          setQuantity('');
          setWarranty('');
          setDescription('');
          setCategory('');
          setCode('');
          setOpen(false);
          getProductId();
        }
      })
      .catch((err) => {
        console.log('update product error is:', err.message);
      });
  };

  return (
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
                      <span>$
                      </span>
                      </h5>
                  ):(
                    <h5 className="price">
                      Price:
                      <span>${product.price}
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

                </div>
              </div>
            </div>
          </div>
        );
      })}


    </div>
  );
};
export default SingleProductDetail;
