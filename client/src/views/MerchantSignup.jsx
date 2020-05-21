import React, {useState} from "react";
import axios from 'axios';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import '../assets/css/merchantSignup.css'
import { NotificationManager } from 'react-notifications';
import {Redirect} from 'react-router-dom';


function MerchantSignup(){
const [firstName, setFirstName]= useState("");
const [lastName, setLastName] = useState("");
const [phoneNo, setPhoneNo] = useState("")
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [status, setStatus] = useState("");
  const [value, setValue] = useState();
  const [btnCheck, setBtnCheck] = useState(false)


const addMerchant = async e =>{
  e.preventDefault();
  const obj = {
    firstName: firstName,
    lastName: lastName,
    phoneNo: value,
    email: email,
    password: password
  }
  console.log("signup details", obj);
  try {
    let res = await  axios.post('/api/merchant', obj)
    if (res.data.includes('success')) {
      NotificationManager.success('Registered Successfully');
      setEmail("");
      setFirstName("");
      setLastName("");
      setValue();
      setPassword("")
      setBtnCheck(true)
    }
  } catch (error) {
    NotificationManager.error('Something unusual happened');
  }

}

  return(
      <div className="signup-form" style={{ position:"relative", display:"flex"}}>
      {(btnCheck==true)?(<Redirect to="/connect-store"/>):null}
        <div className="sign-up-form">
          <h1>Sign up Now</h1>
          <form onSubmit={addMerchant}>
            <input type="firstName" className="input-box" placeholder="Enter First Name" value={firstName} onChange={(e)=>setFirstName(e.target.value)} required/>
            <input type="lastName" className="input-box" placeholder="Enter Last Name" value={lastName} onChange={(e)=>setLastName(e.target.value)} required/>
            <input  type="email" className="input-box" placeholder="Enter Email Address" value={email} onChange={(e)=>setEmail(e.target.value) } required/>
            <PhoneInput
      placeholder="Enter phone number"
className="input-box"
      value={value}
      onChange={setValue} required/>
      <input type="password" className="input-box" placeholder="Enter Password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
      <p className="text-center"><span className="check"><input type="checkbox" required/></span>I agree to the terms & conditions</p>
      <button type="submit" className="signup-btn">Sign Up</button>
      <hr/>
      <p className="text-center">Do you have an account ? <a href="#">Sign In</a></p>

      </form>


        </div>


     </div>
  )
}

export default MerchantSignup
