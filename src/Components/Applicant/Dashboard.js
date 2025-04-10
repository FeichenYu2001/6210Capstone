import React , {Component} from 'react';
import axios from 'axios'; // 加上 axios
import Hero from './Hero';
import SideNav from './SideNav';
import DashboardCards from './DashboardCards';
import Footer from '../Home/Footer';
import CircularProgress from './CircularProgress';
import RecentJobs from '../Home/RecentJobs';

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

class Dashboard extends Component
{   
    state = {
        completeness: 0,
    }

    componentDidMount() {
        const { user } = this.props.auth;
        axios.get(`http://localhost:1234/Applicant/${user.aid}`)
        .then(res => {
            console.log("🎯 Applicant 数据是：", res.data);  // ←←← 加这一行！
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
            
            this.setState({ completeness: percentage });
        })
        .catch(err => {
            console.log("Error fetching applicant data: ", err);
        });
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    render()
    {
        const { user } = this.props.auth;
        const { completeness } = this.state;

        return(
            <div>
                <Hero logout={this.onLogoutClick} user={user}/>
                <div className="row mx-0 mt-5 pb-5">
                    <div className="col-lg-3" style={{borderRight: "1px solid #eee"}}>
                        <SideNav logout={this.onLogoutClick} />
                        <CircularProgress completeness={completeness} />
                    </div>
                    <div className="col-lg-9">
                        <DashboardCards/>
                    </div>
                </div>
                <div id="viewJobs"><RecentJobs auth={true} aid={user.aid}/></div>
                <Footer/>
            </div>
        );
    }
}

Dashboard.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Dashboard);
