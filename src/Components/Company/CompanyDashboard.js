import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

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
      .then(res => {
        setCompanyData(res.data);
        setLoading(false);
      })
      .catch(err => {
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
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Company Dashboard</h2>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : errorMsg ? (
        <div className="alert alert-danger">{errorMsg}</div>
      ) : (
        <div className="card p-4">
          <h4>Company Information</h4>
          <ul className="list-unstyled">
            <li><strong>Name:</strong> {companyData.Company_Name}</li>
            <li><strong>Domain:</strong> {companyData.Domain}</li>
            <li><strong>Location:</strong> {companyData.Location}</li>
            <li><strong>Email:</strong> {companyData.Email_Id}</li>
            <li><strong>Contact:</strong> {companyData.Contact}</li>
            <li><strong>About:</strong> {companyData.About_Us}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default CompanyDashboard;
