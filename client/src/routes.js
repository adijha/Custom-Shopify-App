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
import SupplierList from "./views/SupplierList.jsx";
import Supplier from "./views/Supplier.jsx";
import AdminProduct from "./views/AdminProduct.jsx"
import Category from "./views/Category.jsx"

const dashboardRoutes = [

  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/supplier",
    name: "Supplier Details",
    icon: "pe-7s-user",
    component: SupplierList,
    layout: "/admin"
  },
  {
    path: "/addSupplier",
    name: "Add Supplier",
    icon: "pe-7s-bell",
    component: Supplier,
    layout: "/admin"
  },

  {
    path: "/product",
    name: "Product List",
    icon: "pe-7s-bell",
    component: AdminProduct,
    layout: "/admin"
  },
  {
    path: "/orders",
    name: "orders",
    icon: "pe-7s-bell",
    layout: "/admin"
  },
  {
    path: "/AddCategory",
    name: "Add Category for Product",
    icon: "pe-7s-bell",
    component: Category,
    layout: "/admin"
  }
];

export default dashboardRoutes;
