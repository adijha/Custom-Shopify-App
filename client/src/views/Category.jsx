import React,{useState, useEffect} from 'react'
import axios from 'axios';
import { Grid, Row, Col, Table } from "react-bootstrap";
import Card from "../components/Card/Card.jsx";


const Category = ()=>{

  const [category, setCategory] = useState('');
  const [msg, setMsg] = useState('');
  const [categoryList, setCategoryList] = useState([])

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

  //delete category
  const deleteCategory = (item)=>{
    axios
    .delete('/api/category/'+item._id)
    .then(response=>{
      setMsg("category deleted")
      getCategory();
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
                </tr>
              </thead>
              <tbody>
                {categoryList.map((item, key) => {
                  return (
                    <tr key={key}>
                      <td>{item.category}</td>
                      <td style={{width:"20%"}}><button className="btn btn-danger btn-sm" onClick={()=>deleteCategory(item)}>Delete</button></td>
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

        </div>

  )
}
export default Category;
