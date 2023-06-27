import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteAccount, getCurrentProfile } from "../../actions/profile";
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";
import DashboardActions from "./DashboardActions";
import Experience from "./Experience";
import Education from "./Education";
import { withRouter } from "../hoc/withRouter";

const Dashboard = ({
  auth: { user },
  getCurrentProfile,
  profile: { profile, loading },
  deleteAccount,
  router
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, []);

  const dashBoard = (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i>
        Welcome {user && user.name}
      </p>
      {profile != null ? (
        <Fragment>
          <DashboardActions />
          <Experience />
          <Education />
          <div className="my-2">
            <button className="btn btn danger" onClick={()=>{
              deleteAccount(router.navigate)
            }}>
              <i className="fas fa-user-minus"></i>
              Delete My Account
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>you have not yet setup a profile, please add some info</p>
          <Link to={"/create-profile"} className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );

  return loading && profile === null ? <Spinner /> : dashBoard;
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount:PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile,deleteAccount })(withRouter(Dashboard));
