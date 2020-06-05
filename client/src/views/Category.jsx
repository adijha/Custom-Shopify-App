import React,{useState, useEffect} from 'react'
import axios from 'axios';
import { Grid, Row, Col, Table } from "react-bootstrap";
import Card from "../components/Card/Card.jsx";
import Modal from "react-responsive-modal";
import { NotificationManager } from 'react-notifications';


const Category = ()=>{

  const [category, setCategory] = useState('');
  const [msg, setMsg] = useState('');
  const [categoryList, setCategoryList] = useState([])
  const [open, setOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [itemId, setItemId] = useState("")
  const [catName, setCatName] = useState("")


  useEffect(()=>{
    getCategory()
  }, [])

//get Category
const getCategory = ()=>{
  axios
  .get('/api/totalCategory')
  .then(data=>{
    console.log("category list is", data.data)
    setCategoryList(data.data)
  })
}


//add category
  const addCategory = (e)=>{
    e.preventDefault();
    const obj = {
      category: category
    }
      axios
      .post('/api/addCategory', obj)
      .then(response=>{
        console.log("response is", response)
        setMsg("Category Added Successfully")
        setCategory("")
        getCategory();
      })

  }

  const updateProduct = item =>{
    setOpen(true)
    setItemId(item._id)
    console.log(item._id)
  }

  //delete category
  const deleteCategory = ()=>{
    axios
    .delete('/api/category/'+itemId)
    .then(response=>{
      setMsg("category deleted")
      setOpen(false)
      getCategory();
    })
  }

  const editCategory = (item) =>{
    setOpenEdit(true)
    setCatName(item.category)
    setItemId(item._id)
  }

  const changeCatName = () =>{
    axios.patch('/api/categoryPatch/'+itemId, {catName})
    .then(res=>{
      try{
        if (res.data.includes('success')) {
          NotificationManager.success('updated Successfully');
          setOpenEdit(false)
          getCategory()
        }
      } catch (error) {
        NotificationManager.error('Something unusual happened');
      }
    })
  }

  return(
    <div>
    <div className="container-fluid">
    <br/>
    <div className="text-center" style={{color:"green"}}>{msg}</div>

      <form onSubmit={addCategory}>
        <div className="card card-input" >
          <div className="form-group" style={{position:"relative", display:"flex"}}>
          <input type="text"
                  value={category}
                  onChange={(e)=>setCategory(e.target.value)}
                  className="form-control"
                  id="product_id"
                  placeholder="Add Category for Product"
                  required
          />
          <br/>
          <div className="card-button" style={{width:"15%", margin:"auto", position:"relative"}}>
            <button
            type="submit"
            className="btn btn-primary"
            >
            Add
            </button>
          </div>
          </div>
        </div>

        </form>
        </div>

<div className="content">
  <Grid fluid>
    <Row>
      <Col md={12}>
        <Card
          title="Category List"
          category={"Total Categories :"+ categoryList.length}
          ctTableFullWidth
          ctTableResponsive
          content={
            <Table striped hover >
              <thead >
                <tr>
                  <th>Name</th>
                  <th>Date Created</th>
                </tr>
              </thead>
              <tbody>
                {categoryList.map((item, key) => {
                  return (
                    <tr key={key}>
                      <td>{item.category}</td>
                      <td>{item.created_on || 'NA'}</td>
                      <td style={{width:"20%"}}><button className="btn btn-primary btn-sm"  onClick={()=>editCategory(item)} >Edit</button></td>
                      <td style={{width:"20%"}}><button className="btn btn-danger btn-sm"  onClick={()=>updateProduct(item)} >Delete</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          }
        />
      </Col>
    </Row>
  </Grid>

</div>
<Modal open={open} onClose={()=>setOpen(false)}>
<h4>Are you sure, you want to delete</h4>
<a className="btn btn-danger" onClick={()=>deleteCategory()} style={{width:"50%"}}>Yes</a>
<a className="btn btn-primary" onClick={()=>setOpen(false)} style={{width:"50%"}}>No</a>
</Modal>

<Modal open={openEdit} onClose={()=>setOpenEdit(false)} style={{width:"200px"}}>
<br/>
<h3 style={{color:"blue"}}className="text-center">Edit Category:</h3>
  <div className='form-group'>
    <label htmlFor="fullName">Category Name</label>
    <input type='text' name='fullName' className="form-control" value={catName} onChange={(e)=>setCatName(e.target.value)}/>
  </div>
  <div>
    <button className="btn btn-info" onClick={(e)=>changeCatName()}>Update</button>
  </div>
</Modal>

        </div>

  )
}
export default Category;
