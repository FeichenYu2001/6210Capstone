import React, { Component } from 'react';
import {
  Form,
  Input,
  Button,
  Label
} from 'reactstrap';
import { Modal } from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import { AiOutlineMail, AiOutlinePhone, AiOutlineUser } from 'react-icons/ai';
import { IoKeyOutline } from 'react-icons/io5';
import { HiOutlineIdentification } from 'react-icons/hi';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';
import { registerCompany } from '../../actions/companyActions';
import Login from './Login';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      name: '',
      email: '',
      password: '',
      phoneno: '',
      domain: '',
      location: '',
      candidate: true,
      employer: false,
      errors: {},
      login: false,
      signup: true
    };
  }

  loginopen = () => {
    this.setState({ login: true, signup: false });
  };

  loginclose = () => {
    this.setState({ login: false });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    if (this.state.employer) {
      const newCompany = {
        Company_Name: this.state.name,
        Email_Id: this.state.email,
        Contact: this.state.phoneno,
        password: this.state.password,
        Domain: this.state.domain,
        Location: this.state.location
      };
      this.props.registerCompany(newCompany, this.props.history);
    } else {
      const newUser = {
        username: this.state.username,
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        phoneno: this.state.phoneno
      };
      this.props.registerUser(newUser, this.props.history);
    }
    this.props.close();
  };

  control = () => {
    this.setState(prevState => ({
      candidate: !prevState.candidate,
      employer: !prevState.employer
    }));
  };

  render() {
    const { errors } = this.state;
    return (
      <div>
        {this.state.signup && (
          <Modal show={this.props.signup} onHide={this.props.close} backdrop="static" size="xs">
            <Modal.Body>
              <h3 className="modalHeading">Sign Up</h3>
              <Button className={"controlbutton " + (this.state.candidate ? "selected" : "")} onClick={this.control}>Candidate</Button>{' '}
              <Button className={"controlbutton " + (this.state.employer ? "selected" : "")} onClick={this.control}>Employer</Button>
              <Form onSubmit={this.onSubmit} className="pt-4">
                {!this.state.employer && (
                  <div className="cfield">
                    <Input type="text" name="username" id="username" placeholder="Username" onChange={this.onChange} value={this.state.username} required />
                    <AiOutlineUser className="icon" size={24} />
                  </div>
                )}
                <div className="cfield">
                  <Input type="text" name="name" id="name" placeholder="Name / Company Name" onChange={this.onChange} value={this.state.name} required />
                  <HiOutlineIdentification className="icon" size={24} />
                </div>
                <div className="cfield">
                  <Input type="password" name="password" id="password" placeholder="Password" onChange={this.onChange} value={this.state.password} required />
                  <IoKeyOutline className="icon" size={24} />
                </div>
                <div className="cfield">
                  <Input type="email" name="email" id="email" placeholder="Email" onChange={this.onChange} value={this.state.email} required />
                  <AiOutlineMail className="icon" size={24} />
                </div>
                <div className="cfield">
                  <Input type="tel" name="phoneno" id="phoneno" placeholder="Phone no" onChange={this.onChange} value={this.state.phoneno} required />
                  <AiOutlinePhone className="icon" size={24} />
                </div>
                {this.state.employer && (
                  <>
                    <div className="cfield">
                      <Input type="text" name="domain" id="domain" placeholder="Domain" onChange={this.onChange} value={this.state.domain} required />
                    </div>
                    <div className="cfield">
                      <Input type="text" name="location" id="location" placeholder="Location" onChange={this.onChange} value={this.state.location} required />
                    </div>
                  </>
                )}
                <div className="cfield">
                  <Input type="submit" value="Sign Up" className="Submitbutton" />
                </div>
                <div className="cfield mt-3">
                  <Label><a onClick={this.loginopen} className="signin">Sign In</a></Label>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        )}
        {!this.state.signup && <Login open={this.loginopen} close={this.loginclose} login={this.state.login} />}
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  registerCompany: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { registerUser, registerCompany })(withRouter(Register));
