import React, {useState, useEffect} from 'react';
import axios from 'axios'
import { NotificationManager } from 'react-notifications';

const AutoMargin =()=>{
  const [margin, setMargin] = useState();
  const [categoryList, setCategoryList] = useState([])
  const [category, setCategory] = useState('')

useEffect(()=>{
getCategoryList()
}, [])



const updatePrice = async (e) =>{
  e.preventDefault()
  try{
  const getProCategory = await axios.patch('/api/autoMargin', {margin, category})
  if (getProCategory.data.includes('success')) {
    NotificationManager.success(`${category} category Product selling price updated with ${margin}% Successfully`);
    setMargin()
  }
} catch (error) {
  NotificationManager.error('Something unusual happened');
}


}

const getCategoryList = () =>{
  axios.get('/api/totalCategory')
  .then(data=>{
    setCategoryList(data.data)
  })
}


  return (
    <div className="">
    <div className="" style={{marginTop:"40px", marginBottom:"40px"}}>
    <form onSubmit={updatePrice}>
    <div className="col-md-5">
    <select className="form-control" value={category} onChange={(e)=>setCategory(e.target.value)}>
    <option>Select Category</option>
      {categoryList.map(item=>{
        return(
        <option>{item.category}</option>
      )
      })}
    </select>
      </div>
      <div className="col-md-4">
        <input type="number" min="0" className="form-control"  placeholder="Enter Margin calculated in %" value={margin} onChange={(e)=>setMargin(e.target.value)}/>
      </div>
      <div className="col-md-3">
      <button type="submit" className="btn btn-primary">Update</button>
      </div>
    </form>
    </div>
    </div>
  )
}

export default AutoMargin;
