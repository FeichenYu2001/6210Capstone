import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home/Home';
import Dummy from './Dummy/dummy';
import Dashboard from './Applicant/Dashboard';
import BuildResume from './Applicant/BuildResume';
import Profile from './Applicant/Profile';
import Applied from './Applicant/Applied';
import Resume from './Applicant/Resume';
import InterviewPrep from './Applicant/InterviewPrep';
import CompanyDashboard from './Company/CompanyDashboard'; // ✅ 新增：引入公司 Dashboard

import jwt_decode from "jwt-decode";
import setAuthToken from "../utils/setAuthToken";
import { setCurrentUser, logoutUser } from "../actions/authActions";

import PrivateRoute from "../Components/private-route/PrivateRoute";

import { Provider } from "react-redux";
import store from "../store";

// ✅ Check for applicant token
if (localStorage.jwtToken) {
  const token = localStorage.jwtToken;
  setAuthToken(token);
  const decoded = jwt_decode(token);
  store.dispatch(setCurrentUser(decoded));
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = "/";
  }
}

// ✅ Check for company token (optional, just for consistent auth header)
if (localStorage.companyToken) {
  const token = localStorage.companyToken;
  setAuthToken(token);
  // You can decode companyToken if needed
}

function App() {
  return (
    <div>
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/" component={Home} exact />
            <PrivateRoute path="/Dashboard" component={Dashboard} exact />
            <PrivateRoute path="/profile" component={Profile} exact />
            <PrivateRoute path="/resume" component={Resume} exact />
            <PrivateRoute path="/applied" component={Applied} exact />
            <PrivateRoute path="/buildResume" component={BuildResume} exact />
            <PrivateRoute path="/interview-prep" component={InterviewPrep} />
            <Route path="/company-dashboard" component={CompanyDashboard} exact /> {/* ✅ 新增：公司 Dashboard */}
            <Route path="/dummy" component={Dummy} exact />
          </Switch>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
