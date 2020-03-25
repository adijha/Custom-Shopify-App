import React  from 'react';
import jwt_decode from 'jwt-decode';
import {Redirect} from 'react-router-dom';

const Auth = () =>{

  const token = localStorage.getItem("token")
  let decode = jwt_decode(token)

  return(
    <div>
    {decode.category==="admin"?(<Redirect to= "/admin/dashboard"/>):(<Redirect to= "/merchant/dashboard"/>)}
    </div>
  )

}
export default Auth;
