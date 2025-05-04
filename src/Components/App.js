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
import RefineResume from './Applicant/RefineResume';
import CompanyDashboard from './Company/CompanyDashboard';
import JobPostForm from './Company/JobPostForm';
import ManageJobs from './Company/ManageJobs';  // ← NEW

import jwt_decode from "jwt-decode";
import setAuthToken from "../utils/setAuthToken";
import { setCurrentUser, logoutUser } from "../actions/authActions";
import PrivateRoute from "../Components/private-route/PrivateRoute";

import { Provider } from "react-redux";
import store from "../store";

// Applicant token setup...
if (localStorage.jwtToken) {
  const token = localStorage.jwtToken;
  setAuthToken(token);
  const decoded = jwt_decode(token);
  store.dispatch(setCurrentUser(decoded));
  if (decoded.exp < Date.now() / 1000) {
    store.dispatch(logoutUser());
    window.location.href = "/";
  }
}

// Company token setup (optional)
if (localStorage.companyToken) {
  setAuthToken(localStorage.companyToken);
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/" component={Home} exact />
          <PrivateRoute path="/Dashboard" component={Dashboard} exact />
          <PrivateRoute path="/profile" component={Profile} exact />
          <PrivateRoute path="/resume" component={Resume} exact />
          <PrivateRoute path="/applied" component={Applied} exact />
          <PrivateRoute path="/buildResume" component={BuildResume} exact />
          <PrivateRoute path="/interview-prep" component={InterviewPrep} exact />
          <PrivateRoute path="/RefineResume" component={RefineResume} exact />

          <Route path="/company-dashboard" component={CompanyDashboard} exact />
          <Route path="/post-job" component={JobPostForm} exact />
          <Route path="/company-jobs" component={ManageJobs} exact />  {/* ← NEW */}
          <Route path="/dummy" component={Dummy} exact />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
