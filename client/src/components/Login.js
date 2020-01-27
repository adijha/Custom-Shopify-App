import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import '../assets/css/Login.css'


const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState("");
  const [isLoggedIn, setisLoggedIn] = useState(false);


   useEffect(() => {
     const token = localStorage.getItem("token")
    if (token) {
    setisLoggedIn(true)
    }
},[])

  const userLogin = (e) =>{
    e.preventDefault();
    const obj = {
      email: email,
      password: password
    }
    console.log(obj)
    axios
    .post('/shopify/login', obj)
    .then(data=>{
      const token =  localStorage.setItem("token", data.data);
        setisLoggedIn(true)

    })
    .catch(err=>{
      setStatus(err.message)
    })
  }
  return(
    <div className="wrapper" id="wrapper-login">
    <h2>Login as Admin/Supplier</h2>
    {isLoggedIn===true?(<Redirect to = "/auth"/>):(

    <div className='form-wrapper-login' id="form-wrapper-login">
      <form onSubmit={userLogin}>
        <div className="email">
        <label htmlFor="email">Email</label>
          <input value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  type="email"
                  placeholder="name@example.com"/>
        </div>

        <div className="password">
        <label htmlFor="password">Password</label>
          <input value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter Password" />
        </div>
        <div className="submit-login">
          <button className="btn btn-primary"
                  type="submit">Login</button>
        </div>
        <div className="info">{status}</div>
      </form>
    </div>
    )}
    </div>
  )
}

export default Login;
