import React,{useState, useEffect} from 'react'
import axios from 'axios';
import { Grid, Row, Col, Table } from "react-bootstrap";
import Card from "../components/Card/Card.jsx";


const Margin = ()=>{

  const [margin, setMargin] = useState('');
  const [msg, setMsg] = useState('');
  const [marginList, setMarginList] = useState([])

  useEffect(()=>{
    getMargin()
  }, [])

//get Category
const getMargin = ()=>{
  axios
  .get('/api/margin')
  .then(data=>{
    console.log("category list is", data.data)
    setMarginList(data.data)
  })
}


//add category
  const addMargin = (e)=>{
    e.preventDefault();
    const obj = {
      margin: margin
    }
      axios
      .post('/api/addMargin', obj)
      .then(response=>{
        console.log("response is", response)
        setMsg("Margin Added Successfully")
        setMargin("")
        getMargin();
      })

  }

  //delete category
  const deleteCategory = (item)=>{
    // axios
    // .delete('/api/category/'+item._id)
    // .then(response=>{
    //   setMsg("category deleted")
    //   getCategory();
    // })
  }

  return(
    <div>
    <div className="container-fluid">
    <br/>
    <div className="text-center" style={{color:"green"}}>{msg}</div>

      <form onSubmit={addMargin}>
        <div className="card card-input" >
          <div className="form-group" style={{position:"relative", display:"flex"}}>
          <input type="number"
                  value={margin}
                  onChange={(e)=>setMargin(e.target.value)}
                  className="form-control"
                  id="product_id"
                  placeholder="Add Margin in % for Product"
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
          title="Margin List"
          category={"Total Margin Status :"+ marginList.length}
          ctTableFullWidth
          ctTableResponsive
          content={
            <Table striped hover >
              <thead >
                <tr>
                  <th>Margin in %</th>
                </tr>
              </thead>
              <tbody>
                {marginList.map((item, key) => {
                  return (
                    <tr key={key}>
                      <td>{item.margin}</td>
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
export default Margin;
