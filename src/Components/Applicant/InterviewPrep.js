import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import SideNav from './SideNav';
import Footer from '../Home/Footer';
import CircularProgress from './CircularProgress';
import { logoutUser } from "../../actions/authActions";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import '../Styles/Applicant/Profile.css';
import axios from 'axios';

function InterviewPrep(props) {
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
                let totalFields = 0;

                const checkAndCount = field => {
                    totalFields++;
                    if (field) filled++;
                };

                checkAndCount(data.name);
                checkAndCount(data.email);
                checkAndCount(data.gender);
                checkAndCount(data.phoneno);
                checkAndCount(data.dob);
                checkAndCount(data.qualification);
                checkAndCount(data.experience && data.experience !== "--");
                checkAndCount(data.currentJob);
                checkAndCount(data.currentCompany);
                checkAndCount(data.address && data.address.city);
                checkAndCount(data.address && data.address.state);
                checkAndCount(data.socialMedia && data.socialMedia.linkedin);

                const percentage = totalFields > 0 ? Math.round((filled / totalFields) * 100) : 0;
                setCompleteness(percentage);
            })
            .catch(err => {
                console.error("Error fetching applicant data:", err);
            });
    }, [user.aid]);

    const sections = [
        { title: "General Qs", src: "http://localhost:1234/interview-prep/General_Qs.html" },
        { title: "Machine Learning Qs", src: "http://localhost:1234/interview-prep/Machine_Learning_Qs.html" },
        { title: "Deep Learning Qs", src: "http://localhost:1234/interview-prep/Deep_Learning_Qs.html" },
        { title: "Behavioral Qs", src: "http://localhost:1234/interview-prep/Behavioral_Qs.html" },
        { title: "Tech - Deep Learning Qs", src: "http://localhost:1234/interview-prep/Tech_Qs.html" },
        { title: "A to Z Python Cheatsheet", src: "http://localhost:1234/interview-prep/A_to_Z_Python_Cheatsheet.html" }
    ];

    const [selectedSection, setSelectedSection] = useState(sections[0].src);

    return (
        <div className="Profile">
            <Hero logout={onLogoutClick} user={user} />
            <div className="row mx-0 mt-5 pb-5">
                <div className="col-lg-3" style={{ borderRight: "1px solid #eee" }}>
                    <button className="goback" onClick={props.history.goBack}>
                        <IoIosArrowBack className="backicon" size={24} />
                        <span>Dashboard</span>
                    </button>
                    <SideNav logout={onLogoutClick} />
                    <CircularProgress completeness={completeness} />
                </div>
                <div className="col-lg-9">
                    <div className="DashboardHeading">
                        <h3>Interview Preparation</h3>
                    </div>
                    <div className="interview-buttons mb-3">
                        {sections.map((section, index) => (
                            <button
                                key={index}
                                className="btn btn-outline-primary m-1"
                                onClick={() => setSelectedSection(section.src)}
                            >
                                {section.title}
                            </button>
                        ))}
                    </div>
                    <div className="interview-iframe">
                        <iframe
                            src={selectedSection}
                            title="Interview Section"
                            width="100%"
                            height="600px"
                        />
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
)(withRouter(InterviewPrep));
