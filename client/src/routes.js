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
import AdminOrderDetails from './views/AdminOrderDetails'



const dashboardRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'pe-7s-graph',
    component: CopyDashboard,
    layout: '/admin',
  },
  {
    path: '/supplier',
    name: 'Supplier Details',
    icon: 'pe-7s-user',
    component: SupplierList,
    layout: '/admin',
  },
  {
    path: '/addSupplier',
    name: 'Add Supplier',
    icon: 'pe-7s-bell',
    component: Supplier,
    layout: '/admin',
  },

  {
    path: '/product',
    name: 'Product List',
    icon: 'pe-7s-bell',
    component: AdminProduct,
    layout: '/admin',
  },

  {
    path: '/AddCategory',
    name: 'Product Category',
    icon: 'pe-7s-bell',
    component: Category,
    layout: '/admin',
  },

  {
    path: '/AutoMargin',
    name: 'Product Auto Margins',
    icon: 'pe-7s-bell',
    component: AutoMargin,
    layout: '/admin',
  },

  {
    path: '/merchant-detail',
    name: 'Merchant Accounts',
    icon: 'pe-7s-user',
    component: MerchantDetail,
    layout: '/admin',
  },
  {
    path: '/profile',
    name: 'Profile Setting',
    icon: 'pe-7s-user',
    component: AdminProfile,
    layout: '/admin',
  },
  {
    path: '/orders',
    name: 'Order Details',
    icon: 'pe-7s-user',
    component: AdminOrderDetails,
    layout: '/admin',
  },
  {
    path: '/merchant/:id',
    component: MerchantAccountDetail,
    layout: '/admin',
  },
  {
    path: '/single-product/:id',
    component: SingleProductDetail,
    layout: '/admin',
  },
];

export default dashboardRoutes;
