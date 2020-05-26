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
import CopyDashboard from "./views/CopyDashboard.jsx";
import SupplierList from "./views/SupplierList.jsx";
import Supplier from "./views/Supplier.jsx";
import AdminProduct from "./views/AdminProduct.jsx"
import Category from "./views/Category.jsx"
import Margin from "./views/Margin.jsx"
import AutoMargin from "./views/AutoMargin.jsx"
import MerchantDetail from "./views/MerchantDetail.jsx"
import MerchantAccountDetail from "./views/MerchantAccountDetail.jsx"
import SingleProductDetail from "./views/SingleProductDetail.jsx"
import AdminProfile from "./views/AdminProfile.jsx"


const dashboardRoutes = [

  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: CopyDashboard,
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
    path: "/AddCategory",
    name: "Product Category",
    icon: "pe-7s-bell",
    component: Category,
    layout: "/admin"
  },


  {
    path: "/AutoMargin",
    name: "Product Auto Margins",
    icon: "pe-7s-bell",
    component: AutoMargin,
    layout: "/admin"
  },


  {
    path: "/merchant-detail",
    name: "Merchant Accounts",
    icon: "pe-7s-user",
    component: MerchantDetail,
    layout: "/admin"
  },
  {
    path: "/profile",
    name: "Profile Setting",
    icon: "pe-7s-user",
    component: AdminProfile,
    layout: "/admin"
  },
    {
      path: "/merchant/:id",
      component: MerchantAccountDetail,
      layout: "/admin"
    },
    {
      path: "/single-product/:id",
      component: SingleProductDetail,
      layout: "/admin"
    },


];

export default dashboardRoutes;
