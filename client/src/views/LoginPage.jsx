import React, {useState} from "react";
import {Redirect} from "react-router-dom";
import axios from 'axios';
import style from '../assets/css/LoginPage.css';


function LoginPage(){

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setisLoggedIn] = useState(false);


  //Get Username Value
  const getEmail = (e) =>{
    const nameInput = e.target.value;
    if (!checkInput(nameInput)) {
      return alert("Blank Field and characters /,\.^ not allowed")
    }
    setEmail(nameInput);
    console.log(nameInput);
  }

  //Get Password Value
  const getPassword = (e)=>{
    const passwordInput = e.target.value;
    if (!checkInput(passwordInput)) {
      return alert("Blank Field and characters /\,.^ not allowed")
    }
    setPassword(passwordInput);
    console.log(passwordInput);
  }

  //Check Input of User and prevent from special characters
  const checkInput = (enteredValue)=>{
    if (
        enteredValue.indexOf("\\") > -1 ||
        enteredValue.indexOf("'") > -1 ||
        enteredValue.indexOf("/") > 0 ||
        enteredValue.indexOf(",") > -1 ||
        enteredValue.indexOf(".") > -1 ||
        enteredValue.indexOf("^") > -1 ||
        enteredValue.length === 0
      ) {
        return false;
    }
    return true;
  }

  //Submmit Form user input and redirect
  const submitForm = (e)=>{
    e.preventDefault();
    const obj = {
      email: email,
      password: password
    }

    axios
    .post('/supplier/Login', obj)
    .then(token=>{
      console.log(token)
    })
    .catch(err=>{
      console.log("add product error is:", err.message)
    })
  }

  //   if (input1==="Ashish" && input2==="Ashish123") {
  //     localStorage.setItem("token", "hjfgdskfgjfldkghfasdfghsdfgk")
  //     setisLoggedIn(true)
  //   }
  //   return false;
  // }



  return(

    <div>

      {isLoggedIn?(<Redirect to="/admin/addProduct"/>):(

      <div  className={style.overlay}>

      <form onSubmit={submitForm} className={style.formContent}>
        <div className="form-group">
          <input type="text"  className="form-control" placeholder="Enter Email" value={email} onChange={getEmail}/>

        </div>
        <div className="form-group">
          <input type="text" className="form-control" placeholder="Enter Password" value={password} onChange={getPassword}/>
        </div>
        <button type="submit" className="btn btn-primary">Sign In</button>

      </form>

      </div>
      )}

    </div>
  )

}

export default LoginPage;
