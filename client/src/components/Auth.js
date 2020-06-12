import React  from 'react';
import jwt_decode from 'jwt-decode';
import {Redirect} from 'react-router-dom';

const Auth = () =>{

  const token = localStorage.getItem("token")
  let decode = jwt_decode(token)

  return(
    <div>
    {decode.category==="admin"?(<Redirect to= "/admin/dashboard"/>):null}
    {decode.category==="supplier"?(<Redirect to= "/supplier/dashboard"/>):null}
    {decode.category==="merchant"?(<Redirect to= "/merchant"/>):null}
    </div>
  )

}
export default Auth;
