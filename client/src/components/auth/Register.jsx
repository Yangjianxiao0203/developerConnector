import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";
import axios from "axios";
import PropTypes from "prop-types";

const Register = ({setAlert}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;
  //{...formData, [e.target.name]: e.target.value} 复制formData的所有属性，然后修改指定属性的值，根据input的name属性来指定修改哪个属性的值
  const onChange = (e) =>{
    setFormData({...formData, [e.target.name]: e.target.value});
    // console.log(e.target.name +" : "+ e.target.value);
  }

  const onSubmit = async (e) =>{
    e.preventDefault();
    if(password !== password2){
      setAlert("passwords do not match", "danger");
      return;
    } 
    // //axios request http request
    // const newUser = {
    //   name,
    //   email,
    //   password
    // }
    // try {
    //   const config = {
    //     headers: {
    //       "Content-Type": "application/json"
    //     }
    //   }
    //   const body = JSON.stringify(newUser);
    //   const res=await axios.post("/api/users", body, config);
    //   console.log(res.data);
    // } catch(err) {
    //   console.error(err.response.data);
    // }
    console.log("SUCCESS");
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={e=>{onSubmit(e)}}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            required
            value={name}
            onChange={e=>onChange(e)}
          />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={e=>{onChange(e)}} required/>
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={e=>onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
            value={password2}
            onChange={e=>onChange(e)}
          />
        </div>
        <input type="submit" value="Register" className="btn btn-primary"/>
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired
}

export default connect(null, {setAlert})(Register);
