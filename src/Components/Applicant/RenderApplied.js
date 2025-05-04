// /Applicant/RenderApplied.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/Applicant/RenderApplied.css';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { Badge } from 'reactstrap';
import { IoLocationOutline } from 'react-icons/io5';

export default function RenderApplied({ applied }) {
  const [application, setApplication] = useState(null);
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  // Fetch the chain: Application → Job → Company
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: appData } = await axios.get(
          `http://${window.location.hostname}:1234/application/${applied._id}`
        );
        const { data: jobData } = await axios.get(
          `http://${window.location.hostname}:1234/job/${appData.JobID}`
        );
        const { data: compData } = await axios.get(
          `http://${window.location.hostname}:1234/company/${jobData.companyID}`
        );
        setApplication(appData);
        setJob(jobData);
        setCompany(compData);
        setIsLoaded(true);
      } catch (err) {
        console.error('Fetch failed:', err.response || err.message);
      }
    }
    fetchData();
  }, [applied._id]);

  // Delete the application
  const handleDelete = async () => {
    try {
      const resp = await axios.delete(
        `http://${window.location.hostname}:1234/application/${applied._id}`
      );
      console.log('Delete response:', resp.data);
      alert('🗑️ Application Withdrawn Successfully!');
      setIsDeleted(true);
    } catch (err) {
      console.error('Delete failed:', err.response || err.message);
      if (err.response) {
        alert(`❌ Error ${err.response.status}: ${err.response.data.error || err.response.statusText}`);
      } else {
        alert(`❌ Network error: ${err.message}`);
      }
    }
  };

  // Don’t render anything if still loading or already deleted
  if (!isLoaded || isDeleted) return null;

  // Map status to badge
  const statusMap = ['secondary', 'warning', 'success', 'danger'];
  const textMap   = ['Applied', 'Shortlisted', 'Accepted', 'Rejected'];
  const idx = application.aStatus || 0;

  return (
    <tbody>
      <tr>
        <td>
          <ul className="appliedcompany">
            <li>{company.Company_Name}</li>
            <li className="appliedlocation">
              <IoLocationOutline /> {company.Location}
            </li>
          </ul>
        </td>
        <td>{job.role}</td>
        <td>{new Date(application.DoA).toLocaleDateString()}</td>
        <td>
          <Badge color={statusMap[idx]}>
            {textMap[idx]}
          </Badge>
        </td>
        <td>
          <button
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            onClick={handleDelete}
          >
            <RiDeleteBin5Fill size={20} />
          </button>
        </td>
      </tr>
    </tbody>
  );
}
