import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function CompanyRegister() {
  const [formData, setFormData] = useState({
    Company_Name: '',
    Domain: '',
    About_Us: '',
    Location: '',
    Contact: '',
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
      const res = await axios.post('http://localhost:1234/company/register', formData);
      localStorage.setItem("companyToken", res.data.token);
      alert("✅ Registered!");
      history.push("/company-dashboard");
    } catch (err) {
      alert("❌ Registration failed: " + (err.response?.data?.Email_Id || "Check fields"));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* your input fields, buttons */}
    </form>
  );
}

export default CompanyRegister;
