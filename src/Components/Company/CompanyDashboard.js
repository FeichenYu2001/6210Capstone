import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import Hero from '../Applicant/Hero';
import Footer from '../Home/Footer';

function CompanyDashboard() {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const token = localStorage.getItem("companyToken");
  const decoded = token ? jwt_decode(token.replace("Bearer ", "")) : {};
  const cid = decoded.cid;

  useEffect(() => {
    if (!cid) {
      setErrorMsg("Not logged in or invalid token.");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:1234/Company/${cid}`)
      .then((res) => {
        setCompanyData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch company info:", err);
        setErrorMsg("Failed to fetch company info. Please try again later.");
        setLoading(false);
      });
  }, [cid]);

  const handleLogout = () => {
    localStorage.removeItem("companyToken");
    window.location.href = "/";
  };

  return (
    <div>
      {companyData && (
        <Hero
          logout={handleLogout}
          user={{ name: companyData.Company_Name }}
          isCompany={true}
          skipApplicantFetch={true} // ✅ 用于跳过 Drawer 中对 Applicant 的请求
        />
      )}
      <div className="row mx-0 mt-5 pb-5">
        <div className="col-lg-3" style={{ borderRight: "1px solid #eee" }}>
          <div className="sidenav p-3">
            <h5>Company Menu</h5>
            <ul className="list-unstyled">
              <li><a href="/company-dashboard">Dashboard</a></li>
              <li><a href="/post-job">Post a Job</a></li>
              <li><a href="/company-jobs">Manage Jobs</a></li>
              <li><a href="/company-applicants">Applicants</a></li>
              <li><button className="btn btn-link text-danger p-0" onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        </div>
        <div className="col-lg-9">
          <div className="card p-4">
            <h4>Company Information</h4>
            {loading ? (
              <p>Loading...</p>
            ) : errorMsg ? (
              <div className="alert alert-danger">{errorMsg}</div>
            ) : (
              <ul>
                <li><strong>Name:</strong> {companyData.Company_Name}</li>
                <li><strong>Domain:</strong> {companyData.Domain}</li>
                <li><strong>Location:</strong> {companyData.Location}</li>
                <li><strong>Email:</strong> {companyData.Email_Id}</li>
                <li><strong>Contact:</strong> {companyData.Contact}</li>
                <li><strong>About:</strong> {companyData.About_Us}</li>
              </ul>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CompanyDashboard;
