import React, {useState, useEffect} from 'react';
import axios from 'axios'

const AutoMargin =()=>{
  const [marginList, setMarginList] = useState([])

useEffect(()=>{
  getProducts()
}, [])


const getProducts = () =>{
  axios.get('/api/margin')
  .then(data=>{
    setMarginList(data.data)
    console.log(data.data)
  })
}

const updatePrice = () =>{

  axios.patch('/api/addMargin', marginList)
  .then(response=>{
    console.log(response)
  })

}



  return (
    <div className="text-center" style={{width: "70%"}}>
    <select className="form-control" id="product_category"
     value={marginList}
            onChange={(e)=>setMarginList(e.target.value)}
             placeholder="select add margin of Product"
>
    {marginList.map((item, i)=>{
      return(
        <option key={i}>{item.margin}</option>

      )
    })}
    </select>
    <div className="text-center" style={{width:"30%"}}>
    <button className="btn btn-primary" onClick={()=>updatePrice}>Update Price </button>
    </div>
    </div>
  )
}

export default AutoMargin;
