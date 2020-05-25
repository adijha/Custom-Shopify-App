import React from 'react'
import '../assets/css/SupplierForm.css';
import { Navbar, Nav, NavDropdown, Form,  FormControl, Button, Table} from 'react-bootstrap';


const SupplierForm = () =>{



  return(
    <div>
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



     {/*Form Part*/}

     <div className="container">
       <div className="row">
         <section>
           <div className="wizard">
             <div className="wizard-inner">
               <ul className="nav nav-tabs wizard-tab" role="tablist">
                 <li role="presentation" className="active">
                   <a href="#step1" data-toggle="tab" aria-controls="step1" role="tab" title="Step 1">
                     <span className="round-tab">
                       <i className="glyphicon glyphicon-folder-open" />
                     </span>
                   </a>
                 </li>
                 <li role="presentation" className="disabled">
                   <a href="#step2" data-toggle="tab" aria-controls="step2" role="tab" title="Step 2">
                     <span className="round-tab">
                       <i className="glyphicon glyphicon-pencil" />
                     </span>
                   </a>
                 </li>
                 <li role="presentation" className="disabled">
                   <a href="#step3" data-toggle="tab" aria-controls="step3" role="tab" title="Step 3">
                     <span className="round-tab">
                       <i className="glyphicon glyphicon-picture" />
                     </span>
                   </a>
                 </li>
                 <li role="presentation" className="disabled">
                   <a href="#complete" data-toggle="tab" aria-controls="complete" role="tab" title="Complete">
                     <span className="round-tab">
                       <i className="glyphicon glyphicon-ok" />
                     </span>
                   </a>
                 </li>
               </ul>
             </div>
             <form role="form">
               <div className="tab-content" >
                 <div className="tab-pane active" role="tabpanel" id="step1">
                   <div className="step1">
                    <div className="personalDetails" style={{width:"50%"}}>
                    <div className="form-group">
        <label htmlFor="exampleInputEmail1">Name</label>
        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter name" />
      </div>
                    <div className="form-group">
        <label htmlFor="exampleInputEmail1">Email address</label>
        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
      </div>
      <div className="form-group">
        <label htmlFor="exampleInputPassword1">Phone No.</label>
        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Enter phone no" />
      </div>


                    </div>


                   </div>

                 </div>
                 <div className="tab-pane" role="tabpanel" id="step2">
                   <div className="step2">
                     <div className="step_21">
                       <div className="row">
                       </div>
                     </div>
                     <div className="step-22">
                     </div>
                   </div>
                   <ul className="list-inline pull-right">
                     <li><button type="button" className="btn btn-default prev-step">Previous</button></li>
                     <li><button type="button" className="btn btn-primary next-step">Save and continue</button></li>
                   </ul>
                 </div>
                 <div className="tab-pane" role="tabpanel" id="step3">
                   <div className="step33">
                     <h5><strong>Basic Details</strong></h5>
                     <hr />
                     <div className="row mar_ned">
                     </div>
                     <div className="row mar_ned">
                       <div className="col-md-4 col-xs-3">
                         <p align="right"><stong>Date of birth</stong></p>
                       </div>
                       <div className="col-md-8 col-xs-9">
                         <div className="row">
                           <div className="col-md-4 col-xs-4 wdth">
                             <select name="visa_status" id="visa_status" className="dropselectsec1">
                               <option value>Date</option>
                               <option value={2}>1</option>
                               <option value={1}>2</option>
                               <option value={4}>3</option>
                               <option value={5}>4</option>
                               <option value={6}>5</option>
                               <option value={3}>6</option>
                               <option value={7}>7</option>
                               <option value={8}>8</option>
                               <option value={9}>9</option>
                             </select>
                           </div>
                           <div className="col-md-4 col-xs-4 wdth">
                             <select name="visa_status" id="visa_status" className="dropselectsec1">
                               <option value>Month</option>
                               <option value={2}>Jan</option>
                               <option value={1}>Feb</option>
                               <option value={4}>Mar</option>
                               <option value={5}>Apr</option>
                               <option value={6}>May</option>
                               <option value={3}>June</option>
                               <option value={7}>July</option>
                               <option value={8}>Aug</option>
                               <option value={9}>Sept</option>
                             </select>
                           </div>
                           <div className="col-md-4 col-xs-4 wdth">
                             <select name="visa_status" id="visa_status" className="dropselectsec1">
                               <option value>Year</option>
                               <option value={2}>1990</option>
                               <option value={1}>1991</option>
                               <option value={4}>1992</option>
                               <option value={5}>1993</option>
                               <option value={6}>1994</option>
                               <option value={3}>1995</option>
                               <option value={7}>1996</option>
                               <option value={8}>1997</option>
                               <option value={9}>1998</option>
                             </select>
                           </div>
                         </div>
                       </div>
                     </div>
                     <div className="row mar_ned">
                       <div className="col-md-4 col-xs-3">
                         <p align="right"><stong>Marital Status</stong></p>
                       </div>
                       <div className="col-md-8 col-xs-9">
                         <label className="radio-inline">
                           <input type="radio" name="inlineRadioOptions" id="inlineRadio2" defaultValue="option2" /> Single
                         </label>
                         <label className="radio-inline">
                           <input type="radio" name="inlineRadioOptions" id="inlineRadio3" defaultValue="option3" /> Married
                         </label>
                       </div>
                     </div>
                     <div className="row mar_ned">
                       <div className="col-md-4 col-xs-3">
                         <p align="right"><stong>Highest Education</stong></p>
                       </div>
                       <div className="col-md-8 col-xs-9">
                         <select name="highest_qualification" id="highest_qualification" className="dropselectsec">
                           <option value> Select Highest Education</option>
                           <option value={1}>Ph.D</option>
                           <option value={2}>Masters Degree</option>
                           <option value={3}>PG Diploma</option>
                           <option value={4}>Bachelors Degree</option>
                           <option value={5}>Diploma</option>
                           <option value={6}>Intermediate / (10+2)</option>
                           <option value={7}>Secondary</option>
                           <option value={8}>Others</option>
                         </select>
                       </div>
                     </div>
                     <div className="row mar_ned">
                       <div className="col-md-4 col-xs-3">
                         <p align="right"><stong>Specialization</stong></p>
                       </div>
                       <div className="col-md-8 col-xs-9">
                         <input type="text" name="specialization" id="specialization" placeholder="Specialization" className="dropselectsec" autoComplete="off" />
                       </div>
                     </div>
                     <div className="row mar_ned">
                       <div className="col-md-4 col-xs-3">
                         <p align="right"><stong>Year of Passed Out</stong></p>
                       </div>
                       <div className="col-md-8 col-xs-9">
                         <select name="year_of_passedout" id="year_of_passedout" className="birthdrop">
                           <option value>Year</option>
                           <option value={1980}>1980</option>
                           <option value={1981}>1981</option>
                           <option value={1982}>1982</option>
                           <option value={1983}>1983</option>
                           <option value={1984}>1984</option>
                           <option value={1985}>1985</option>
                           <option value={1986}>1986</option>
                           <option value={1987}>1987</option>
                           <option value={1988}>1988</option>
                           <option value={1989}>1989</option>
                           <option value={1990}>1990</option>
                           <option value={1991}>1991</option>
                           <option value={1992}>1992</option>
                           <option value={1993}>1993</option>
                           <option value={1994}>1994</option>
                           <option value={1995}>1995</option>
                           <option value={1996}>1996</option>
                           <option value={1997}>1997</option>
                           <option value={1998}>1998</option>
                           <option value={1999}>1999</option>
                           <option value={2000}>2000</option>
                           <option value={2001}>2001</option>
                           <option value={2002}>2002</option>
                           <option value={2003}>2003</option>
                           <option value={2004}>2004</option>
                           <option value={2005}>2005</option>
                           <option value={2006}>2006</option>
                           <option value={2007}>2007</option>
                           <option value={2008}>2008</option>
                           <option value={2009}>2009</option>
                           <option value={2010}>2010</option>
                           <option value={2011}>2011</option>
                           <option value={2012}>2012</option>
                           <option value={2013}>2013</option>
                           <option value={2014}>2014</option>
                           <option value={2015}>2015</option>
                         </select>
                       </div>
                     </div>
                     <div className="row mar_ned">
                       <div className="col-md-4 col-xs-3">
                         <p align="right"><stong>Total Experience</stong></p>
                       </div>
                       <div className="col-md-8 col-xs-9">
                         <div className="row">
                           <div className="col-md-6 col-xs-6 wdth">
                             <select name="visa_status" id="visa_status" className="dropselectsec1">
                               <option value>Month</option>
                               <option value={2}>Jan</option>
                               <option value={1}>Feb</option>
                               <option value={4}>Mar</option>
                               <option value={5}>Apr</option>
                               <option value={6}>May</option>
                               <option value={3}>June</option>
                               <option value={7}>July</option>
                               <option value={8}>Aug</option>
                               <option value={9}>Sept</option>
                             </select>
                           </div>
                           <div className="col-md-6 col-xs-6 wdth">
                           </div>
                         </div>
                       </div>
                     </div>
                     <div className="row mar_ned">
                     </div>
                   </div>
                   <ul className="list-inline pull-right">
                     <li><button type="button" className="btn btn-default prev-step">Previous</button></li>
                     <li><button type="button" className="btn btn-default next-step">Skip</button></li>
                     <li><button type="button" className="btn btn-primary btn-info-full next-step">Save and continue</button></li>
                   </ul>
                 </div>
                 <div className="tab-pane" role="tabpanel" id="complete">
                   <div className="step44">
                     <h5>Completed</h5>
                   </div>
                 </div>
                 <div className="clearfix" />
               </div>
             </form>
           </div>
         </section>
       </div>
     </div>



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
  )
}

export default SupplierForm;
