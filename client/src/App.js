import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ALogin from './components/AdminLogin'
import SLogin from './components/SupplierLogin'
import MLogin from './components/MerchantLogin'
import Auth from './components/Auth'
import AdminLayout from "./layouts/Admin.jsx";
import SupplierLayout from "./layouts/Supplier.jsx";
import ProductLayout from "./layouts/Products.jsx";
import LandingLayout from "./layouts/Landing.jsx";
import MerchantLayout from "./layouts/Merchant.jsx";
import MerchantSignup from './views/MerchantSignup.jsx';
import ConnectStore from './views/ConnectStore.jsx';
import SupplierForm from './views/SupplierForm.jsx';
import Invoice from "./views/Invoice.jsx";
import SupplierTerms from "./views/SupplierTerms.jsx";


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path="/" component={LandingLayout} />
          <Route exact path="/login-admin" component={ALogin} />
          <Route exact path="/login-supplier" component={SLogin} />
          <Route exact path="/login-merchant" component={MLogin} />
          <Route exact path="/merchantSignup" component={MerchantSignup} />
          <Route exact path="/connect-Store" component={ConnectStore} />
          <Route exact path="/supplier-form" component={SupplierForm} />
          <Route path="/admin" render={props => <AdminLayout {...props} />} />
          <Route path='/auth' component={Auth} />
          <Route path='/supplier' render={props => <SupplierLayout {...props} />} />
          <Route path='/merchant' render={props => <MerchantLayout {...props} />} />
          <Route exact path='/invoice/:supplierId/:orderId' component={Invoice} />
          <Route exact path='/supplier-t&c' component={SupplierTerms} />

        </Switch>
      </div>
        <NotificationContainer />
    </BrowserRouter>
  );
}

export default App;
