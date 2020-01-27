/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "./views/Dashboard.jsx";
import AddOnProduct from "./views/AddProduct.jsx"
import ProductList from "./views/ProductList.jsx"


const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/supplier"
  },
  {
    path: "/products",
    name: "Products",
    icon: "pe-7s-bell",
    component: ProductList,
    layout: "/supplier"
  },
  {
    path: "/addProduct",
    name: "Add Product",
    icon: "pe-7s-bell",
    component: AddOnProduct,
    layout: "/supplier"
  }

];
export default dashboardRoutes;
