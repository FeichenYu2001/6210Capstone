// src/components/Company/CompanyLogin.js

import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function CompanyLogin() {
  const [formData, setFormData] = useState({
    Email_Id: '',
    password: ''
  });
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:1234/company/login', {
        email: formData.Email_Id,
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      localStorage.setItem("companyToken", res.data.token);
      alert("✅ Company Login Successful!");
      history.push("/company-dashboard");
    } catch (err) {
      console.error('❌ Login Error:', err.response?.data || err.message);
      if (err.response?.data?.emailNotFound) {
        alert('❌ Company not found!');
      } else if (err.response?.data?.passwordincorrect) {
        alert('❌ Incorrect password!');
      } else {
        alert("❌ Login failed: " + (err.response?.data?.error || err.message));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="Email_Id">Email</label>
        <input 
          type="email" 
          id="Email_Id" 
          className="form-control" 
          value={formData.Email_Id} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input 
          type="password" 
          id="password" 
          className="form-control" 
          value={formData.password} 
          onChange={handleChange} 
          required 
        />
      </div>

      <button type="submit" className="btn btn-primary w-100 mt-3">
        Login
      </button>
    </form>
  );
}

export default CompanyLogin;
