import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import Hero from '../Applicant/Hero';
import Footer from '../Home/Footer';
import CompanySideNav from './SideNav';

function CompanyDashboard() {
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('companyToken');
    if (!token) return setCompanyData(null);

    const decoded = jwt_decode(token.replace('Bearer ', ''));
    setCompanyData({
      Company_Name: decoded.name || 'N/A',
      Email_Id: decoded.email || 'N/A',
      Location: decoded.location || 'N/A',
      Domain: decoded.domain || 'N/A',
      Contact: decoded.contact || 'N/A',
      About_Us: decoded.about_us || 'N/A'
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('companyToken');
    window.location.href = '/';
  };

  return (
    <div>
      {companyData && (
        <Hero
          logout={handleLogout}
          user={{ name: companyData.Company_Name }}
          isCompany
          skipApplicantFetch
        />
      )}
      <div className="row mx-0 mt-5 pb-5">
        <div className="col-lg-3" style={{ borderRight: '1px solid #eee' }}>
          <CompanySideNav logout={handleLogout} />
        </div>

        <div className="col-lg-9">
          <div className="card p-4">
            <h4>Company Information</h4>
            {companyData ? (
              <ul>
                <li><strong>Name:</strong> {companyData.Company_Name}</li>
                <li><strong>Domain:</strong> {companyData.Domain}</li>
                <li><strong>Location:</strong> {companyData.Location}</li>
                <li><strong>Email:</strong> {companyData.Email_Id}</li>
                <li><strong>Contact:</strong> {companyData.Contact}</li>
                <li><strong>About:</strong> {companyData.About_Us}</li>
              </ul>
            ) : (
              <div className="alert alert-danger">Not logged in or invalid token.</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CompanyDashboard;
