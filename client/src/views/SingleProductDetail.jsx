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
    <div className='container-fluid'>
      <div className='text-center' style={{ color: 'green' }}>
        {status || msg || ''}
      </div>

      {singleProduct.map((product) => {
        return (
          <div className='card card-class'>
            <div className='container-fliud'>
              <div className=' row'>
                <div className='preview col-md-6'>
                  <div className='preview-pic tab-content'>
                    <div className='tab-pane active' id='pic-1'>
                      {!!product.productImage[0] ? (
                        <img
                          src={`data:image/jpeg;base64, ${product.productImage[0].imgBufferData}`}
                        />
                      ) : (
                        'Image not Available'
                      )}
                    </div>
                    <div className='tab-pane' id='pic-2'>
                      {!!product.productImage[1] ? (
                        <img
                          src={`data:image/jpeg;base64, ${product.productImage[1].imgBufferData}`}
                        />
                      ) : (
                        'Image not Available'
                      )}
                    </div>
                  </div>
                  <ul className='preview-thumbnail nav nav-tabs'>
                    <li className='active'>
                      <a data-target='#pic-1' data-toggle='tab'>
                        {!!product.productImage[0] ? (
                          <img
                            src={`data:image/jpeg;base64, ${product.productImage[0].imgBufferData}`}
                          />
                        ) : (
                          'Image not Available'
                        )}
                      </a>
                    </li>
                    <li>
                      <a data-target='#pic-2' data-toggle='tab'>
                        {!!product.productImage[1] ? (
                          <img
                            src={`data:image/jpeg;base64, ${product.productImage[1].imgBufferData}`}
                          />
                        ) : (
                          'Image not Available'
                        )}
                      </a>
                    </li>
                  </ul>
                </div>
                <div className='details col-md-6'>
                  <h3 className='product-title'>{product.name}</h3>
                  <p>Sku: {product.code}</p>
                  <p>Category: {product.category}</p>
                  <p>Variant: {product.variant || 'NA'}</p>
                  <p className='product-description'>
                    Description: <br />
                    {product.description}
                  </p>
                  <h4 className='price'>
                    current price: <span>&#x20b9;{product.price}</span>
                  </h4>
                  <h5 className='sizes'>
                    Available Quantity: <span>{product.quantity}</span>
                  </h5>
                  <div
                    className=''
                    style={{
                      width: '50%',
                      display: 'flex',
                      position: 'relative',
                    }}
                  >
                    <button
                      className='btn btn-primary'
                      onClick={() => updateProduct(product)}
                    >
                      Edit
                    </button>
                    <button className='btn btn-danger'>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <Modal open={open} onClose={() => setOpen(false)}>
        <br />
        <h3 style={{ color: 'red' }} className='text-center'>
          Edit Product Details:
        </h3>
        <br />

        <form style={modalStyle} onSubmit={updateProductItem}>
          <div className='card card-update'>
            <div className='form-group'>
              <label for='product_id'>ID/SKU</label>
              <input
                type='text'
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className='form-control'
                id='product_id'
                placeholder='Enter Unique Id of Product'
                required
              />
            </div>
            <div className='form-group'>
              <label for='product_name'>Title</label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='form-control'
                id='product_name'
                placeholder='Enter Title of Product'
                required
              />
            </div>
            <div className='form-group'>
              <label for='product_category'>Category</label>
              <input
                type='text'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className='form-control'
                id='product_category'
                placeholder='Enter category of Product'
                required
              />
            </div>
          </div>
          <div className='card card-update'>
            <div className='form-group'>
              <label for='product_price'>Price</label>
              <input
                type='text'
                min='0'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className='form-control'
                id='product_price'
                placeholder='Enter Price of Product'
                required
              />
            </div>
            <div className='form-group'>
              <label for='product_quantity'>Quantity</label>
              <input
                type='number'
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min='0'
                className='form-control'
                id='product_quantity'
                placeholder='Enter available quantity of product'
                required
              />
            </div>
            <div className='form-group'>
              <label for='product_warranty'>Warranty</label>
              <input
                type='text'
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                className='form-control'
                id='product_warranty'
                placeholder='Enter available warranty of product'
                required
              />
            </div>
          </div>
          <div className='card card-update'>
            <div className='form-group'>
              <label for='product_description'>Description</label>
              <ReactQuill
                required
                theme={'snow'}
                onChange={(value) => setDescription(value)}
                style={{ minHeight: '18em' }}
                value={description}
                modules={Editor.modules}
                formats={Editor.formats}
                placeholder={'Write description'}
              />
            </div>
          </div>
          <div className='card-button'>
            <CustomButton round fill type='submit'>
              Update Product
            </CustomButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default SingleProductDetail;
