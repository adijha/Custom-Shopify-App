import React, {useEffect} from "react";
import axios from 'axios'
import {Redirect, Link} from 'react-router-dom';
import '../assets/css/Landing.css'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.js';


function Landing() {

useEffect(()=>{
  getchPage()
},[])

const getchPage = ()=>{
  axios.get('/api/analyticProduct')
  .then(data=>{
    console.log(data, "product response");
  })
}

  return (
    <div>
    <div  style={{overflowX: "hidden"}}>
    <nav className="navbar navbar-light bg-light" >
<a className="navbar-brand" href="#" style={{padding:"2rem"}}>Logo</a>

  <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
    <div class="navbar-nav" style={{position:"relative", display:"flex", padding:"2rem", marginLeft:"1rem", float:"right", fontSize:"20px"}}>
      <a class="nav-item nav-link" href="#home">Home </a>
      <br/>
      <a class="nav-item nav-link" href="#about">About</a>
      <br/>
      <a class="nav-item nav-link" href="#services">Services</a>
      <br/>
      <a class="nav-item nav-link" href="#pricing">Pricing</a>
      <br/>
      <ul className="nav navbar-nav">
         <li className="dropdown " style={{marginTop:"-15px"}}>
           <a href="#" className="dropdown-toggle" data-toggle="dropdown">Login <span className="glyphicon glyphicon-user pull-right" /></a>
           <ul className="dropdown-menu" style={{minWidth: "125px"}}>
             <li className="text-center" style={{float:"left"}}><a href="/login-admin" className="text-center">Admin <span className="glyphicon glyphicon-cog pull-left" /></a></li>
             <li><a href="/login-supplier" style={{float:"left"}}>Supplier <span className="glyphicon glyphicon-stats pull-left" /></a></li>

           </ul>
         </li>
       </ul>
    </div>
  </div>
</nav>


       <section id="home" style={{marginTop:"-10rem"}}>
       <div className="row">
         <div className="col-md-5" style={{marginLeft: "30px"}}>
           <h4>Dummy Text</h4>
           <h4 className="subheading">GetLance makes it easy to connect with clients and begin doing great work.</h4>
           <p className="text-muted">Streamlined hiring. GetLance’s sophisticated algorithms highlight projects you’re a great fit for.
             Top Rated and Rising Talent programs. Enjoy higher visibility with the added status of prestigious programs.
             Do substantial work with top clients. GetLance pricing encourages freelancers to use GetLance for repeat relationships with their clients.</p>
             <button className="btn btn-primary" style={{width:"50%"}}> <a href="#"> Sign Up</a></button>
         </div>

         <div className="col-md-6 how-img">
           <img src="https://image.ibb.co/cHgKnU/Work_Section2_freelance_img2.png" className="rounded-circle img-fluid" alt="" />
         </div>
       </div>
       </section>



     <section id="pricing" className="container-fluid">
     <div className="row" style={{position:"relative", marginTop:"-8rem"}}>
     <h2 className="section-title mb-2 h1">Pricing</h2>

          <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
            <div className="db-wrapper">
              <div className="db-pricing-seven">
                <ul>
                  <li className="price">
                    <i className="glyphicon glyphicon-qrcode" />
                    BASIC - 29 $
                  </li>
                  <li>Web Designing</li>
                  <li>Logo Assesment</li>
                  <li>Digital Marketing</li>
                  <li>Web Designing</li>
                  <li>Logo Assesment</li>
                  <li>Digital Marketing</li>
                </ul>
                <div className="pricing-footer">
                  <a href="#" className="btn btn-default btn-lg">BUY <i className="glyphicon glyphicon-play-circle" /></a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
            <div className="db-wrapper">
              <div className="db-pricing-seven">
                <ul>
                  <li className="price">
                    <i className="glyphicon glyphicon-indent-right" />
                    MEDIUM - 49 $
                  </li>
                  <li>Web Designing</li>
                  <li>Logo Assesment</li>
                  <li>Digital Marketing</li>
                  <li>Web Designing</li>
                  <li>Logo Assesment</li>
                  <li>Digital Marketing</li>
                </ul>
                <div className="pricing-footer">
                  <a href="#" className="btn btn-default btn-lg">BUY<i className="glyphicon glyphicon-play-circle" /></a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
            <div className="db-wrapper">
              <div className="db-pricing-seven">
                <ul>
                  <li className="price">
                    <i className="glyphicon glyphicon-list-alt" />
                    ULTIMATE - 99 $
                  </li>
                  <li>Web Designing</li>
                  <li>Logo Assesment</li>
                  <li>Digital Marketing</li>
                  <li>Web Designing</li>
                  <li>Logo Assesment</li>
                  <li>Digital Marketing</li>
                </ul>
                <div className="pricing-footer">
                  <a href="#" className="btn btn-default btn-lg">BUY <i className="glyphicon glyphicon-play-circle" /></a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
            <div className="db-wrapper">
              <div className="db-pricing-seven">
                <ul>
                  <li className="price">
                    <i className="glyphicon glyphicon-align-justify" />
                    EXTENDED - 199 $
                  </li>
                  <li>Web Designing</li>
                  <li>Logo Assesment</li>
                  <li>Digital Marketing</li>
                  <li>Web Designing</li>
                  <li>Logo Assesment</li>
                  <li>Digital Marketing</li>
                </ul>
                <div className="pricing-footer">
                  <a href="#" className="btn btn-default btn-lg">BUY <i className="glyphicon glyphicon-play-circle" /></a>
                </div>
              </div>
            </div>
          </div>
        </div>

     </section>

     <footer className="footer" style={{backgroundColor:"black"}}>
       <div className="container bottom_border">
         <div className="row">
           <div className=" col-sm-4 col-md col-sm-4  col-12 col">
             <h5 className="headin5_amrc col_white_amrc pt2">Find us</h5>
             {/*headin5_amrc*/}
             <p className="mb10">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
             <p><i className="fa fa-location-arrow" /> 9878/25 sec 9 rohini 35 </p>
             <p><i className="fa fa-phone" />  +91-9999878398</p>
             <p><i className="fa fa fa-envelope" /> info@example.com</p>
           </div>
           <div className=" col-sm-4 col-md  col-6 col">
             <h5 className="headin5_amrc col_white_amrc pt2">Quick links</h5>
             {/*headin5_amrc*/}
             <ul className="footer_ul_amrc">
               <li><a href="http://webenlance.com">Image Rectoucing</a></li>
               <li><a href="http://webenlance.com">Clipping Path</a></li>
               <li><a href="http://webenlance.com">Hollow Man Montage</a></li>
               <li><a href="http://webenlance.com">Ebay &amp; Amazon</a></li>
               <li><a href="http://webenlance.com">Hair Masking/Clipping</a></li>
               <li><a href="http://webenlance.com">Image Cropping</a></li>
             </ul>
             {/*footer_ul_amrc ends here*/}
           </div>
           <div className=" col-sm-4 col-md  col-6 col">
             <h5 className="headin5_amrc col_white_amrc pt2">Quick links</h5>
             {/*headin5_amrc*/}
             <ul className="footer_ul_amrc">
               <li><a href="http://webenlance.com">Remove Background</a></li>
               <li><a href="http://webenlance.com">Shadows &amp; Mirror Reflection</a></li>
               <li><a href="http://webenlance.com">Logo Design</a></li>
               <li><a href="http://webenlance.com">Vectorization</a></li>
               <li><a href="http://webenlance.com">Hair Masking/Clipping</a></li>
               <li><a href="http://webenlance.com">Image Cropping</a></li>
             </ul>
             {/*footer_ul_amrc ends here*/}
           </div>

         </div>
       </div>
       <div className="container">
         <ul className="foote_bottom_ul_amrc">
           <li><a href="http://webenlance.com">Home</a></li>
           <li><a href="http://webenlance.com">About</a></li>
           <li><a href="http://webenlance.com">Services</a></li>
           <li><a href="http://webenlance.com">Pricing</a></li>
           <li><a href="http://webenlance.com">Blog</a></li>
           <li><a href="http://webenlance.com">Contact</a></li>
         </ul>
         {/*foote_bottom_ul_amrc ends here*/}
         <p className="text-center">Copyright @2020 | Designed With by Developer <a href="#">Your Company Name</a></p>
         <ul className="social_footer_ul">
           <li><a href="http://webenlance.com"><i className="fab fa-facebook-f" /></a></li>
           <li><a href="http://webenlance.com"><i className="fab fa-twitter" /></a></li>
           <li><a href="http://webenlance.com"><i className="fab fa-linkedin" /></a></li>
           <li><a href="http://webenlance.com"><i className="fab fa-instagram" /></a></li>
         </ul>
         {/*social_footer_ul ends here*/}
       </div>
     </footer>

       </div>
</div>


  );
}
export default Landing;
