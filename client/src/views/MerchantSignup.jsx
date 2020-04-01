import React, {useState} from "react";
import axios from 'axios';
import '../assets/css/supplier.css'

function MerchantSignup(){
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [status, setStatus] = useState("");



const updateEmail = e =>{
  setEmail(e.target.value)
}

const updatePwd = e=>{
  setPassword(e.target.value)
}

const addMerchant = e =>{
  e.preventDefault();
  const obj = {

    email: email,
    password: password
  }
  axios
  .post('/api/merchant', obj)
  .then((data)=>{
    if (data) {
      setStatus("New Supplier Created Successfully")
      setEmail("")
      setPassword("")
    }

  })
  .catch(err=>{
    setStatus("Id not Created"+ err.message)
  })
}

  return(
    <div className='wrapper' id="wrapper">

       <div className='form-wrapper' id="form-wrapper">
       <h2>Merchant Sign Up</h2>

         <form  onSubmit={addMerchant} >

           <div className='email'>
             <label htmlFor="email">Email</label>
             <input type='email' name='email'  value={email} onChange={updateEmail} />
           </div>
           <div className='password'>
             <label htmlFor="password">Password</label>
             <input type='password' name='password'  value={password} onChange={updatePwd} />
           </div>
           <div className='info'>
             <small>Password must be eight characters in length.</small>
           </div>
           <div className='submit'>
             <button className="btn btn-primary">Create Account</button>
           </div>
           <div className="info">{status}</div>

         </form>
       </div>
     </div>
  )
}

export default MerchantSignup
