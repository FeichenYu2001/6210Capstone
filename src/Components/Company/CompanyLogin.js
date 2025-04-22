import React, { Component } from "react";
import { Form, Input, Button } from "reactstrap";
import { Modal } from "rsuite";
import { IoKeyOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loginCompany } from "../../actions/authActions"; 
import "../../Styles/Applicant/Login.css"; // 根据你的样式路径

class CompanyLogin extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/company/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/company/dashboard");
    }
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const companyData = {
        email: this.state.email,
        password: this.state.password
      };      
      console.log("login data: ", companyData);
    this.props.loginCompany(companyData);
  };

  render() {
    const { errors } = this.state;

    return (
      <Modal show={true} backdrop="static" size="xs">
        <Modal.Header><h5>Company Login</h5></Modal.Header>
        <Modal.Body>
          <Form noValidate onSubmit={this.onSubmit}>
            <div className="cfield">
            <Input
                type="email"
                id="email"
                placeholder="Email"
                onChange={this.onChange}
                value={this.state.email}
                />

              <AiOutlineUser className="icon" size={24} />
            </div>
            <div className="cfield">
              <Input
                type="password"
                id="password"
                placeholder="Password"
                onChange={this.onChange}
                value={this.state.password}
                required
              />
              <IoKeyOutline className="icon" size={24} />
            </div>
            <div className="cfield">
              <Button className="Submitbutton" type="submit">
                Login
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

CompanyLogin.propTypes = {
  loginCompany: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { loginCompany })(withRouter(CompanyLogin));
