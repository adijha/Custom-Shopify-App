import React, {useState, useEffect} from "react";
import axios from 'axios'
import {Redirect, Link, BrowserRouter as Router,

Switch,

Route} from 'react-router-dom';
import '../assets/css/Landing.css'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.js';
import { Navbar, Nav, NavDropdown, Form,  FormControl, Button, Table} from 'react-bootstrap';



const Landing=()=> {

const [basic, setBasic] = useState("19.99 / month");
const [pro, setPro] = useState("69.99 / month");
const [plus, setPlus] = useState("199.99 / month");
const [plan, setPlan] = useState("Monthly")
const [checkBox, setCheckBox] = useState(true)


useEffect(()=>{
  getchPage()
},[])

const getchPage = ()=>{
  axios.get('/api/analyticProduct')
  .then(data=>{
    console.log(data, "product response");
  })
}

const handleClick = () =>{
  setCheckBox(!checkBox)
  console.log(checkBox)
  if (checkBox===true) {
    setBasic("14.99 / month")
    setPro("49.99 / month")
    setPlus("129.99 / month")
    setPlan("Yearly")
  }
  else {
    setBasic("19.99 / month")
    setPro("69.99 / month")
    setPlus("199.99 / month")
    setPlan("Monthly")
  }
}


  return (
    <div style={{overflow:"hidden"}}>
    <div style={{height:"100px"}}>
    <Navbar bg="light" expand="lg" style={{border:"none"}}>
    <div className="container">
    <div className="row">
    <div className="col-md-6">
    <Navbar.Brand href="#"><img        className="d-inline-block align-top navBrand"
 src={require('../assets/img/latestLogo.png')} style={{float:"left",display: "flex",
height: "300px",
padding: "0",
top: "-12rem",
position: "relative"}}/></Navbar.Brand>
</div>
<div className="col-md-6" style={{}}>

<div className="collapse navbar-collapse" id="navbarSupportedContent" style={{color:"blue"}}>

         <Nav className="mr-auto login" style={{ color:"blue", float:"right"}}>

           <NavDropdown title="Login" id="basic-nav-dropdown" >
               <li><a href="/login-admin" className="text-center" style={{float:"left", color:"black"}}>Admin <span className="glyphicon glyphicon-cog pull-left" /></a></li>
               <li><a href="/login-supplier" style={{float:"left", color:"black"}}>Supplier <span className="glyphicon glyphicon-stats pull-left" /></a></li>
               <li><a href="/login-merchant" style={{float:"left", color:"black"}}>Merchant <span className="glyphicon glyphicon-stats pull-left" /></a></li>
           </NavDropdown>
         </Nav>

     </div>




</div>
</div>
</div>
  </Navbar>
     </div>

{/*Banner section*/}
     <section id="banner">
      <div className="container">
        <div className="row" style={{float:"left", marginTop:"-20rem"}}>
          <div className="col-sm-5">
            <p className="promo-title"><b>Welcome to Melis</b>xpress</p>
            <p style={{textAlign:"justify"}}>Discover large variety of viral products
for your store in seconds, add them to your store and we will ship them directly to your customers. <b>No inventory, no risk. </b>
 Let's get started!
</p>
            <br/>
            <button type="button" className=" text-center signup-banner" style={{minWidth:"20%"}}><a href="/merchantSignup" style={{textDecoration: "none", color:"white"}}>Sign Up</a></button>
            <br/>
            <p style={{marginTop:"10px"}}><i>Start your 7 days trial. 100% Secure</i></p>
          </div>
          <div className="col-sm-5 text-center">
            {/*<img className="banner-img" src={require('../assets/img/banner.png')} alt="" />*/}
            <div className="container">
        <div id="myCarousel" className="carousel slide" data-ride="carousel">
          {/* Indicators */}
          {/* Wrapper for slides */}
          <div className="carousel-inner">
            <div className="item active">
              <img className="banner-img"  src={require('../assets/img/banner.png')} alt=""  />

            </div>
            <div className="item">
              <img className="banner-img" src={require('../assets/img/banner.png')} alt=""  />

            </div>
            <div className="item">
              <img className="banner-img" src={require('../assets/img/banner.png')} alt=""  />

            </div>
          </div>
          {/* Left and right controls */}
        </div>
      </div>
          </div>
        </div>
      </div>
     </section>

     {/*feature Section*/}

    <section id="Features">
    <div className="container ">
      <div className="row text-center">

      <h1 className="section-title text-center" style={{color:"#000080"}}>Features</h1>

        <div className="col-md-4 features">
          <svg className="feature-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h24v24H0z"></path><path d="M7 3h10a4 4 0 110 8H7a4 4 0 110-8zm0 6a2 2 0 100-4 2 2 0 000 4z" fill="#335EEA"></path><path d="M7 13h10a4 4 0 110 8H7a4 4 0 110-8zm10 6a2 2 0 100-4 2 2 0 000 4z" fill="#335EEA" opacity=".3"></path></g></svg>
          <h4 className="text-center">Faster Shipping</h4>
          <p className="text-center">Melisxpress ships your products at highest priority</p>
      </div>

      <div className="col-md-4 features">
      <svg className="feature-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h24v24H0z"></path><path d="M5.5 4h4A1.5 1.5 0 0111 5.5v1A1.5 1.5 0 019.5 8h-4A1.5 1.5 0 014 6.5v-1A1.5 1.5 0 015.5 4zm9 12h4a1.5 1.5 0 011.5 1.5v1a1.5 1.5 0 01-1.5 1.5h-4a1.5 1.5 0 01-1.5-1.5v-1a1.5 1.5 0 011.5-1.5z" fill="#335EEA"></path><path d="M5.5 10h4a1.5 1.5 0 011.5 1.5v7A1.5 1.5 0 019.5 20h-4A1.5 1.5 0 014 18.5v-7A1.5 1.5 0 015.5 10zm9-6h4A1.5 1.5 0 0120 5.5v7a1.5 1.5 0 01-1.5 1.5h-4a1.5 1.5 0 01-1.5-1.5v-7A1.5 1.5 0 0114.5 4z" fill="#335EEA" opacity=".3"></path></g></svg>        <h4 className="text-center">Branded Package</h4>
        <p className="text-center">Custom package for all of your products</p>
    </div>

    <div className="col-md-4 features">
      <svg className="feature-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h24v24H0z"></path><path d="M7 3h10a4 4 0 110 8H7a4 4 0 110-8zm0 6a2 2 0 100-4 2 2 0 000 4z" fill="#335EEA"></path><path d="M7 13h10a4 4 0 110 8H7a4 4 0 110-8zm10 6a2 2 0 100-4 2 2 0 000 4z" fill="#335EEA" opacity=".3"></path></g></svg>
      <h4 className="text-center">Automation</h4>
      <p className="text-center">Save time with our OneClick fulfillment feature</p>
  </div>
      </div>

      <div className="row text-center">
        <div className="col-md-4 features">
          <svg className="feature-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h24v24H0z"></path><path d="M5.5 4h4A1.5 1.5 0 0111 5.5v1A1.5 1.5 0 019.5 8h-4A1.5 1.5 0 014 6.5v-1A1.5 1.5 0 015.5 4zm9 12h4a1.5 1.5 0 011.5 1.5v1a1.5 1.5 0 01-1.5 1.5h-4a1.5 1.5 0 01-1.5-1.5v-1a1.5 1.5 0 011.5-1.5z" fill="#335EEA"></path><path d="M5.5 10h4a1.5 1.5 0 011.5 1.5v7A1.5 1.5 0 019.5 20h-4A1.5 1.5 0 014 18.5v-7A1.5 1.5 0 015.5 10zm9-6h4A1.5 1.5 0 0120 5.5v7a1.5 1.5 0 01-1.5 1.5h-4a1.5 1.5 0 01-1.5-1.5v-7A1.5 1.5 0 0114.5 4z" fill="#335EEA" opacity=".3"></path></g></svg>
          <h4 className="text-center">Branded Invoice</h4>
          <p className="text-center">Melisxpress provides branded Invoice for customer’s trust</p>
      </div>

      <div className="col-md-4 features">
        <svg className="feature-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h24v24H0z"></path><path d="M7 3h10a4 4 0 110 8H7a4 4 0 110-8zm0 6a2 2 0 100-4 2 2 0 000 4z" fill="#335EEA"></path><path d="M7 13h10a4 4 0 110 8H7a4 4 0 110-8zm10 6a2 2 0 100-4 2 2 0 000 4z" fill="#335EEA" opacity=".3"></path></g></svg>
        <h4 className="text-center">Private Label</h4>
        <p className="text-center">Melisxpress gives option for high volume stores</p>
      </div>

      <div className="col-md-4 features">
        <svg className="feature-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h24v24H0z"></path><path d="M5.5 4h4A1.5 1.5 0 0111 5.5v1A1.5 1.5 0 019.5 8h-4A1.5 1.5 0 014 6.5v-1A1.5 1.5 0 015.5 4zm9 12h4a1.5 1.5 0 011.5 1.5v1a1.5 1.5 0 01-1.5 1.5h-4a1.5 1.5 0 01-1.5-1.5v-1a1.5 1.5 0 011.5-1.5z" fill="#335EEA"></path><path d="M5.5 10h4a1.5 1.5 0 011.5 1.5v7A1.5 1.5 0 019.5 20h-4A1.5 1.5 0 014 18.5v-7A1.5 1.5 0 015.5 10zm9-6h4A1.5 1.5 0 0120 5.5v7a1.5 1.5 0 01-1.5 1.5h-4a1.5 1.5 0 01-1.5-1.5v-7A1.5 1.5 0 0114.5 4z" fill="#335EEA" opacity=".3"></path></g></svg>
      <h4 className="text-center">Thank You Letter</h4>
      <p className="text-center">Melisxpress allows branded thank you letters for your store</p>
      </div>
      </div>


    </div>
    </section>

     {/*How Does Work*/}
     <section id="work">
      <div className="container-fluid">
      <h1 className="section-title text-center" style={{color:"#000080"}}>How does it work</h1>

        <div className="row work-flow">
          <div className="col-sm-2 working">
            <svg style={{width:"100%", height:"70px"}} className="bi bi-box-arrow-in-down text-center" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                 <path fillRule="evenodd" d="M4.646 8.146a.5.5 0 01.708 0L8 10.793l2.646-2.647a.5.5 0 01.708.708l-3 3a.5.5 0 01-.708 0l-3-3a.5.5 0 010-.708z" clipRule="evenodd" />
                 <path fillRule="evenodd" d="M8 1a.5.5 0 01.5.5v9a.5.5 0 01-1 0v-9A.5.5 0 018 1z" clipRule="evenodd" />
                 <path fillRule="evenodd" d="M1.5 13.5A1.5 1.5 0 003 15h10a1.5 1.5 0 001.5-1.5v-8A1.5 1.5 0 0013 4h-1.5a.5.5 0 000 1H13a.5.5 0 01.5.5v8a.5.5 0 01-.5.5H3a.5.5 0 01-.5-.5v-8A.5.5 0 013 5h1.5a.5.5 0 000-1H3a1.5 1.5 0 00-1.5 1.5v8z" clipRule="evenodd" />
            </svg>
            <p className="text-center" style={{fontSize:"20px", marginTop:"20px"}}>1.Get Melisxpress</p>

          </div>

          <div className="direction"></div>


          <div className="col-sm-2 working">
            <svg  style={{width:"100%", height:"70px"}} className="bi bi-link-45deg" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.715 6.542L3.343 7.914a3 3 0 104.243 4.243l1.828-1.829A3 3 0 008.586 5.5L8 6.086a1.001 1.001 0 00-.154.199 2 2 0 01.861 3.337L6.88 11.45a2 2 0 11-2.83-2.83l.793-.792a4.018 4.018 0 01-.128-1.287z"/>
              <path d="M5.712 6.96l.167-.167a1.99 1.99 0 01.896-.518 1.99 1.99 0 01.518-.896l.167-.167A3.004 3.004 0 006 5.499c-.22.46-.316.963-.288 1.46z"/>
              <path d="M6.586 4.672A3 3 0 007.414 9.5l.775-.776a2 2 0 01-.896-3.346L9.12 3.55a2 2 0 012.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 00-4.243-4.243L6.586 4.672z"/>
              <path d="M10 9.5a2.99 2.99 0 00.288-1.46l-.167.167a1.99 1.99 0 01-.896.518 1.99 1.99 0 01-.518.896l-.167.167A3.004 3.004 0 0010 9.501z"/>
            </svg>
            <p className="text-center" style={{fontSize:"20px", marginTop:"20px"}}>2.Connect to shopify</p>
          </div>

          <div className="direction"></div>

          <div className="col-sm-2 working">
          <svg style={{width:"100%", height:"70px"}} className="bi bi-plus-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M8 3.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H4a.5.5 0 010-1h3.5V4a.5.5 0 01.5-.5z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M7.5 8a.5.5 0 01.5-.5h4a.5.5 0 010 1H8.5V12a.5.5 0 01-1 0V8z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M14 1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z" clip-rule="evenodd"/>
          </svg>
            <p className="text-center" style={{fontSize:"20px", marginTop:"20px"}}>3. Find and import products</p>
          </div>

          <div className=" direction"></div>

          <div className="col-sm-2 working">
          <svg style={{width:"100%", height:"70px"}} className="bi bi-house" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M2 13.5V7h1v6.5a.5.5 0 00.5.5h9a.5.5 0 00.5-.5V7h1v6.5a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 13.5zm11-11V6l-2-2V2.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M7.293 1.5a1 1 0 011.414 0l6.647 6.646a.5.5 0 01-.708.708L8 2.207 1.354 8.854a.5.5 0 11-.708-.708L7.293 1.5z" clip-rule="evenodd"/>
          </svg>
            <p className="text-center" style={{fontSize:"20px", marginTop:"20px"}}>4.Make your store look good</p>
          </div>

          <div className=" direction"></div>

          <div className="col-sm-2 working">
          <svg style={{width:"100%", height:"70px"}} className="bi bi-cursor" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M14.082 2.182a.5.5 0 01.103.557L8.528 15.467a.5.5 0 01-.917-.007L5.57 10.694.803 8.652a.5.5 0 01-.006-.916l12.728-5.657a.5.5 0 01.556.103zM2.25 8.184l3.897 1.67a.5.5 0 01.262.263l1.67 3.897L12.743 3.52 2.25 8.184z" clip-rule="evenodd"/>
          </svg>
            <p className="text-center" style={{fontSize:"20px", marginTop:"20px"}}>5.Drive traffic</p>
          </div>

        </div> {/*Row end*/}

      </div>
     </section>

     <section style={{padding:"60px 0"}}>
      <div className="container">
        <div className="row">
          <div className="col-md-5">
            <img src={require('../assets/img/2.jpg')} style={{borderRadius:"5px"}}/>
            <br/>
            <form style={{marginTop:"20px"}}>
            <div className="form-group" style={{width:"100%"}}>
              <input styletype="email" className="form-control fields-blank" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Name" />
            </div>
        <div className="form-group" style={{width:"100%"}}>
          <input styletype="email" className="form-control fields-blank" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email" />
        </div>
        <div className="form-group" style={{width:"100%"}}>
          <input type="password" className="form-control fields-blank" id="exampleInputPassword1" placeholder="Password" />
        </div>

        <button style={{backgroundColor: "#90ee90", color:"black"}}type="submit" className="btn btn-success">Sign Up</button>
      </form>
          </div>

          <div className="col-md-6 about-us">
          <p className="about-title">Work with top level suppliers</p>
          <p style={{fontWeight:"lighter", fontSize:"20px"}}>Melisxpress has found the top level suppliers in the
              Industry for you to have the best quality of products
              for your customer satisfaction & scale your brand
              without any trouble.
          </p>
          <ul>
            <li className="check">100% Best quality guaranteed</li>
            <li className="check">100% reliable suppliers</li>
            <li className="check">Gives you priority </li>
            <li className="check">Highly experienced</li>
          </ul>
          </div>


        </div>
      </div>
     </section>

     <section id="services" style={{padding:"60px 0"}}>
      <div className="container">
        <div className="row">

          <div className="col-md-6">
          <p className="service-title">Easy to scale</p>
          <p style={{fontWeight:"lighter" , fontSize:"20px"}}>Melisxpress is not only fulfill orders but
            provides you winning products everyday
            which saves your time & makes it easy
            to scale
            </p>

              <div className="card">
                <div className="card-block block-1">
                  <h3 className="card-title">Winning Products</h3>
                  <p className="card-text">Our product research team adds winning products everyday for you.</p>
                </div>
              </div>
              <div className="card">
                <div className="card-block block-2">
                  <h3 className="card-title">Request Product</h3>
                  <p className="card-text">If you have any winning product we will source out for you with just 1 click with quality control.</p>
                </div>
              </div>
          </div>

          <div className="col-md-6">
            <img src={require('../assets/img/1.jpg')} className="img-fluid"/>
          </div>

        </div>
      </div>
     </section>

     <section id="feedback">
     {/*
      <h1 className="text-center">Our customers are our biggest fans.</h1>
      <div className="container feedPara-div" >
      <p className="feedback-para text-center">We always ensure that our clients are satisfied in everything, we take the
           responsibility for the best quality of products & services.</p>
           </div>
      <br/>

*/}

<div className="container">
<div className="row">
<div className="col-md-4">
</div>
<div className="col-md-4">
<button type="button" className=" text-center signup-banner" style={{}}><a href="/merchantSignup" style={{textDecoration: "none", color:"white"}}>Sign Up Now</a></button>

</div>
<div className="col-md-4">
</div>
</div>
</div>
     </section >

     <section id="pricing" style={{padding:"60px 0"}}>
     <h1 className="text-center">Pricing Plans</h1>

     <div className="container text-center">
     <div className="row text-center">
     <div className="col-md-6">
         <label className="switch text-center" style={{float:"right"}}>
          <input type="checkbox" value={checkBox} onChange={handleClick}/>
          <span className="slider round"></span>
          </label>
          </div>
          <div className="col-md-6" >
          <p  className="switch-para" style={{float:"left"}}>{plan}</p>
          </div>
          </div>
      </div>
      <br/>
      <br/>
      <div className="container">
        <div className="row">
        <div className="col-md-4">
          <div className="panel panel-success">
            <div className="panel-heading">
              <h4 className="text-center">
                Basic</h4>
            </div>
            <div className="panel-body text-center">
              <p className="lead">
                <strong>${basic}</strong></p>
            </div>
            <ul className="list-group list-group-flush text-center tickMark">
              <li className="list-group-item"><i className=""></i><b>200</b> Orders per month</li>
              <li className="list-group-item"><i className="icon-ok text-danger" />Real time analytics</li>
              <li className="list-group-item"><i className="icon-ok text-danger" />Unlimited imports</li>
              <li className="list-group-item"><i className="icon-ok text-danger" />Track shipment</li>
              <li className="list-group-item"><i className="icon-ok text-danger" />Bulk ordering</li>
              <li className="list-group-item"><i className="icon-ok text-danger" />24/7 Email support</li>
              <li className="list-group-item"><i className="icon-ok text-danger" />Product sourcing</li>
              <li className="list-group-item"><i className="icon-ok text-danger" />Customized logo invoice</li>
              <li className="list-group-item"><i className="icon-ok text-danger" /><b>50 cents/order </b>Branded thank you letter</li>
              <li className="list-group-item"><i className="icon-ok text-danger" /><b>Paid </b>weekly audit & call</li>
            </ul>
            <div className="panel-footer">
              <a className="btn btn-lg btn-block btn-success" href="/merchantSignup">Select
                </a>
            </div>
          </div>
        </div>

          <div className="col-md-4">
            <div className="panel panel-info">
              <div className="panel-heading">
                <h4 className="text-center">
                  PRO</h4>
              </div>
              <div className="panel-body text-center">
                <p className="lead">
                  <strong>${pro}</strong></p>
              </div>
              <ul className="list-group list-group-flush text-center tickMark">
              <li className="list-group-item"><i className=""></i><b>Unlimited</b> Orders per month</li>
              <li className="list-group-item"><i className="icon-ok text-danger" />Real time analytics</li>
              <li className="list-group-item"><i className="icon-ok text-danger" />Unlimited imports</li>
              <li className="list-group-item"><i className="icon-ok text-danger" />Track shipment</li>
              <li className="list-group-item"><i className="icon-ok text-danger" />Bulk ordering</li>
              <li className="list-group-item"><i className="icon-ok text-danger" />24/7 Email support</li>
              <li className="list-group-item"><i className="icon-ok text-danger" />Product sourcing</li>
              <li className="list-group-item"><i className="icon-ok text-danger" />Customized logo invoice</li>
              <li className="list-group-item"><i className="icon-ok text-danger" />Branded thank you letter</li>
              <li className="list-group-item"><i className="icon-ok text-danger" /><b>Paid </b>weekly audit & call</li>
              <li className="list-group-item"><i className="icon-ok text-danger extra" />Sample ordering</li>
              <li className="list-group-item"><i className="icon-ok text-danger extra" />Custom packaging</li>
              <li className="list-group-item"><i className="icon-ok text-danger extra" />Priority shipping</li>
              <li className="list-group-item"><i className="icon-ok text-danger extra" />Wining products</li>
              <li className="list-group-item"><i className="icon-ok text-danger extra" />One click fulfillment</li>

              </ul>
              <div className="panel-footer">
                <a className="btn btn-lg btn-block btn-info" href="/merchantSignup">Select</a>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="panel panel-warning">
              <div className="panel-heading">
                <h4 className="text-center">
                  Plus +</h4>
              </div>
              <div className="panel-body text-center">
                <p className="lead">
                  <strong>${plus}</strong></p>
              </div>
              <ul className="list-group list-group-flush text-center tickMark">
              <li className="list-group-item"><i className=""></i><b>Unlimited</b> Orders per month</li>
              <li className="list-group-item"><i className="icon-ok text-danger" />Real time analytics</li>
              <li className="list-group-item"><i className="icon-ok text-danger" />Unlimited imports</li>
              <li className="list-group-item"><i className="icon-ok text-danger" />Track shipment</li>
              <li className="list-group-item"><i className="icon-ok text-danger" />Bulk ordering</li>
              <li className="list-group-item"><i className="icon-ok text-danger" />24/7 Email support</li>
              <li className="list-group-item"><i className="icon-ok text-danger" />Product sourcing</li>
              <li className="list-group-item"><i className="icon-ok text-danger" />Customized logo invoice</li>
              <li className="list-group-item"><i className="icon-ok text-danger" />Branded thank you letter</li>
              <li className="list-group-item"><i className="icon-ok text-danger extra" /><b>Free</b> Weekly audit & call</li>
              <li className="list-group-item"><i className="icon-ok text-danger extra" />Sample ordering</li>
              <li className="list-group-item"><i className="icon-ok text-danger extra" />Custom packaging</li>
              <li className="list-group-item"><i className="icon-ok text-danger extra" />Priority shipping</li>
              <li className="list-group-item"><i className="icon-ok text-danger extra" />Wining products</li>
              <li className="list-group-item"><i className="icon-ok text-danger extra" />One click fulfillment</li>
              <li className="list-group-item"><i className="icon-ok text-danger extra" />Private labeling (Bulk Order)</li>
              <li className="list-group-item"><i className="icon-ok text-danger extra" />Dedicated support</li>

              </ul>
              <div className="panel-footer">
                <a className="btn btn-lg btn-block btn-warning" href="/merchantSignup">Select</a>
              </div>
            </div>
          </div>
        </div>
      </div>
     </section>

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

            <a href="#">Terms & Conditions</a>
            <a href="#">Privacy policy</a>
            <a href="#">Become a supplier</a>


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
export default Landing;
