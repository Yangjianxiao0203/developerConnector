import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  //{...formData, [e.target.name]: e.target.value} 复制formData的所有属性，然后修改指定属性的值，根据input的name属性来指定修改哪个属性的值
  const onChange = (e) =>{
    setFormData({...formData, [e.target.name]: e.target.value});
    // console.log(e.target.name +" : "+ e.target.value);
  }

  const onSubmit = async (e) =>{
    e.preventDefault();

    console.log("SUCCESS");

  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign in</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign into Your Account
      </p>
      <form className="form" onSubmit={e=>{onSubmit(e)}}>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={e=>{onChange(e)}} required/>
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
        <input type="submit" value="Register" className="btn btn-primary"/>
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/Register">Sign up</Link>
      </p>
    </Fragment>
  );
};

export default Login;
