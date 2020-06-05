import React, { useState, useEffect } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Modal from 'react-responsive-modal';
import { NotificationManager } from 'react-notifications';
import Card from '../components/Card/Card.jsx';
import '../assets/css/productList.css';
import CustomButton from '../components/CustomButton/CustomButton.jsx';

const ProductList = () => {
  const [productItems, setProductItems] = useState([]);
  const token = localStorage.getItem('token');
  const decode = jwt_decode(token);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [warranty, setWarranty] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [itemId, setItemId] = useState('');
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    getProductData();
  }, []);

  const getProductData = () => {
    axios.get('/api/supplier/product/' + decode.id).then((products) => {
      setProductItems(products.data);
    });
  };

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
          getProductData();
        }
      })
      .catch((err) => {
        console.log('update product error is:', err.message);
      });
  };

  return (
    <div>
      <br />
      <div id='hideStatus' className='status text-center'>
        {status}
      </div>

      <div className='content'>
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title='Product List'
                category={'Total Products :' + productItems.length}
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th></th>
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
                            <td style={{ width: '15%' }}>
                              {!!item.productImage[0].imgBufferData ? (
                                <img
                                  className='product-logo'
                                  src={`data:image/jpeg;base64, ${item.productImage[0].imgBufferData}`}
                                />
                              ) : (
                                'Image not Available'
                              )}
                            </td>
                            <td>{item.name}</td>
                            <td>{item.code}</td>
                            <td>{item.category}</td>
                            <td>{'$ ' + item.price}</td>
                            <td style={{ width: '20%' }}>
                              {item.description
                                ? item.description.replace(/<[^>]*>/g, '')
                                : null}
                            </td>
                            <td>
                              <button
                                className='btn btn-primary btn-sm'
                                onClick={() => updateProduct(item)}
                              >
                                Edit
                              </button>
                            </td>
                            <td>
                              <button
                                className='btn btn-danger btn-sm'
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

export default ProductList;
