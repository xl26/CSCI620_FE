import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Redirect, Route } from 'react-router';
import { BrowserRouter, Link } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Product from './Product';
import Category from './Category';
import Inventory from './Inventory';
import UserInfo from './UserInfo';
import About from './About';
import './Login.css';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Login} />
            <Route exact path='/register' component={Register} />
            <Route path='/dashboard' component={Dashboard} />
            <Route path='/category' component={Category} />
            <Route path='/product' component={Product} />
            <Route path='/inventory' component={Inventory} />
            <Route path='/user-info' component={UserInfo} />
            <Route path='/about' component={About} />
            {/* <Route component={NotFound}/> */}
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);