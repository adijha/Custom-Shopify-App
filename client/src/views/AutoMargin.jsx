import React, {useState, useEffect} from 'react';
import axios from 'axios'

const AutoMargin =()=>{
  const [marginList, setMarginList] = useState([])
  const [margin, setMargin] = useState('');
  const [product, setProduct] = useState([])

useEffect(()=>{
  getProducts();
  ProductList()
}, [])

const ProductList = () =>{

  axios.get('/api/product')
  .then(result=>{
    console.log("product List", result.data)
    setProduct(result.data)

  })
}

const getProducts = () =>{
  axios.get('/api/margin')
  .then(data=>{
    setMarginList(data.data)
    console.log(data.data)
  })
}

const updatePrice = (e) =>{
  e.preventDefault()
  console.log(margin)


  product.forEach((item, i) => {
    const newPrice = item.price + item.price*margin/100;
    let obj = {
      price: newPrice,
      margin: margin
    }
    axios.patch('/api/productPrice/'+item._id, obj)
    .then(response=>{
      console.log(response)
    })
  });



}



  return (
    <div>
    <form onSubmit={updatePrice}>
    <div className="text-center" style={{width: "70%"}}>
    <select className="form-control" id="product_category"
     value={margin}
            onChange={(e)=>setMargin(e.target.value)}
             placeholder="select add margin of Product"
>
    {marginList.map((item, i)=>{
      return(
        <option key={i}>{item.margin}</option>

      )
    })}
    </select>
    <div className="text-center" style={{width:"30%"}}>
    <button className="btn btn-primary" >Update Price </button>
    </div>
    </div>
    </form>
    </div>
  )
}

export default AutoMargin;
