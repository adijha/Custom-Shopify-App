import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import ALogin from './components/AdminLogin'
import SLogin from './components/SupplierLogin'
import MLogin from './components/MerchantLogin'
import Auth from './components/Auth'
import AdminLayout from "./layouts/Admin.jsx";
import SupplierLayout from "./layouts/Supplier.jsx";
import ProductLayout from "./layouts/Products.jsx";
import LandingLayout from "./layouts/Landing.jsx";
import MerchantLayout from "./layouts/Merchant.jsx";



function App() {
  return (
    <BrowserRouter>
    <div className="App">
        <Switch>
          <Route exact path="/" component={LandingLayout}/>
          <Route exact path="/login-admin" component={ALogin}/>
          <Route exact path="/login-supplier" component={SLogin}/>
          <Route exact path="/login-merchant" component={MLogin}/>
          <Route path="/admin" render={props => <AdminLayout {...props} />} />
          <Route path='/auth' component={Auth}/>
          <Route path='/supplier' render={props => <SupplierLayout {...props} />}/>
          <Route path='/merchant' render={props => <MerchantLayout {...props} />}/>

        </Switch>
    </div>
    </BrowserRouter>
  );
}

export default App;
