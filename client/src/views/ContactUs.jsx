import React, {useState, useEffect} from 'react';
import axios from 'axios'
import { NotificationManager } from 'react-notifications';
import { Grid, Row, Col, Table, Modal as Mod, Button } from 'react-bootstrap';
import Card from '../components/Card/Card.jsx';
import moment from 'moment'
import "../assets/css/ContactUs.css";


const ContactUs =()=>{
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNo, setPhoneNo] = useState('')
  const [message, setMessage] = useState('')


const submitForm = (e) =>{
  e.preventDefault();

  axios.post('/api/contactUs', {name, email, phoneNo, message})
  .then(data=>{
    if (data.data.includes('success')) {
      NotificationManager.success("submitted Successfully");
      setName('')
      setEmail('')
      setPhoneNo('')
      setMessage('')
    }
    else {
      NotificationManager.error("Something wrong");
    }
  })
}

  return (
    <div className="" style={{overflowX:"hidden"}}>

    <h1 className="text-center"><strong>Looking to get in touch?</strong></h1>

    <div className="subHead">
    <h3 className="text-center " >We'd love to hear from you or answer any questions, no matter whether they're
    about trials, pricing, features, getting a demo, exploring a partnership.</h3>
    </div>
    <br/>
    <div>
    <p className="text-center haeding">We are here to assist you 24/7. Feel free to fill out the form below to get in touch with us, or email us directly at <a href="mailto:support@melisxpress.com">support@melisxpress.com</a></p>
    </div>

    <div>


    <div className="contact-us">
            <div className="container">
              <div className="contact-form">
                <div className="row">
                  <div className="col-sm-12">
                    <form onSubmit={submitForm}>
                      <div className="messages" id="form-messages" />
                      <div className="controls">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group">
                              <label htmlFor="form_name" style={{color:"black"}}>Name *</label>
                              <input id="form_name" type="text" name="name" className="form-control" placeholder="Please enter your name *" required="required" data-error="Firstname is required." value={name} onChange={(e)=>setName(e.target.value)}/>
                              <div className="help-block with-errors" />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group">
                              <label htmlFor="form_email" style={{color:"black"}}>Email *</label>
                              <input id="form_email" type="email" name="email" className="form-control" placeholder="Please enter your email *" required="required" data-error="Valid email is required." value={email} onChange={(e)=>setEmail(e.target.value)}/>
                              <div className="help-block with-errors" />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-group">
                              <label htmlFor="form_phone" style={{color:"black"}}>Phone*</label>
                              <input id="form_phone" type="tel" name="phone" className="form-control" required oninvalid="setCustomValidity('Plz enter your correct phone number ')" placeholder="Enter your mobile no. 0123456789"
                              pattern="[0-9]{3}[0-9]{3}[0-9]{4}" value={phoneNo} onChange={(e)=>setPhoneNo(e.target.value)} maxLength="10"/>
                              <small>Enter 10 digit number</small>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group">
                              <label htmlFor="form_message" style={{color:"black"}}>Message *</label>
                              <textarea id="form_message" name="message" className="form-control" placeholder="Message for me *" rows={4} required="required" data-error="Please,leave us a message." value={message} onChange={(e)=>setMessage(e.target.value)} />
                              <div className="help-block with-errors" />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <input type="submit" className="btn btn-black"/>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br/>
          <br/>


    </div>
    </div>
  )
}

export default ContactUs;
