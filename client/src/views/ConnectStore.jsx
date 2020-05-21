import React, {useState} from "react";
import axios from 'axios';
import '../assets/css/ConnectStore.css'
import { NotificationManager } from 'react-notifications';


const ConnectStore = ()=>{

const [query, setQuery]=useState("");

const urlOpen = ()=>{
  if (query=="") {
    NotificationManager.error('Enter Shopify Store Name');
  }
  else{
    const url = `https://melisxpress.com/shopify?shop=${query}`;
    const win = window.open(url, '_blank');
    win.focus()
  }

}


  return(
    <div>
    <section id="connect-banner">
    <h2 className="text-center" style={{color:"yellowgreen"}}>Connect Store to Shopify</h2>
    <div className="text-center connect-image">
      <img src={require('../assets/img/connect.png')}/>
      </div>
    </section>

    <section id="searchBar">

    <div className="container">

    <h4>1. Enter Shopify Store Name <small>(example: Store-Name.myshopify.com)</small></h4>

      <div className="bar ">
        <input type="text"  className="form-control-plaintext urlbar"  value={query} onChange={(e)=>setQuery(e.target.value)} required/>
      </div>
      <br/>
      <div className="urlbtn text-center">
      <input className="text-center" type="submit" value="Connect" onClick={urlOpen} />
      </div>

      <h4>2. You will be redirected to Shopify to authorize Melisxpress.</h4>
      <h4>3. Click on install.</h4>
    </div>
    </section>
    <br/>
    <section id="connect-footer">
      <p className="text-center">For any Querry or Technical help call us on +1800 1800 800</p>
    </section>

    </div>
  )
}

export default ConnectStore;
