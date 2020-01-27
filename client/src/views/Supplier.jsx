import React, {useState} from "react";
import axios from 'axios';
import '../assets/css/supplier.css'

function Supplier(){
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [status, setStatus] = useState("");

const updateName = e =>{
  setName(e.target.value)
}

const updateEmail = e =>{
  setEmail(e.target.value)
}

const updatePwd = e=>{
  setPassword(e.target.value)
}

const addSuplier = e =>{
  e.preventDefault();
  const obj = {
    supplier_id: name,
    email: email,
    password: password
  }
  axios
  .post('/shopify/', obj)
  .then((data)=>{
    if (data) {
      setStatus("New Supplier Created Successfully: "+ data.config.data)
      setName("")
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
         <h2>Create Supplier</h2>
         <form  onSubmit={addSuplier} >
           <div className='fullName'>
             <label htmlFor="fullName">Full Name</label>
             <input type='text' name='fullName' value={name} onChange={updateName}/>
           </div>
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
             <button>Create</button>
           </div>
           <div className="info">{status}</div>

         </form>
       </div>
     </div>
  )
}

export default Supplier
