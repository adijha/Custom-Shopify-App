import React, { useState, useEffect } from 'react';
import CsvDownloader from 'react-csv-downloader';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import Modal from 'react-responsive-modal';
import { NotificationManager } from 'react-notifications';
import Card from '../components/Card/Card.jsx';
import moment from 'moment';

const SupplierList = () => {



  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [tempSupplier, setTempSupplier] = useState('');
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(
    moment('01-01-2019').format('Y-MM-DD')
  );
  const [endDate, setEndDate] = useState(moment().format('Y-MM-DD'));
  const [sRevenue, setSRevenue] = useState();
  const [sOrder, setSOrder] = useState();
  const [productCount, setProductCount] = useState();
  const [sort, setSort] = useState([])
  const [search, setSearch] = useState("");

  let checkArray = []

  useEffect(() => {
    getSupplierData();
    specificData()
  }, []);

  const specificData = async ()=>{
    await axios.get('/api/supplier')
    .then(supplier=>{
      supplier.data.forEach(async (item, i) => {
        let rev = await axios.get('/supplierRevenue/'+item._id)
          checkArray.push({
            id: item._id,
            revenue: rev.data
          })
      });

    })
    console.log("supp rev data", checkArray.length);
  }

  const getSupplierData = async () => {
    // axios.get('/api/supplierFullDetails').then((res) => {
    axios.get('/api/supplier/newData').then((res)=>{
      setSuppliers(res.data);
      console.log(res.data);
    });
  };

  const updateSupplier = (item) => {
    console.log(item.id);
    setOpen(true);
    setEmail(item.email);
    setName(item.supplier_id);
    setTempSupplier(item.id);
  };

  const submitUpdateSuplier = (e) => {
    e.preventDefault();
    const obj = {
      _id: tempSupplier,
      supplier_id: name,
      email: email,
      password: password,
    };
    console.log(obj);
    axios.patch('/api/update', obj).then((res) => {
      try {
        if (res.data.includes('success')) {
          axios.get('/api/supplier/newData').then((res)=>{
            setSuppliers(res.data);
            NotificationManager.success('Supplier updated successfully');

            console.log("waited", res.data);
          });
          setOpen(false);
        }
      } catch (error) {
        NotificationManager.error('Something unusual happened');
      }

    });
  };

  const deleteSupplier = (item) => {
    let id = item.id;
    console.log('id is delete', id);
    axios.delete('/api/supplierDel/' + id).then((res) => {
      try {
        if (res.data.includes('success')) {
          NotificationManager.success('Supplier deleted successfully');
          getSupplierData();
        }
      } catch (error) {
        NotificationManager.error('Something unusual happened');
      }
    });
  };

  const updatebtn = {
    width: '50%',
  };
  const sortByDate = () => {
    let newOrders = [];
    NotificationManager.error(
      'Sorry no revenue data available, We are adding more data for this feature'
    );
    suppliers.forEach((supplier) => {
      if (
        moment(supplier.revenueDate).format('Y-MM-DD') >= startDate &&
        moment(supplier.revenueDate).format('Y-MM-DD') <= endDate
      ) {
        newOrders.push(supplier);
      }
    });
    setSuppliers(newOrders);
  };


  // const filterItems = (suppliers.filter(plist=>{
  //   return plist.email.toLowerCase();
  // }))

  const filterItems = suppliers.filter((plist) => {
    return plist.supplier_id.toLowerCase().includes(search.toLowerCase());
  });

const handleSort = e =>{
  e.preventDefault();
  let unsorted = suppliers
  console.log("unsorted", unsorted);
  console.log("value", e.target.value);
  if (e.target.value==="product") {
    setSuppliers(filterItems.sort((a,b)=>parseFloat(b.product)-parseFloat(a.product)))
  }
  else if (e.target.value==="order") {
    setSuppliers(filterItems.sort((a,b)=>parseFloat(b.order)-parseFloat(a.order)))
  }
  else if (e.target.value==="revenue")
  {
    setSuppliers(filterItems.sort((a,b)=>parseFloat(b.revenue)-parseFloat(a.revenue)))
  }
  else if (e.target.value==="nothing") {
    getSupplierData()
  }
}

  return (
    <div className='content'>
      <div className='info text-center' style={{ color: 'red' }}>
        {status}
      </div>
      <div
        style={{
          textAlign: 'right',
          alignSelf: 'right',
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '-20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 18, marginRight: "20px"}}>

          <select onChange = {(e)=> handleSort(e)}>
            <option value = "nothing">Sort By</option>
            <option value="product"> Product</option>
            <option value = "order">Order</option>
            <option value = "revenue">Revenue</option>
          </select>



        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 18, marginRight: "20px"}}>
        <input
          type="search"
          onChange={(e) => setSearch(e.target.value)}
          className="primary"
          placeholder="search supplier by username"
          style={{ width: "400px" }}
        />
        </div>
        <div
          style={{
            backgroundColor: 'grey',
            width: '140px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            marginRight: '18px',
          }}
        >
          <CsvDownloader
            filename='AdminOrderDetails'
            separator=','
            wrapColumnChar="'"
            datas={suppliers}
          >
            <h5 style={{ marginTop: 15 }}>Download CSV</h5>
          </CsvDownloader>
        </div>
      </div>
<br/>
      <Grid fluid>
        <Row>
          <Col md={12}>
            <Card
              title='Supplier List'
              category={'Total Suppliers :' + suppliers.length}
              ctTableFullWidth
              ctTableResponsive
              content={
                <Table striped hover size='sm'>
                  <thead>
                    <tr>
                      <th>S.No.</th>
                      <th>username</th>
                      <th>Email</th>
                      <th>Total no. of Products</th>
                      <th>Total no. of Orders</th>
                      <th>total Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterItems.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td>{key + 1}</td>
                          <td>{item.supplier_id}</td>
                          <td>{item.email}</td>
                          <td>{item.product}</td>
                          <td>{item.order}</td>
                          <td>${item.revenue}</td>
                          <td>
                            <button
                              className='btn btn-primary btn-sm'
                              onClick={() => updateSupplier(item)}
                            >
                              Edit
                            </button>
                          </td>
                          <td>
                            <button
                              className='btn btn-danger btn-sm'
                              onClick={() => deleteSupplier(item)}
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
      <Modal open={open} onClose={() => setOpen(false)}>
        <br />
        <h3 style={{ color: 'blue' }} className='text-center'>
          Edit Supplier Details:
        </h3>
        <form onSubmit={submitUpdateSuplier}>
          <div className='fullName'>
            <label htmlFor='fullName'>Supplier Id</label>
            <input
              type='text'
              name='fullName'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='email'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              name='email'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className='password'>
            <label htmlFor='password'>New Password</label>
            <input
              type='password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div style={{ margin: 'auto' }}>
            <button type='submit' className='btn btn-primary' style={updatebtn}>
              Update
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SupplierList;
