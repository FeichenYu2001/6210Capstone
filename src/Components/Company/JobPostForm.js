import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import Hero from '../Applicant/Hero';
import Footer from '../Home/Footer';

function JobPostForm() {
  const [companyData, setCompanyData] = useState(null);
  const [formData, setFormData] = useState({
    role: '',
    description: '',
    skillSet: '',
    perks: '',
    salary: '',
    deadline: '',
    location: '',
    maxApplications: '',
    positions: '',
    duration: '',
    jobType: '1' // Default: Full-Time
  });

  useEffect(() => {
    const token = localStorage.getItem('companyToken');
    if (token) {
      const decoded = jwt_decode(token.replace('Bearer ', ''));
      setCompanyData({
        Company_Name: decoded.name || 'N/A',
        Email_Id: decoded.email || 'N/A',
        Location: decoded.location || 'N/A'
      });
    } else {
      setCompanyData(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('companyToken');
    window.location.href = '/';
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      role: formData.role,
      jobDescription: {
        description: formData.description,
        skillSet: formData.skillSet.split(',').map((s) => s.trim()),
        perks: formData.perks
      },
      salary: Number(formData.salary),
      deadline: formData.deadline,
      location: formData.location,
      maxApplications: Number(formData.maxApplications),
      positions: Number(formData.positions),
      duration: Number(formData.duration),
      jobType: Number(formData.jobType),
      active: true,
      name: companyData?.Company_Name || '',
      email: companyData?.Email_Id || '',
      image: 'astronaut.png'
    };

    try {
      await axios.post('http://localhost:1234/job/create', postData);
      alert('✅ Job posted successfully!');
      setFormData({
        role: '',
        description: '',
        skillSet: '',
        perks: '',
        salary: '',
        deadline: '',
        location: '',
        maxApplications: '',
        positions: '',
        duration: '',
        jobType: '1'
      });
    } catch (err) {
      console.error('❌ Job post failed:', err.response?.data || err.message);
      alert('❌ Job post failed: ' + (err.response?.data?.error || err.message));
    }
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
            <h4>Post a New Job</h4>
            <form onSubmit={handleSubmit}>
              {/* Role */}
              <div className="form-group mb-3">
                <label>Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Description */}
              <div className="form-group mb-3">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                  rows={4}
                  required
                />
              </div>

              {/* Skill Set */}
              <div className="form-group mb-3">
                <label>Skill Set (comma separated)</label>
                <input
                  type="text"
                  name="skillSet"
                  value={formData.skillSet}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Perks */}
              <div className="form-group mb-3">
                <label>Perks (Optional)</label>
                <input
                  type="text"
                  name="perks"
                  value={formData.perks}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              {/* Salary */}
              <div className="form-group mb-3">
                <label>Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Deadline */}
              <div className="form-group mb-3">
                <label>Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Job Location */}
              <div className="form-group mb-3">
                <label>Job Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Max Applications */}
              <div className="form-group mb-3">
                <label>Max Applications</label>
                <input
                  type="number"
                  name="maxApplications"
                  value={formData.maxApplications}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Positions */}
              <div className="form-group mb-3">
                <label>Positions Available</label>
                <input
                  type="number"
                  name="positions"
                  value={formData.positions}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Duration */}
              <div className="form-group mb-3">
                <label>Duration (months)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Job Type */}
              <div className="form-group mb-4">
                <label>Job Type</label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="1">Full-Time</option>
                  <option value="0">Internship</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Post Job
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default JobPostForm;
