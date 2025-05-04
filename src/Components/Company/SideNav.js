import React from 'react';
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { FaPlus, FaClipboardList, FaUsers } from "react-icons/fa";
import { IoLogOutOutline } from 'react-icons/io5';

import '../Styles/Applicant/SideNav.css'; 

function CompanySideNav(props) {
    return (
        <div className="widget">
            <ul>
                <li>
                    <a href="/company-dashboard">
                        <span className="icons"><MdOutlineDashboardCustomize size={18} /></span>
                        Dashboard
                    </a>
                </li>
                <li>
                    <a href="/post-job">
                        <span className="icons"><FaPlus size={18} /></span>
                        Post Job
                    </a>
                </li>
                <li>
                    <a href="/company-jobs">
                        <span className="icons"><FaClipboardList size={18} /></span>
                        Manage Jobs
                    </a>
                </li>

                <li>
                    <a onClick={props.logout}>
                        <span className="icons"><IoLogOutOutline size={18} /></span>
                        Logout
                    </a>
                </li>
            </ul>
        </div>
    );
}

export default CompanySideNav;
