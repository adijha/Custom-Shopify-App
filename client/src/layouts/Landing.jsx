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
<a className="navbar-brand" href="#" style={{padding:"2rem"}}>
  <img src={require('../assets/img/NewLogo.png')} /> </a>

  <div class="newClass collapse navbar-collapse" id="navbarNavAltMarkup">
    <div class="navbar-nav" style={{}}>
    { /*  <a class="nav-item nav-link" href="#home">Home </a>
      <br/>
      <a class="nav-item nav-link" href="#about">About</a>
      <br/>
      <a class="nav-item nav-link" href="#services">Services</a>
      <br/>
      <a class="nav-item nav-link" href="#pricing">Pricing</a>
      <br/>
    */}
      <ul className="nav navbar-nav login">
         <li className="dropdown " style={{}}>
           <a href="#" className="dropdown-toggle" data-toggle="dropdown">Login <span className="glyphicon glyphicon-user pull-right" /></a>
           <ul className="dropdown-menu" style={{minWidth: "125px"}}>
             <li className="text-center" style={{float:"left"}}><a href="/login-admin" className="text-center">Admin <span className="glyphicon glyphicon-cog pull-left" /></a></li>
             <li><a href="/login-supplier" style={{float:"left"}}>Supplier <span className="glyphicon glyphicon-stats pull-left" /></a></li>
             <li><a href="/login-merchant" style={{float:"left"}}>Merchant <span className="glyphicon glyphicon-stats pull-left" /></a></li>
           </ul>
         </li>
       </ul>
    </div>
  </div>
</nav>

        <br/>
        <section className="about-us py-5 " id="about-us" style={{padding:"0"}}>
         <div className="container mt-5">
           <div className="row">
             <div className="col-md-7">
               <h1 className="text-success">Welcome to MelisXpress!</h1>
               <hr />
               <h4>Discover large variety of viral products for your store in seconds.</h4>
               <br/>
               <p>Start your 7 days free trial<br/>(100% Secure)</p>

               <button type="button" className="btn btn-success" style={{minWidth:"20%"}}><a href="/merchantSignup">Sign Up</a></button>
             </div>
             <div className="col-md-5">
               <img src="http://themebubble.com/demo/marketingpro/wp-content/uploads/2016/10/seo-slide.png " alt="" />
             </div>
           </div>
         </div>
       </section>


       <section id="services" style={{position:"relative"}}>
       <div className="container-fluid">
         <h2 className="section-title mb-2 h1">Why choose us ?</h2>
         <div className="row mt-5">
           <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
             <div className="card">
               <div className="card-block block-1">
                 <h3 className="card-title">Automation</h3>
                 <p className="card-text">Save time with our OneClick fulfillment feature.</p>
                 <a href="javascript:void();" title="Read more" className="read-more">Read more<i className="fa fa-angle-double-right ml-2" /></a>
               </div>
             </div>
           </div>
           <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
             <div className="card">
               <div className="card-block block-2">
                 <h3 className="card-title">Branded Package</h3>
                 <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                 <a href="javascript:void();" title="Read more" className="read-more">Read more<i className="fa fa-angle-double-right ml-2" /></a>
               </div>
             </div>
           </div>
           <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
             <div className="card">
               <div className="card-block block-3">
                 <h3 className="card-title">Thank Your Letter</h3>
                 <p className="card-text">MelisXpress allows branded thank you letters for your store.</p>
                 <a href="javascript:void();" title="Read more" className="read-more">Read more<i className="fa fa-angle-double-right ml-2" /></a>
               </div>
             </div>
           </div>
         </div>
         <div className="row">
           <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
             <div className="card">
               <div className="card-block block-4">
                 <h3 className="card-title">Branded Invoice</h3>
                 <p className="card-text">MelisXpress provides branded Invoice for customer’s trust.</p>
                 <a href="javascript:void();" title="Read more" className="read-more">Read more<i className="fa fa-angle-double-right ml-2" /></a>
               </div>
             </div>
           </div>
           <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
             <div className="card">
               <div className="card-block block-5">
                 <h3 className="card-title">Private Label</h3>
                 <p className="card-text">MelisXpress gives option for high volume stores.</p>
                 <a href="javascript:void();" title="Read more" className="read-more">Read more<i className="fa fa-angle-double-right ml-2" /></a>
               </div>
             </div>
           </div>
           <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
             <div className="card">
               <div className="card-block block-6">
                 <h3 className="card-title">Faster Shipping</h3>
                 <p className="card-text"> MelisXpress ships your products at highest priority .</p>
                 <a href="javascript:void();" title="Read more" className="read-more">Read more<i className="fa fa-angle-double-right ml-2" /></a>
               </div>
             </div>
           </div>
         </div>
       </div>
       </section>

    <section>

    <div className="container">
      <img src={require('../assets/img/hiw.png')}/>
         </div>
<br/>
         <div id="carouselExampleIndicators" className="carousel slide features_tab_inner" data-ride="carousel">
       <div className="features_tab_left">
         <ol className="carousel-indicators nav nav-tabs features_tab">
           <li data-target="#carouselExampleIndicators" data-slide-to={0} className="active">
             <img className="tab_icon" src="http://wethemez.com/demo/startupkit/img/tab-icon.png" alt="" />
             <span className="heading">Work with top level suppliers</span>
             <span className="summary">MelisXpress has found the top level suppliers in the Industry <br/>for you to have the best quality of products for your customer satisfaction & scale your brand without any trouble.
                <small>
                <br/>- 100% Best Quality Guaranteed.
                <br/>- 100% Reliable Suppliers.
                <br/>- Gives You Priority.
                <br/>- Highly Experienced.</small>
              </span>

           </li>
           <li data-target="#carouselExampleIndicators" data-slide-to={1} className>
             <img className="tab_icon" src="http://wethemez.com/demo/startupkit/img/tab-icon3.png" alt="" />
             <span className="heading">Easy To Scale</span>
             <span className="summary">MelisXpress is not only fulfill orders but provides you winning products everyday which saves your time & makes it easy to scale.
             <br/>
             - <strong>Winning Products: </strong> Our product research team adds winning products everyday for you.
            <br/> - <strong> Request product: </strong> If you have any winning product we will source out for you with just 1 click with quality control.
             </span>
           </li>

           <li data-target="#carouselExampleIndicators" data-slide-to={2} className>
             <img className="tab_icon" src="http://wethemez.com/demo/startupkit/img/tab-icon8.png" alt="" />
             <span className="heading">Our customers are our biggest fans</span>
             <span className="summary">We always ensure that our clients are satisfied in everything, we take the
           responsibility for the best quality of products & services.</span>
           </li>

         </ol>
       </div>
       <div className="features_tab_right">
         <div className="carousel-inner" style={{width:"-moz-max-content"}}>
           <div className="carousel-item active">
             <img src="http://wethemez.com/demo/startupkit/img/features_two6.jpg" alt="" />
           </div>
           <div className="carousel-item">
             <img src="http://wethemez.com/demo/startupkit/img/features_two6.jpg" alt="" />
           </div>
           <div className="carousel-item">
             <img src="http://wethemez.com/demo/startupkit/img/features_two6.jpg" alt="" />
           </div>

         </div>
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

     <footer className="footer landingFooter" style={{backgroundColor:"black"}}>
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
        <br/>
         {/*foote_bottom_ul_amrc ends here*/}
         <p className="text-center">Copyright @2020 | Designed With by Developer <a href="#">MelisXpress</a></p>
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
