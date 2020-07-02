
import Dashboard from "./views/Dashboard.jsx";
import AddOnProduct from "./views/AddProduct.jsx"
import ProductList from "./views/ProductList.jsx"
import CsvProduct from "./views/CsvProduct.jsx"
import ShopifyProduct from "./views/ShopifyProduct.jsx"
import ProductLayout from "./layouts/Products.jsx";
import Orders from "./views/Orders.jsx"
import FulfilledOrders from "./views/FulfilledOrders.jsx"
import MerchantProfileSetting from "./views/MerchantProfileSetting.jsx"
import MerchantDashboard from "./views/MerchantDashboard.jsx"
import RequestProduct from './views/RequestProduct.jsx'
import MerchantSupport from './views/MerchantSupport.jsx'


const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: MerchantDashboard,
    layout: "/merchant"
  },
  {
    path: "/collection",
    name: "Products Collection",
    icon: "pe-7s-bell",
    component: ProductLayout,
    layout: "/merchant"
  },
  {
    path: "/shopifyproduct",
    name: "Shopify Products",
    icon: "pe-7s-bell",
    component: ShopifyProduct,
    layout: "/merchant"
  },{
    path: "/orders",
    name: "orders",
    icon: "pe-7s-bell",
    component: Orders,
    layout: "/merchant"
  },
  {
    path: "/request-product",
    name: "Product Request Form",
    icon: "pe-7s-bell",
    component: RequestProduct,
    layout: "/merchant"
  },
  {
    path: "/profile-setting",
    name: "Account Details",
    icon: "pe-7s-bell",
    component: MerchantProfileSetting,
    layout: "/merchant"
  },
  {
    path: "/support",
    name: "Support",
    icon: "pe-7s-bell",
    component: MerchantSupport,
    layout: "/merchant"
  }
];
export default dashboardRoutes;
