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
    <div  >
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
      <a class="nav-item nav-link" href="#pricing">Package</a>
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
       <div className="container">
     <div className="row">
       <div className="row">
         <div className="col-md-9">
           <h3>
             Latest Arrival</h3>
         </div>
         <div className="col-md-3">
           {/* Controls */}
           <div className="controls pull-right hidden-xs">
             <a className="left fa fa-chevron-left btn btn-success" href="#carousel-example" data-slide="prev" /><a className="right fa fa-chevron-right btn btn-success" href="#carousel-example" data-slide="next" />
           </div>
         </div>
       </div>
       <div id="carousel-example" className="carousel slide hidden-xs" data-ride="carousel">
         {/* Wrapper for slides */}
         <div className="carousel-inner">
           <div className="item active">
             <div className="row">
               <div className="col-sm-3">
                 <div className="col-item">
                   <div className="photo">
                     <img src="http://placehold.it/350x260" className="img-responsive" alt="a" />
                   </div>
                   <div className="info">
                     <div className="row">
                       <div className="price col-md-6">
                         <h5>
                           Sample Product</h5>
                         <h5 className="price-text-color">
                           $199.99</h5>
                       </div>
                       <div className="rating hidden-sm col-md-6">
                         <i className="price-text-color fa fa-star" /><i className="price-text-color fa fa-star">
                         </i><i className="price-text-color fa fa-star" /><i className="price-text-color fa fa-star">
                         </i><i className="fa fa-star" />
                       </div>
                     </div>
                     <div className="separator clear-left">
                       <p className="btn-add">
                         <i className="fa fa-shopping-cart" /><a href="http://www.jquery2dotnet.com" className="hidden-sm">Add to cart</a></p>
                       <p className="btn-details">
                         <i className="fa fa-list" /><a href="http://www.jquery2dotnet.com" className="hidden-sm">More details</a></p>
                     </div>
                     <div className="clearfix">
                     </div>
                   </div>
                 </div>
               </div>
               <div className="col-sm-3">
                 <div className="col-item">
                   <div className="photo">
                     <img src="http://placehold.it/350x260" className="img-responsive" alt="a" />
                   </div>
                   <div className="info">
                     <div className="row">
                       <div className="price col-md-6">
                         <h5>
                           Product Example</h5>
                         <h5 className="price-text-color">
                           $249.99</h5>
                       </div>
                       <div className="rating hidden-sm col-md-6">
                       </div>
                     </div>
                     <div className="separator clear-left">
                       <p className="btn-add">
                         <i className="fa fa-shopping-cart" /><a href="http://www.jquery2dotnet.com" className="hidden-sm">Add to cart</a></p>
                       <p className="btn-details">
                         <i className="fa fa-list" /><a href="http://www.jquery2dotnet.com" className="hidden-sm">More details</a></p>
                     </div>
                     <div className="clearfix">
                     </div>
                   </div>
                 </div>
               </div>
               <div className="col-sm-3">
                 <div className="col-item">
                   <div className="photo">
                     <img src="http://placehold.it/350x260" className="img-responsive" alt="a" />
                   </div>
                   <div className="info">
                     <div className="row">
                       <div className="price col-md-6">
                         <h5>
                           Next Sample Product</h5>
                         <h5 className="price-text-color">
                           $149.99</h5>
                       </div>
                       <div className="rating hidden-sm col-md-6">
                         <i className="price-text-color fa fa-star" /><i className="price-text-color fa fa-star">
                         </i><i className="price-text-color fa fa-star" /><i className="price-text-color fa fa-star">
                         </i><i className="fa fa-star" />
                       </div>
                     </div>
                     <div className="separator clear-left">
                       <p className="btn-add">
                         <i className="fa fa-shopping-cart" /><a href="http://www.jquery2dotnet.com" className="hidden-sm">Add to cart</a></p>
                       <p className="btn-details">
                         <i className="fa fa-list" /><a href="http://www.jquery2dotnet.com" className="hidden-sm">More details</a></p>
                     </div>
                     <div className="clearfix">
                     </div>
                   </div>
                 </div>
               </div>
               <div className="col-sm-3">
                 <div className="col-item">
                   <div className="photo">
                     <img src="http://placehold.it/350x260" className="img-responsive" alt="a" />
                   </div>
                   <div className="info">
                     <div className="row">
                       <div className="price col-md-6">
                         <h5>
                           Sample Product</h5>
                         <h5 className="price-text-color">
                           $199.99</h5>
                       </div>
                       <div className="rating hidden-sm col-md-6">
                         <i className="price-text-color fa fa-star" /><i className="price-text-color fa fa-star">
                         </i><i className="price-text-color fa fa-star" /><i className="price-text-color fa fa-star">
                         </i><i className="fa fa-star" />
                       </div>
                     </div>
                     <div className="separator clear-left">
                       <p className="btn-add">
                         <i className="fa fa-shopping-cart" /><a href="http://www.jquery2dotnet.com" className="hidden-sm">Add to cart</a></p>
                       <p className="btn-details">
                         <i className="fa fa-list" /><a href="http://www.jquery2dotnet.com" className="hidden-sm">More details</a></p>
                     </div>
                     <div className="clearfix">
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
           <div className="item">
             <div className="row">
               <div className="col-sm-3">
                 <div className="col-item">
                   <div className="photo">
                     <img src="http://placehold.it/350x260" className="img-responsive" alt="a" />
                   </div>
                   <div className="info">
                     <div className="row">
                       <div className="price col-md-6">
                         <h5>
                           Product with Variants</h5>
                         <h5 className="price-text-color">
                           $199.99</h5>
                       </div>
                       <div className="rating hidden-sm col-md-6">
                         <i className="price-text-color fa fa-star" /><i className="price-text-color fa fa-star">
                         </i><i className="price-text-color fa fa-star" /><i className="price-text-color fa fa-star">
                         </i><i className="fa fa-star" />
                       </div>
                     </div>
                     <div className="separator clear-left">
                       <p className="btn-add">
                         <i className="fa fa-shopping-cart" /><a href="http://www.jquery2dotnet.com" className="hidden-sm">Add to cart</a></p>
                       <p className="btn-details">
                         <i className="fa fa-list" /><a href="http://www.jquery2dotnet.com" className="hidden-sm">More details</a></p>
                     </div>
                     <div className="clearfix">
                     </div>
                   </div>
                 </div>
               </div>
               <div className="col-sm-3">
                 <div className="col-item">
                   <div className="photo">
                     <img src="http://placehold.it/350x260" className="img-responsive" alt="a" />
                   </div>
                   <div className="info">
                     <div className="row">
                       <div className="price col-md-6">
                         <h5>
                           Grouped Product</h5>
                         <h5 className="price-text-color">
                           $249.99</h5>
                       </div>
                       <div className="rating hidden-sm col-md-6">
                       </div>
                     </div>
                     <div className="separator clear-left">
                       <p className="btn-add">
                         <i className="fa fa-shopping-cart" /><a href="http://www.jquery2dotnet.com" className="hidden-sm">Add to cart</a></p>
                       <p className="btn-details">
                         <i className="fa fa-list" /><a href="http://www.jquery2dotnet.com" className="hidden-sm">More details</a></p>
                     </div>
                     <div className="clearfix">
                     </div>
                   </div>
                 </div>
               </div>
               <div className="col-sm-3">
                 <div className="col-item">
                   <div className="photo">
                     <img src="http://placehold.it/350x260" className="img-responsive" alt="a" />
                   </div>
                   <div className="info">
                     <div className="row">
                       <div className="price col-md-6">
                         <h5>
                           Product with Variants</h5>
                         <h5 className="price-text-color">
                           $149.99</h5>
                       </div>
                       <div className="rating hidden-sm col-md-6">
                         <i className="price-text-color fa fa-star" /><i className="price-text-color fa fa-star">
                         </i><i className="price-text-color fa fa-star" /><i className="price-text-color fa fa-star">
                         </i><i className="fa fa-star" />
                       </div>
                     </div>
                     <div className="separator clear-left">
                       <p className="btn-add">
                         <i className="fa fa-shopping-cart" /><a href="http://www.jquery2dotnet.com" className="hidden-sm">Add to cart</a></p>
                       <p className="btn-details">
                         <i className="fa fa-list" /><a href="http://www.jquery2dotnet.com" className="hidden-sm">More details</a></p>
                     </div>
                     <div className="clearfix">
                     </div>
                   </div>
                 </div>
               </div>
               <div className="col-sm-3">
                 <div className="col-item">
                   <div className="photo">
                     <img src="http://placehold.it/350x260" className="img-responsive" alt="a" />
                   </div>
                   <div className="info">
                     <div className="row">
                       <div className="price col-md-6">
                         <h5>
                           Product with Variants</h5>
                         <h5 className="price-text-color">
                           $199.99</h5>
                       </div>
                       <div className="rating hidden-sm col-md-6">
                         <i className="price-text-color fa fa-star" /><i className="price-text-color fa fa-star">
                         </i><i className="price-text-color fa fa-star" /><i className="price-text-color fa fa-star">
                         </i><i className="fa fa-star" />
                       </div>
                     </div>
                     <div className="separator clear-left">
                       <p className="btn-add">
                         <i className="fa fa-shopping-cart" /><a href="http://www.jquery2dotnet.com" className="hidden-sm">Add to cart</a></p>
                       <p className="btn-details">
                         <i className="fa fa-list" /><a href="http://www.jquery2dotnet.com" className="hidden-sm">More details</a></p>
                     </div>
                     <div className="clearfix">
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
       </section>

       <section id="about" style={{position:"relative", display: "flex", marginTop:"-10rem", padding:"0"}}>
       <div className="aboutus-section">
      <div className="container">
        <div className="row" style={{width:"112%"}}>
        <h2 className="aboutus-title text-center">About Us</h2>

          <div className="col-md-4 col-sm-6 col-xs-12">
            <div className="aboutus">
              <p className="aboutus-text">Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in.</p>
              <p className="aboutus-text">This is Photoshop's version of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem</p>
              <a className="aboutus-more" href="#">read more</a>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 col-xs-12">
            <div className="aboutus-banner">
              <img src="http://themeinnovation.com/demo2/html/build-up/img/home1/about1.jpg" alt="" />
            </div>
          </div>
          <div className="col-md-5 col-sm-6 col-xs-12">
            <div className="feature">
              <div className="feature-box">
                <div className="clearfix">
                  <div className="iconset">
                    <span className="glyphicon glyphicon-cog icon" />
                  </div>
                  <div className="feature-content">
                    <h4>Work with heart</h4>
                    <p>Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in.</p>
                  </div>
                </div>
              </div>
              <div className="feature-box">
                <div className="clearfix">
                  <div className="iconset">
                    <span className="glyphicon glyphicon-cog icon" />
                  </div>
                  <div className="feature-content">
                    <h4>Reliable services</h4>
                    <p>Donec vitae sapien ut libero venenatis faucibu. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt</p>
                  </div>
                </div>
              </div>
              <div className="feature-box">
                <div className="clearfix">
                  <div className="iconset">
                    <span className="glyphicon glyphicon-cog icon" />
                  </div>
                  <div className="feature-content">
                    <h4>Great support</h4>
                    <p>Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
       </section>

       <section id="services" style={{position:"relative", marginTop:"-10rem", backgroundColor:"#D3D3D3"}}>
       <div className="container-fluid">
         <h2 className="section-title mb-2 h1">What we do</h2>
         <p className="text-center text-muted h5">Having and managing a correct marketing strategy is crucial in a fast moving market.</p>
         <div className="row mt-5">
           <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
             <div className="card">
               <div className="card-block block-1">
                 <h3 className="card-title">Special title</h3>
                 <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                 <a href="javascript:void();" title="Read more" className="read-more">Read more<i className="fa fa-angle-double-right ml-2" /></a>
               </div>
             </div>
           </div>
           <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
             <div className="card">
               <div className="card-block block-2">
                 <h3 className="card-title">Special title</h3>
                 <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                 <a href="javascript:void();" title="Read more" className="read-more">Read more<i className="fa fa-angle-double-right ml-2" /></a>
               </div>
             </div>
           </div>
           <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
             <div className="card">
               <div className="card-block block-3">
                 <h3 className="card-title">Special title</h3>
                 <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                 <a href="javascript:void();" title="Read more" className="read-more">Read more<i className="fa fa-angle-double-right ml-2" /></a>
               </div>
             </div>
           </div>
         </div>
         <div className="row">
           <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
             <div className="card">
               <div className="card-block block-4">
                 <h3 className="card-title">Special title</h3>
                 <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                 <a href="javascript:void();" title="Read more" className="read-more">Read more<i className="fa fa-angle-double-right ml-2" /></a>
               </div>
             </div>
           </div>
           <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
             <div className="card">
               <div className="card-block block-5">
                 <h3 className="card-title">Special title</h3>
                 <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                 <a href="javascript:void();" title="Read more" className="read-more">Read more<i className="fa fa-angle-double-right ml-2" /></a>
               </div>
             </div>
           </div>
           <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
             <div className="card">
               <div className="card-block block-6">
                 <h3 className="card-title">Special title</h3>
                 <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                 <a href="javascript:void();" title="Read more" className="read-more">Read more<i className="fa fa-angle-double-right ml-2" /></a>
               </div>
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
