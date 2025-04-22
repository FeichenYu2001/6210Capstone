import React, { useState } from 'react';
import axios from 'axios';
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';

function CompanyRegister(props) {
  const [formData, setFormData] = useState({
    Company_Name: '',
    Domain: '',
    About_Us: '',
    Location: '',
    Contact: '',
    Email_Id: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:1234/CompanyRegister", formData);
      setMessage("✅ Company registered successfully!");
      console.log(res.data);
    } catch (err) {
      setMessage("❌ Registration failed: " + (err.response?.data?.Company_Name || "Check all fields"));
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Register New Company</h3>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="Company_Name">Company Name</Label>
          <Input type="text" id="Company_Name" onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <Label for="Domain">Domain</Label>
          <Input type="text" id="Domain" onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <Label for="About_Us">About Us</Label>
          <Input type="textarea" id="About_Us" onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <Label for="Location">Location</Label>
          <Input type="text" id="Location" onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <Label for="Contact">Contact</Label>
          <Input type="text" id="Contact" onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <Label for="Email_Id">Email</Label>
          <Input type="email" id="Email_Id" onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input type="password" id="password" onChange={handleChange} required />
        </FormGroup>
        <Button type="submit" color="primary">Register</Button>
      </Form>
      <p className="mt-3">{message}</p>
    </div>
  );
}

export default CompanyRegister;
