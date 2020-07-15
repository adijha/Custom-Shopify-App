import React, {useState, useEffect} from 'react'
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Grid, Row, Col, Table, Modal as Mod, Button } from 'react-bootstrap';
import Card from '../components/Card/Card.jsx';
import {Redirect} from 'react-router-dom';
import moment from 'moment'

const Invoice = (props) =>{
  const token = localStorage.getItem('token');
  const decode = jwt_decode(token);
  const [orderList, setOrderList] = useState([]);
  const [customer, setCustomer] = useState({})
  const [totalAmount, setTotalAmount] = useState()
  const [totalQuantity, setTotalQuantity] = useState()
  const [invoiceDate, setInvoiceDate] = useState("")
  const [shipCharge, setShipCharge] = useState("")
  useEffect(() => {

    getOrderList();
  }, []);

  const getOrderList = () => {
    axios.get('/api/invoice/' + props.match.params.supplierId + '/'+ props.match.params.orderId).then((res) => {
      setOrderList(res.data)

      let price = []
      let quantity = []



      res.data.map(item=>{
        let shippingObj;

        if (item.customer.country.toLowerCase()==="usa") {
          shippingObj = item.shippingCharge.usa
        }
        else if (item.customer.country.toLowerCase()==="canada") {
          shippingObj = item.shippingCharge.canada
        }

        else if (item.customer.country.toLowerCase()==="australia") {
          shippingObj = item.shippingCharge.australia
        }

        else if (item.customer.country.toLowerCase()==="unitedKingdom") {
          shippingObj = item.shippingCharge.unitedKingdom
        }
        else if (item.customer.country.toLowerCase()!=="usa"||"canada"||"australia"||"unitedKingdom") {
          shippingObj = item.shippingCharge.international
        }

        setShipCharge(shippingObj)
        setCustomer(item.customer)
        let calprice = parseFloat(item.price)*parseFloat(item.quantity)+parseFloat(shippingObj)
        price.push(calprice)
        quantity.push(parseInt(item.quantity))

      })
      let totalPrice = price.reduce((a,b)=>a+b, 0)
      let totalQuantity = quantity.reduce((a,b)=>a+b, 0)
      setInvoiceDate(res.data[0].updated_on)
      setTotalAmount(totalPrice)
      setTotalQuantity(totalQuantity)

    });
  };


  return(
    <div>
    {(token.length===0)? (<Redirect to= "/login-supplier"/>):
      <>
      <div className="container">
      <div className="row">
        <div className="col-xs-12">
          <div className="invoice-title">
            <h2 className="text-center">Invoice</h2>
          </div>
          <hr />
          <div className="row">
            <div className="col-xs-6">
              <address>
                <strong>To: </strong>{customer.name}
                <br/>
                <strong>Add: </strong>{customer.address}<br />
                {customer.city}, {customer.state}<br />
                {customer.country}- {customer.zip}
                <br/>

                <strong>Phone No.: </strong>{customer.phone}
              </address>
            </div>
            <div className="col-xs-6 text-right">
              <address>
                <strong>Order Date:</strong><br />
                {moment(invoiceDate).format("MMM DD YYYY") || "NA"}<br /><br />
              </address>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title"><strong>Order summary</strong></h3>
            </div>
            <div className="panel-body">
              <div className="table-responsive">
                <table className="table table-condensed">
                  <thead>
                    <tr>
                      <td className="text-center"><strong>Image</strong></td>
                      <td className="text-center"><strong>Name</strong></td>
                      <td className="text-center"><strong>Item No.</strong></td>
                      <td className="text-center"><strong>Qty</strong></td>
                      <td className="text-center"><strong>Product Cost</strong></td>
                      <td className="text-center"><strong>Shipping Cost</strong></td>
                      <td className="text-right"><strong>Totals</strong></td>
                    </tr>
                  </thead>
                  <tbody>
                    {/* foreach ($order->lineItems as $line) or some such thing here */}
                    {orderList.map((item, key)=>{
                      return(
                        <tr>
                          <td className="text-center" style={{width:"20%"}}>{item.productImage.length != "" ? (
                            <img style={{width:"150px", height:"100px"}}
                              className="product-logo"
                              src={`data:image/jpeg;base64, ${item.productImage}`}
                            />
                          ) : (
                            "No Image Available"
                          )}</td>
                          <td className="text-center">{item.name} <small>{item.pName}</small></td>
                          <td className="text-center">{item.sku}</td>
                          <td className="text-center">{item.quantity} PCS</td>
                          <td className="text-center">${

                          new Intl.NumberFormat("en-US").format(
                            item.price


                        )


                          }</td>
                          <td className="text-center">{



                          `$`+shipCharge||'-'


                          }</td>
                          <td className="text-right">${parseFloat(item.price)*parseFloat(item.quantity)+parseFloat(shipCharge)}</td>



                        </tr>

                      )
                    })}



                    <tr>
                    <td className="no-line" />
                    <td className="no-line text-center"><strong>Total</strong></td>
                      <td className="no-line" />
                      <td className="no-line text-center"><strong>{totalQuantity} PCS</strong></td>
                      <td className="no-line" />
                      <td className="no-line" />
                      <td className="no-line text-right"><strong>${totalAmount}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      </>

    }
    </div>
  )
}
export default Invoice
