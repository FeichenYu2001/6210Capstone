import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import Hero from './Hero';
import SideNav from './SideNav';
import Footer from '../Home/Footer';
import CircularProgress from './CircularProgress';

import { IoIosArrowBack } from 'react-icons/io';
import { logoutUser } from "../../actions/authActions";
import '../Styles/Applicant/Profile.css';

function InterviewPrep(props) {
	const { user } = props.auth;
	const [completeness, setCompleteness] = useState(0);
	const [selectedSection, setSelectedSection] = useState(null);

	const backendBaseURL = `${window.location.protocol}//${window.location.hostname}:1234`;

	const sections = [
		{ title: "General Qs", src: `${backendBaseURL}/interview-prep/General_Qs.html` },
		{ title: "Machine Learning Qs", src: `${backendBaseURL}/interview-prep/Machine_Learning_Qs.html` },
		{ title: "Deep Learning Qs", src: `${backendBaseURL}/interview-prep/Deep_Learning_Qs.html` },
		{ title: "Behavioral Qs", src: `${backendBaseURL}/interview-prep/Behavioral_Qs.html` },
		{ title: "Tech Qs", src: `${backendBaseURL}/interview-prep/Tech_Qs.html` },
		{ title: "A to Z Python Cheatsheet", src: `${backendBaseURL}/interview-prep/A_to_Z_Python_Cheatsheet.html` }
	];

	const onLogoutClick = e => {
		e.preventDefault();
		props.logoutUser();
	};

	useEffect(() => {
		axios.get(`${backendBaseURL}/Applicant/${user.aid}`)
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
				checkAndCount(data.address?.city);
				checkAndCount(data.address?.state);
				checkAndCount(data.socialMedia?.linkedin);

				const percentage = totalFields > 0 ? Math.round((filled / totalFields) * 100) : 0;
				setCompleteness(percentage);
			})
			.catch(err => {
				console.error("Error fetching applicant data:", err);
			});

		setSelectedSection(sections[0].src);
	}, [user.aid]);

	return (
		<div className="Profile">
			<Hero logout={onLogoutClick} user={user} />

			<div className="row mx-0 mt-5 pb-5">
				{/* Sidebar */}
				<div className="col-lg-3" style={{ borderRight: "1px solid #eee" }}>
					<div style={{ marginTop: "20px", marginLeft: "20px" }}>
						<button
							className="goback"
							onClick={() => props.history.push("/Dashboard")}
							style={{
								border: "1px solid #e9896a",
								borderRadius: "12px",
								padding: "6px 14px",
								background: "none",
								color: "#e9896a",
								fontWeight: "500",
								display: "flex",
								alignItems: "center"
							}}
						>
							<IoIosArrowBack size={18} style={{ marginRight: "6px" }} />
							Dashboard
						</button>
					</div>

					<SideNav logout={onLogoutClick} />
					<CircularProgress completeness={completeness} />
				</div>

				{/* Main Content */}
				<div className="col-lg-9">
					<div className="DashboardHeading mb-3">
						<h3>Interview Preparation</h3>
					</div>

					<div className="interview-buttons mb-4">
						{sections.map((section, index) => (
							<button
								key={index}
								className={`btn btn-outline-primary m-1 ${selectedSection === section.src ? 'active' : ''}`}
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
							style={{ border: "1px solid #ccc", borderRadius: "8px" }}
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
