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

function RefineResume(props) {
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
				checkAndCount(data.address?.city);
				checkAndCount(data.address?.state);
				checkAndCount(data.socialMedia?.linkedin);

				const percentage = totalFields > 0 ? Math.round((filled / totalFields) * 100) : 0;
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
						<h3>Resume Refinement</h3>
					</div>

					<div className="interview-iframe">
						<iframe
							src="http://127.0.0.1:5000/resume_refinement"
							title="Resume Refinement"
							width="100%"
							height="700px"
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
)(withRouter(RefineResume));
