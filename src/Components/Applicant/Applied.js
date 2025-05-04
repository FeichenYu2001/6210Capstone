import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import SideNav from './SideNav';
import Footer from '../Home/Footer';
import CircularProgress from './CircularProgress';
import Details from './Details';
import { logoutUser } from "../../actions/authActions";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import '../Styles/Applicant/Profile.css';
import axios from 'axios';

function Applied(props) {
  const { user } = props.auth;
  const [completeness, setCompleteness] = useState(0);

  // build your base URL dynamically
  const backendBaseURL = `${window.location.protocol}//${window.location.hostname}:1234`;

  // compute profile‐completion percentage exactly like InterviewPrep
  useEffect(() => {
    axios
      .get(`${backendBaseURL}/Applicant/${user.aid}`)
      .then(res => {
        const data = res.data;
        let filled = 0;
        let totalFields = 0;

        const checkAndCount = field => {
          totalFields++;
          if (field) filled++;
        };

        // Personal Info
        checkAndCount(data.name);
        checkAndCount(data.email);
        checkAndCount(data.gender);
        checkAndCount(data.phoneno);
        checkAndCount(data.dob);

        // Education & Work
        checkAndCount(data.qualification);
        checkAndCount(data.experience && data.experience !== "--");
        checkAndCount(data.currentJob);
        checkAndCount(data.currentCompany);

        // Address
        checkAndCount(data.address?.city);
        checkAndCount(data.address?.state);

        // Social media
        checkAndCount(data.socialMedia?.linkedin);

        const percentage =
          totalFields > 0 ? Math.round((filled / totalFields) * 100) : 0;
        setCompleteness(percentage);
      })
      .catch(err => {
        console.error("Error fetching applicant data:", err);
      });
  }, [backendBaseURL, user.aid]);

  const onLogoutClick = e => {
    e.preventDefault();
    props.logoutUser();
  };

  return (
    <div className="Applied">
      <Hero logout={onLogoutClick} user={user} />

      <div className="row mx-0 mt-5 pb-5">
        <div className="col-lg-3" style={{ borderRight: "1px solid #eee" }}>
          <button
            className="goback"
            onClick={() => props.history.push("/Dashboard")}
          >
            <IoIosArrowBack className="backicon" size={24} />
            <span>Dashboard</span>
          </button>
          <SideNav logout={onLogoutClick} />
          <CircularProgress completeness={completeness} />
        </div>

        <div className="col-lg-9">
          <div className="DashboardHeading">
            <h3>Applied Jobs</h3>
          </div>
          <div id="appliedjobs">
            <Details aid={user.aid} field={"applied"} edit={true} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(withRouter(Applied));
