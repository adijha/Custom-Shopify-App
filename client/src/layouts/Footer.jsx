import React, {useState, useEffect} from "react";
import axios from 'axios'
import {Redirect, Link, BrowserRouter as Router,

Switch,

Route} from 'react-router-dom';
import '../assets/css/Footer.css'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.js';


const Footer=()=> {



  return (
    <div style={{overflow:"hidden"}}>
     <section id="footer">
     <footer id="footer-Section">
       <div className="footer-top-layout">
         <div className="container">
           <div className="row">
             <div className="col-md-12" style={{height:"100px"}}>
               <div className="col-sm-3 footer-logo" >
                 <img className="footer-img"
              src={require('../assets/img/latestLogo.png')}/>
               </div>
               <div className="col-sm-3">
                    <a className="btn btn-primary text-center affliliateBtn" style={{backgroundColor:"white", float:"right"}} href="#">Become An Affiliate</a>
               </div>
               <div className="col-sm-6">
               <div className="text-center footer-social">
               <a href="#"> Support</a>
               <a href="/login-merchant"> Login</a>
               <a href="/merchant-signup">Sign Up</a>

               </div>

               </div>
             </div>
           </div>
         </div>
       </div>
       <div className="footer-bottom-layout">
       <div className="container">
        <div className="row">
          <div className="col-md-4">
          <p className="text-center copyright" style={{float:"left"}}>Copyright © 2020 Melisxpress.com</p>
          </div>
          <div className="col-md-6 footer-company">

            <a href="/terms&condtions" target="_blank">Terms & Conditions</a>
            <a href="/privacy-policy" target="_blank">Privacy policy</a>
            <a href="/supplier-form" target="_blank">Become a supplier</a>


          </div>
          <div className="col-md-2">
          <a className="btn btn-info" href="#">Support</a>
          </div>
        </div>
       </div>
       </div>
     </footer>
     </section>

</div>


  );
}
export default Footer;
