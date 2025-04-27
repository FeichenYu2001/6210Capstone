import React, { useEffect, useState } from 'react';
import Jobs from './Jobs';
import JobList from '../Data/Job';
import '../Styles/Home/RecentJobs.css';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import Chip from '@material-ui/core/Chip';
import { Form, Input, Button, FormGroup } from 'reactstrap';
import { Multiselect } from 'multiselect-react-dropdown';

const len = JobList.length;
const limit = 3;

function RecentJobs(props) {
  const [list, setList] = useState(JobList.slice(0, 6));
  const [index, setIndex] = useState(6);
  const [jobs, setJobs] = useState([]);
  const [isLoaded, setLoaded] = useState(false);
  const [jobLen, setJoblen] = useState(0);
  const [showMore, setShowMore] = useState(props.auth ? false : true);
  const [categories, setCategories] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isRen, setIsRen] = useState(true);

  const Categories = ["IT", "Testing", "HR", "Finance", "Management", "UI/UX", "Data Science", "Web Development"];

  const loadMore = () => {
    const newIndex = index + limit;
    let newList = [];

    if (props.auth) {
      newList = list.concat(jobs.slice(index, newIndex));
      setShowMore(newIndex < jobLen);
    } else {
      newList = list.concat(JobList.slice(index, newIndex));
      setShowMore(newIndex < len);
    }

    setIndex(newIndex);
    setList(newList);
  };

  function getJobs() {
    axios.get("http://localhost:1234/job/") // ✅ Correct job API endpoint
      .then((res) => {
        setJobs(res.data);
        setList(res.data.slice(0, 6));
        setJoblen(res.data.length);
        if (res.data.length > 6) setShowMore(true);
        setLoaded(true);
      })
      .catch((err) => {
        console.error('Error loading jobs:', err);
      });
  }

  function handleSelect(selectedList, selectedItem) {
    setCategories(selectedList);
  }

  function handleRemove(selectedList, removedItem) {
    setCategories(selectedList);
  }

  function editCategories() {
    setIsEdit(true);
    if (isRen) {
      setIsRen(false);
    }
  }

  function changeJobs() {
    const filteredJobs = jobs.filter((item) =>
      item.category.some((elem) => categories.includes(elem))
    );

    if (categories.length) {
      setList(filteredJobs.slice(0, 6));
      setJoblen(filteredJobs.length);
      setShowMore(filteredJobs.length > 6);
    } else {
      setList(jobs.slice(0, 6));
      setJoblen(jobs.length);
      setShowMore(jobs.length > 6);
    }

    setIsEdit(false);
  }

  useEffect(() => {
    if (props.auth && !isLoaded) {
      getJobs();
    }
  }, [props.auth, isLoaded]);

  return (
    <div className="RecentJobs">
      <div className="JobHeading pt-5">
        <h1>Recent Jobs</h1>
        <p>Leading Employers already using job and talent.</p>
      </div>

      {/* Filter Section */}
      {props.auth && isLoaded && (
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <Form className="Cat-Form row">
              <FormGroup className="col-lg-12 py-2">
                <Multiselect
                  id="categories"
                  options={Categories}
                  selectedValues={categories}
                  isObject={false}
                  showCheckbox={true}
                  placeholder="No Filters Selected"
                  onSelect={handleSelect}
                  onRemove={handleRemove}
                  disable={!isEdit}
                />
              </FormGroup>
            </Form>
          </div>
          <div className="col-md-3">
            {isEdit ? (
              <button type="submit" className="filter-button mt-2 py-2" onClick={changeJobs}>
                Apply Filters
              </button>
            ) : (
              <h6 className="py-3">
                <button onClick={editCategories}>
                  Edit Filters <FaEdit size={24} style={{ color: '#e9896a' }} />
                </button>
              </h6>
            )}
          </div>
        </div>
      )}

      {/* Job Listing Section */}
      <div className="Container">
        <div className="row">
          {!props.auth && list.map((job, idx) => (
            <div className="col-md-4 px-1" key={idx}>
              <Jobs auth={props.auth} role={job.role} company={job.company} loc={job.loc} src={job.logo} />
            </div>
          ))}
          {isLoaded && (!isEdit || isRen) && list.map((job, idx) => (
            <div className="col-md-4 px-1" key={idx}>
              <Jobs
                auth={props.auth}
                aid={props.aid}
                compid={job.companyID}
                role={job.role}
                jobDesc={job.jobDescription}
                salary={job.salary}
                dur={job.duration}
                pos={job.positions}
                deadline={job.deadline}
                jid={job._id}
              />
            </div>
          ))}
        </div>
        <div className="row">
          {showMore && <button className="More" onClick={loadMore}>Load More Listings</button>}
        </div>
      </div>
    </div>
  );
}

export default RecentJobs;
