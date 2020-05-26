import React, { useState } from 'react';
import '../assets/css/SupplierForm.css';
import PhoneInput from 'react-phone-number-input';

const SupplierForm = () => {
  const [tab, setTab] = useState(1);
  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
  return (
    <div>
      <div style={{ height: '100px' }}></div>
      <div className='container-fluid' style={{ maxWidth: 800 }}>
        <div
          className='sup-form-tabs'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <div
            className='sup-form-tab'
            style={{ cursor: 'pointer' }}
            onClick={() => setTab(1)}
          >
            <h5 className='sup-form-tab-inner'>Personal Details</h5>
          </div>
          <div onClick={() => setTab(2)} style={{ cursor: 'pointer' }}>
            <h5>Company Details</h5>
          </div>
          <div onClick={() => setTab(3)} style={{ cursor: 'pointer' }}>
            <h5>Shipping Details</h5>
          </div>
          <div onClick={() => setTab(4)} style={{ cursor: 'pointer' }}>
            <h5>Branding and Return Management</h5>
          </div>
        </div>
        <div>
          {tab === 1 ? (
            <div>
              <div className='card card-input'>
                <div className='form-group'>
                  <h5 style={{ marginBottom: -7, marginTop: 13, fontSize: 15 }}>
                    Full Name
                  </h5>
                  <input
                    type='name'
                    className='sup-input-box'
                    placeholder='Enter Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <h5 style={{ marginBottom: -7, marginTop: 13, fontSize: 15 }}>
                    Email Address
                  </h5>
                  <input
                    type='email'
                    className='sup-input-box'
                    placeholder='Enter Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <h5 style={{ marginBottom: -7, marginTop: 13, fontSize: 15 }}>
                    Phone Number with country code
                  </h5>
                  <input
                    type='text'
                    className='sup-input-box'
                    placeholder='Enter Phone Number'
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    required
                  />
                  <button
                    disabled={name && email && phoneNo ? false : true}
                    type='submit'
                    className='signup-btn'
                    onClick={() => setTab(2)}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          ) : tab === 2 ? (
            <div>
              Company Details
              <div className='card card-input'>
                <div className='form-group'>
                  <h5 style={{ marginBottom: -7, marginTop: 13, fontSize: 15 }}>
                    Email Address
                  </h5>
                  <input
                    type='email'
                    className='sup-input-box'
                    placeholder='Enter Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          ) : tab === 3 ? (
            <div>
              Shipping Details
              <div className='card card-input'>
                <div className='form-group'>
                  <h5 style={{ marginBottom: -7, marginTop: 13, fontSize: 15 }}>
                    Email Address
                  </h5>
                  <input
                    type='email'
                    className='sup-input-box'
                    placeholder='Enter Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          ) : tab === 4 ? (
            <div>
              Branding and Return Management
              <div className='card card-input'>
                <div className='form-group'>
                  <h5 style={{ marginBottom: -7, marginTop: 13, fontSize: 15 }}>
                    Email Address
                  </h5>
                  <input
                    type='email'
                    className='sup-input-box'
                    placeholder='Enter Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <section id='footer'>
        <footer id='footer-Section'>
          <div className='footer-top-layout'>
            <div className='container'>
              <div className='row'>
                <div className='col-md-12' style={{ height: '100px' }}>
                  <div className='col-sm-3 footer-logo'>
                    <img
                      className='footer-img'
                      src={require('../assets/img/latestLogo.png')}
                    />
                  </div>
                  <div className='col-sm-3'>
                    <a
                      className='btn btn-primary text-center affliliateBtn'
                      style={{ backgroundColor: 'white', float: 'right' }}
                      href='#'
                    >
                      Become An Affiliate
                    </a>
                  </div>
                  <div className='col-sm-6'>
                    <div className='text-center footer-social'>
                      <a href='#'> Support</a>
                      <a href='/login-merchant'> Login</a>
                      <a href='/merchant-signup'>Sign Up</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='footer-bottom-layout'>
            <div className='container'>
              <div className='row'>
                <div className='col-md-4'>
                  <p
                    className='text-center copyright'
                    style={{ float: 'left' }}
                  >
                    Copyright © 2020 Melisxpress.com
                  </p>
                </div>
                <div className='col-md-6 footer-company'>
                  <a href='#'>Terms & Conditions</a>
                  <a href='#'>Privacy policy</a>
                  <a href='#'>Become a supplier</a>
                </div>
                <div className='col-md-2'>
                  <a className='btn btn-info' href='#'>
                    Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default SupplierForm;
