import React,{useState, useEffect} from 'react';
import axios from 'axios';
import { Grid, Row, Col, Table } from "react-bootstrap";

import Card from "../components/Card/Card.jsx";
import '../assets/css/productPage.css'

const Products= ()=>{


const [productList, setProductList] = useState([]);

useEffect(()=>{
  getProductList();
},[])


const getProductList = () =>{
    axios
    .get('/shopify/product')
    .then(data=>{
      console.log("get api of product list", data);
      setProductList(data.data);
    })

}



  return(
    <div className="">
    <h2>Ecommerce Products Display Layout</h2>

    {productList.map(list=>{
      return(
    <div className="col-sm-3">
           <article className="col-item">
             <div className="photo">
               <div className="options-cart-round">
                 <button className="btn btn-default" title="Add to cart">
                   <span className="fa fa-eye" />
                 </button>
               </div>

               <a href="#"> <img src={`data:image/jpeg;base64, ${list.productImage[0].imgBufferData}`} className="img-responsive" alt="Product Image" /> </a>

             </div>
             <div className="info">
               <div className="row">
                 <div className="price-details col-md-6">

                   <h1><b>{list.name}</b></h1>
                   <span className="price-new"><b>&#8377;</b>{list.price}</span>
                   <hr/>
                   <p className="details">
                     {list.description}
                   </p>
                 </div>
               </div>
             </div>
           </article>
         </div>



      )
    })}

    </div>
  )
}
export default Products;
