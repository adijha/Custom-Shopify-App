import React from "react";
import {Redirect, Link} from 'react-router-dom';




function Landing() {

  const handleLogin = e =>{
    const value = e.target.value;

    if (value==="admin"){
      return( <Link to="/login-admin" />)
}
  }



  return (
    <div>
    <main>


      <section className="intro">
        <div>
          <a href="/login-admin" style={{position:"relative", float:"right", fontSize:"large", border:"1px solid", marginLeft:"5px", borderRadius:"7px"}}>Admin Login</a>
          <a href="/login-supplier" style={{position:"relative", float:"right", fontSize:"large", border:"1px solid", marginLeft:"5px", borderRadius:"7px"}}>supplier Login</a>
        </div>

      <h2>Landing Page</h2>
      </section>
      </main>
    </div>

  );
}
export default Landing;
