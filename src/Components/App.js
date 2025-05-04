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
import ManageJobs from './Company/ManageJobs';

import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';
import { setCurrentUser, logoutUser } from '../actions/authActions';
import PrivateRoute from '../Components/private-route/PrivateRoute';
import { Provider } from 'react-redux';
import store from '../store';

// Applicant token setup
if (localStorage.jwtToken) {
  const token = localStorage.jwtToken;
  setAuthToken(token);
  const decoded = jwt_decode(token);
  store.dispatch(setCurrentUser(decoded));
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = '/';
  }
}

// Company token setup (optional)
if (localStorage.companyToken) {
  const token = localStorage.companyToken;
  setAuthToken(token);
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <PrivateRoute exact path="/Dashboard" component={Dashboard} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute exact path="/resume" component={Resume} />
          <PrivateRoute exact path="/applied" component={Applied} />
          <PrivateRoute exact path="/buildResume" component={BuildResume} />
          <PrivateRoute exact path="/interview-prep" component={InterviewPrep} />
          <PrivateRoute exact path="/RefineResume" component={RefineResume} />
          <Route exact path="/company-dashboard" component={CompanyDashboard} />
          <Route exact path="/post-job" component={JobPostForm} />
          <Route exact path="/company-jobs" component={ManageJobs} />
          <Route exact path="/dummy" component={Dummy} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
