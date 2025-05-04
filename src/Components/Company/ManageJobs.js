import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Hero from '../Applicant/Hero';
import Footer from '../Home/Footer';

function ManageJobs() {
  const [companyData, setCompanyData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('companyToken');
    if (token) {
      const decoded = jwt_decode(token.replace('Bearer ', ''));
      const email = decoded.email;
      setCompanyData({
        Company_Name: decoded.name || 'N/A',
        Email_Id: email,
        Location: decoded.location || 'N/A'
      });
      fetchJobs(email);
    } else {
      console.error('❌ No companyToken found.');
      setLoading(false);
    }
  }, []);

  const fetchJobs = async (email) => {
    try {
      const res = await axios.get(
        `http://localhost:1234/job/company?email=${encodeURIComponent(email)}`
      );
      setJobs(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch jobs:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await axios.delete(`http://localhost:1234/job/${jobId}/delete`);
      setJobs(prev => prev.filter(j => j._id !== jobId));
    } catch (err) {
      console.error('❌ Delete job failed:', err.response?.data || err.message);
      alert('Failed to delete job.');
    }
  };

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
          isCompany={true}
          skipApplicantFetch={true}
        />
      )}

      <div className="row mx-0 mt-5 pb-5">
        <div className="col-lg-3" style={{ borderRight: '1px solid #eee' }}>
          <div className="sidenav p-3">
            <h5>Company Menu</h5>
            <ul className="list-unstyled">
              <li><a href="/company-dashboard">Dashboard</a></li>
              <li><a href="/post-job">Post a Job</a></li>
              <li><a href="/company-jobs">Manage Jobs</a></li>

              <li>
                <button className="btn btn-link text-danger p-0" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-lg-9">
          <div className="card p-4">
            <h4>Manage Jobs</h4>

            {loading ? (
              <p>Loading jobs...</p>
            ) : jobs.length > 0 ? (
              jobs.map(job => (
                <div key={job._id} className="mb-4 p-3 border rounded">
                  <h5>{job.role}</h5>
                  <p>{job.jobDescription.description}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
                  <p>
                    <strong>Applicants:</strong>{' '}
                    {Array.isArray(job.applicants) ? job.applicants.length : job.currApplications}
                  </p>
                  <div>
                    <a
                      href={`/company-applicants?jobId=${job._id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      View Applicants
                    </a>
                    <button
                      className="btn btn-outline-danger btn-sm ms-2"
                      onClick={() => handleDelete(job._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No jobs found. <a href="/post-job">Post your first job</a>.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ManageJobs;
