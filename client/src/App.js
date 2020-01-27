import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Login from './components/Login'
import Auth from './components/Auth'
import AdminLayout from "./layouts/Admin.jsx";
import SupplierLayout from "./layouts/Supplier.jsx";



function App() {
  return (
    <BrowserRouter>
    <div className="App">
        <Switch>
          <Route exact path="/" component={Login}/>
          <Route path="/admin" render={props => <AdminLayout {...props} />} />
          <Route path='/auth' component={Auth}/>
          <Route path='/supplier' render={props => <SupplierLayout {...props} />}/>
        </Switch>
    </div>
    </BrowserRouter>
  );
}

export default App;
