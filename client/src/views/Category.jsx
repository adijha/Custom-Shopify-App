import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Row, Col, Table, Modal as Mod, Button } from 'react-bootstrap';
import Card from '../components/Card/Card.jsx';
import Modal from 'react-responsive-modal';

const Category = () => {
  const [category, setCategory] = useState('');
  const [msg, setMsg] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [newCat, setNewCat] = useState('');

  useEffect(() => {
    getCategory();
  }, []);

  //get Category
  const getCategory = () => {
    axios.get('/api/totalCategory').then((data) => {
      console.log('category list is', data.data);
      setCategoryList(data.data);
    });
  };

  //add category
  const addCategory = (e) => {
    e.preventDefault();
    const obj = {
      category: category,
    };
    axios.post('/api/addCategory', obj).then((response) => {
      console.log('response is', response);
      setMsg('Category Added Successfully');
      setCategory('');
      getCategory();
    });
  };

  const updateProduct = (item) => {
    setOpen(true);
    setItemId(item._id);
    console.log(item._id);
  };

  const editProduct = (item) => {
    console.log(item);
    axios
      .post('/api/category/' + itemId, {
        newName: newCat,
      })
      .then((response) => {
        setMsg('category edited');
        setEditModal(false);
        getCategory();
      });
  };
  //delete category
  const deleteCategory = () => {
    axios.delete('/api/category/' + itemId).then((response) => {
      setMsg('category deleted');
      setOpen(false);
      getCategory();
    });
  };

  return (
    <div>
      <div className='container-fluid'>
        <br />
        <div className='text-center' style={{ color: 'green' }}>
          {msg}
        </div>
        {editModal ? (
          <Mod.Dialog>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingRight: 20,
                paddingLeft: 20,
                paddingTop: 20,
              }}
            >
              <p>Update Category</p>
              <div
                style={{
                  marginLeft: '800',
                  width: '200',
                  fontSize: 20,
                  cursor: 'pointer',
                }}
                onClick={() => setEditModal(false)}
              >
                X
              </div>
            </div>
            <hr />
            <Mod.Body>
              <p>New Category Name</p>
              <div style={{ display: 'flex', paddingBottom: 30 }}>
                <input
                  type='text'
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                />
                <div
                  className='btn btn-primary'
                  style={{ width: '150px', marginLeft: '30px' }}
                  onClick={editProduct}
                >
                  Update Category
                </div>
              </div>
            </Mod.Body>
          </Mod.Dialog>
        ) : null}
        <form onSubmit={addCategory}>
          <div className='card card-input'>
            <div
              className='form-group'
              style={{ position: 'relative', display: 'flex' }}
            >
              <input
                type='text'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className='form-control'
                id='product_id'
                placeholder='Add Category for Product'
                required
              />
              <br />
              <div
                className='card-button'
                style={{ width: '15%', margin: 'auto', position: 'relative' }}
              >
                <button type='submit' className='btn btn-primary'>
                  Add
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className='content'>
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title='Category List'
                category={'Total Categories :' + categoryList.length}
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Date Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryList.map((item, key) => {
                        return (
                          <tr key={key}>
                            <td>{item.category}</td>
                            <td>{item.created_on || 'NA'}</td>
                            <td style={{ width: '20%' }}>
                              <button
                                className='btn btn-primary btn-sm'
                                onClick={() => {
                                  setEditModal(true);
                                  setItemId(item._id);
                                }}
                              >
                                Edit
                              </button>
                            </td>
                            <td style={{ width: '20%' }}>
                              <button
                                className='btn btn-danger btn-sm'
                                onClick={() => updateProduct(item)}
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
        <h4>Are you sure, you want to delete</h4>
        <a
          className='btn btn-danger'
          onClick={() => deleteCategory()}
          style={{ width: '50%' }}
        >
          Yes
        </a>
        <a
          className='btn btn-primary'
          onClick={() => setOpen(false)}
          style={{ width: '50%' }}
        >
          No
        </a>
      </Modal>
    </div>
  );
};
export default Category;
