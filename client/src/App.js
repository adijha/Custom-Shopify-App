import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import ALogin from './components/AdminLogin'
import SLogin from './components/SupplierLogin'
import Auth from './components/Auth'
import AdminLayout from "./layouts/Admin.jsx";
import SupplierLayout from "./layouts/Supplier.jsx";
import ProductLayout from "./layouts/Products.jsx";
import LandingLayout from "./layouts/Landing.jsx";



function App() {
  return (
    <BrowserRouter>
    <div className="App">
        <Switch>
          <Route exact path="/" component={LandingLayout}/>
          <Route exact path="/login-admin" component={ALogin}/>
          <Route exact path="/login-supplier" component={SLogin}/>
          <Route path="/admin" render={props => <AdminLayout {...props} />} />
          <Route path='/auth' component={Auth}/>
          <Route path='/supplier' render={props => <SupplierLayout {...props} />}/>
        </Switch>
    </div>
    </BrowserRouter>
  );
}

export default App;
