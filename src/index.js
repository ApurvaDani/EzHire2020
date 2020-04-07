/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import history from "./history"

// core components
import Admin from "layouts/Admin.js";
import AdminCo from "layouts/AdminCo.js"
import RTL from "layouts/RTL.js";
import SignInSide from "SignInSide.js"
import SignUp from "SignUp"
import ChatBot from "views/ChatBot/ChatBot.js"
import "assets/css/material-dashboard-react.css?v=1.8.0";

ReactDOM.render(
  <Router history={history}>
    <Switch>
      <Route path="/signin" component={SignInSide} />
      <Route path="/admin/startinterview" component={ChatBot} />
      <Route path="/admin" component={Admin} />
      <Route path="/adminco" component={AdminCo} />
      <Route path="/signup" component={SignUp} />
      <Redirect from="/" to="/signin" />
    </Switch>
  </Router>,
  document.getElementById("root")
);
