import Dashboard from "./views/SupplierDashboard.jsx";
import AddOnProduct from "./views/AddProduct.jsx";
import ProductList from "./views/ProductList.jsx";
import CsvProduct from "./views/CsvProduct.jsx";
import ShopifyProduct from "./views/ShopifyProduct.jsx";
import ProductLayout from "./layouts/Products.jsx";
import Orders from "./views/Orders.jsx";
import FulfilledOrders from "./views/FulfilledOrders.jsx";
import SupplierOrders from "./views/SupplierOrders.jsx";
import Settings from "./views/Settings.jsx";
import SupplierPaymentDetails from "./views/SupplierPaymentDetails.jsx";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/supplier",
  },
  {
    path: "/products",
    name: "Products",
    icon: "pe-7s-shopbag",
    component: ProductList,
    layout: "/supplier",
  },
  {
    path: "/addProduct",
    name: "Add Product",
    icon: "pe-7s-upload",
    component: AddOnProduct,
    layout: "/supplier",
  },
  {
    path: "/CSvProduct",
    name: "Csv Added Product",
    icon: "pe-7s-ticket",
    component: CsvProduct,
    layout: "/supplier",
  },
  {
    path: "/SupplierOrders",
    name: "Orders",
    icon: "pe-7s-bell",
    component: SupplierOrders,
    layout: "/supplier",
  },
  {
    path: "/Settings",
    name: "Settings",
    icon: "pe-7s-config",
    component: Settings,
    layout: "/supplier",
  },
  {
    path: "/PaymentSettings",
    name: "Payment Settings",
    icon: "pe-7s-credit",
    component: SupplierPaymentDetails,
    layout: "/supplier",
  },
];
export default dashboardRoutes;
