import React, { useState } from 'react';
import axios from 'axios';
import '../assets/css/supplier.css';
import { NotificationManager } from 'react-notifications';

function Supplier() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [typeCheck, setTypeCheck] = useState(true);
  const [type, setType] = useState('text');

  const updateName = (e) => {
    setName(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePwd = (e) => {
    setPassword(e.target.value);
  };

  const handleClick = () => {
    setTypeCheck(!typeCheck);
    if (typeCheck == true) {
      setType('text');
    } else {
      setType('password');
    }
  };

  // const  handleClick = () => setType(({type})=>({
  //   type: type==="text"? "password": "text"
  // }))

  const addSuplier = (e) => {
    e.preventDefault();
    const obj = {
      supplier_id: name,
      email: email,
      password: password,
    };
    axios
      .post('/api/signUp', obj)
      .then((data) => {
        if (data) {
          NotificationManager.success(
            'New Supplier Created Successfully: ' + data.config.data
          );
          // setStatus("New Supplier Created Successfully: "+ data.config.data)
          setName('');
          setEmail('');
          setPassword('');
        }
      })
      .catch((err) => {
        NotificationManager.error('Id not Created' + err.message);
      });
  };

  return (
    <div className='wrapper' id='wrapper'>
      <div className='form-wrapper' id='form-wrapper'>
        <h2>Create Supplier</h2>
        <form onSubmit={addSuplier}>
          <div className='fullName'>
            <label htmlFor='fullName'>Username</label>
            <input
              type='text'
              name='fullName'
              value={name}
              onChange={updateName}
            />
          </div>
          <div className='email'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              name='email'
              value={email}
              onChange={updateEmail}
            />
          </div>
          <div className='password'>
            <label htmlFor='password'>Password</label>
            <input
              type={type}
              name='password'
              value={password}
              onChange={updatePwd}
            />
            <span className='password__show text-right' onClick={handleClick}>
              {' '}
              <svg
                className='bi bi-eye'
                width='2em'
                height='1.5em'
                viewBox='0 0 16 16'
                fill='currentColor'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.134 13.134 0 001.66 2.043C4.12 11.332 5.88 12.5 8 12.5c2.12 0 3.879-1.168 5.168-2.457A13.134 13.134 0 0014.828 8a13.133 13.133 0 00-1.66-2.043C11.879 4.668 10.119 3.5 8 3.5c-2.12 0-3.879 1.168-5.168 2.457A13.133 13.133 0 001.172 8z'
                  clipRule='evenodd'
                />
                <path
                  fillRule='evenodd'
                  d='M8 5.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM4.5 8a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z'
                  clipRule='evenodd'
                />
              </svg>
            </span>
          </div>
          <div className='info'>
            <small>Password must be eight characters in length.</small>
          </div>
          <div className='submit'>
            <button className='btn btn-primary'>Create</button>
          </div>
          <div className='info'>{status}</div>
        </form>
      </div>
    </div>
  );
}

export default Supplier;
