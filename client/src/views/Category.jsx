import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Row, Col, Table, Modal as Mod, Button } from "react-bootstrap";
import Card from "../components/Card/Card.jsx";
import Modal from "react-responsive-modal";

import { NotificationManager } from "react-notifications";

const Category = () => {
  const [category, setCategory] = useState("");
  const [msg, setMsg] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [itemId, setItemId] = useState("");
  const [catName, setCatName] = useState("");
  const [analytiicPart, setAnalyticPart] = useState([]);

  useEffect(() => {
    getCategory();
    getAnalytic();
  }, []);

  //get Category
  const getCategory = () => {
    axios.get("/api/totalCategory").then((data) => {
      console.log("category list is", data.data);
      setCategoryList(data.data);
    });
  };

  //get analytic category
  const getAnalytic = () => {
    axios.get("/api/categoryProductDetail").then((data) => {
      setAnalyticPart(data.data);
    });
  };

  //add category
  const addCategory = (e) => {
    e.preventDefault();
    const obj = {
      category: category,
    };
    axios.post("/api/addCategory", obj).then((response) => {
      try {
        if (response.data.includes("success")) {
          NotificationManager.success("Category Added Successfully");
          setCategory("");
          getCategory();
        }
      } catch (error) {
        NotificationManager.error("Something unusual happened");
      }
    });
  };

  const updateProduct = (item) => {
    setOpen(true);
    setItemId(item._id);
    console.log(item._id);
  };

  //delete category
  const deleteCategory = () => {
    axios.delete("/api/categoryDel/" + itemId).then((response) => {
      try {
        if (response.data.includes("success")) {
          NotificationManager.success("Category Deleted Successfully");
          setCategory("");
          getCategory();
          setMsg("category deleted");
          setOpen(false);
          getCategory();
        }
      } catch (error) {
        NotificationManager.error("Something unusual happened");
      }
    });
  };

  const editCategory = (item) => {
    setOpenEdit(true);
    setCatName(item.category);
    setItemId(item._id);
  };

  const changeCatName = () => {
    axios.patch("/api/categoryPatch/" + itemId, { catName }).then((res) => {
      try {
        if (res.data.includes("success")) {
          NotificationManager.success("Category Updated Successfully");
          setOpenEdit(false);
          getCategory();
        }
      } catch (error) {
        NotificationManager.error("Something unusual happened");
      }
    });
  };

  return (
    <div>
      <div className="container-fluid">
        <br />
        <div className="text-center" style={{ color: "green" }}>
          {msg}
        </div>

        <form onSubmit={addCategory}>
          <div className="card card-input">
            <div
              className="form-group"
              style={{ position: "relative", display: "flex" }}
            >
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-control"
                id="product_id"
                placeholder="Add Category for Product"
                required
              />
              <br />
              <div
                className="card-button"
                style={{ width: "15%", margin: "auto", position: "relative" }}
              >
                <button type="submit" className="btn btn-primary">
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
                category={"Total Categories :" + categoryList.length}
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
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
                            <td>{item.created_on || "NA"}</td>
                            <td style={{ width: "20%" }}>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                  editCategory(item);
                                }}
                              >
                                Edit
                              </button>
                            </td>
                            <td style={{ width: "20%" }}>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => updateProduct(item)}
                              >
                                Delete
                              </button>
                            </td>
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

      {/*Analytic Part*/}
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Category Analytics"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Total No. of Products</th>
                        <th>Total No. of Orders</th>
                        <th>Total Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytiicPart.map((item, key) => {
                        return (
                          <tr key={key}>
                            <td>{item.category}</td>
                            <td>{item.count || 0}</td>
                            <td>{item.order || 0}</td>
                            <td>${item.revenue || 0}</td>
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

      <Modal open={open} onClose={() => setOpen(false)}>
        <h4>Are you sure, you want to delete</h4>
        <a
          className="btn btn-danger"
          onClick={() => deleteCategory()}
          style={{ width: "50%" }}
        >
          Yes
        </a>
        <a
          className="btn btn-primary"
          onClick={() => setOpen(false)}
          style={{ width: "50%" }}
        >
          No
        </a>
      </Modal>

      <Modal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        style={{ width: "200px" }}
      >
        <br />
        <h3 style={{ color: "blue" }} className="text-center">
          Edit Category:
        </h3>
        <div className="form-group">
          <label htmlFor="fullName">Category Name</label>
          <input
            type="text"
            name="fullName"
            className="form-control"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
          />
        </div>
        <div>
          <button className="btn btn-info" onClick={(e) => changeCatName()}>
            Update
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Category;
