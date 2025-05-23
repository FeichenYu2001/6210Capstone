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

function Profile(props) {
    const { user } = props.auth;
    const [completeness, setCompleteness] = useState(0);

    const onLogoutClick = e => {
        e.preventDefault();
        props.logoutUser();
    };

    useEffect(() => {
        axios.get(`http://localhost:1234/Applicant/${user.aid}`)
            .then(res => {
                const data = res.data;
                let filled = 0;
                const totalFields = 12; // Total number of fields used to calculate completeness
                
                // Basic Info
                if (data.name) filled++;
                if (data.email) filled++;
                if (data.gender) filled++;
                if (data.phoneno) filled++;
                if (data.dob) filled++;
                
                // Education & Work
                if (data.qualification) filled++;
                if (data.experience && data.experience !== "--") filled++;
                if (data.currentJob) filled++;
                if (data.currentCompany) filled++;
                
                // Address info
                if (data.address && data.address.city) filled++;
                if (data.address && data.address.state) filled++;
                
                // Social media
                if (data.socialMedia && data.socialMedia.linkedin) filled++;
                
                // Calculate percentage
                const percentage = Math.round((filled / totalFields) * 100);
                
                setCompleteness(percentage);
            })
            .catch(err => {
                console.error("Error fetching applicant data:", err);
            });
    }, [user.aid]);

    return (
        <div className="Profile">
            <Hero logout={onLogoutClick} user={user} />
            <div className="row mx-0 mt-5 pb-5">
                <div className="col-lg-3" style={{ borderRight: "1px solid #eee" }}>
                        <button className="goback" onClick={() => props.history.push("/Dashboard")}>
                        <IoIosArrowBack className="backicon" size={24} />
                        <span>Dashboard</span>
                    </button>
                    <SideNav logout={onLogoutClick} />
                    <CircularProgress completeness={completeness} />
                </div>
                <div className="col-lg-9">
                    <div className="DashboardHeading">
                        <h3>My Profile</h3>
                    </div>
                    <div id="personal">
                        <Details aid={user.aid} field={"personal"} />
                    </div>
                    <div id="categories">
                        <Details aid={user.aid} field={"categories"} />
                    </div>
                    <div id="contact">
                        <Details aid={user.aid} field={"contact"} />
                    </div>
                    <div id="social">
                        <Details aid={user.aid} field={"social"} />
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
)(withRouter(Profile));
