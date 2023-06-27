import axios from "axios";
import { setAlert } from "./alert";

import { CLEAR_PROFILE, DELETE_ACCOUNT, GET_PROFILE, GET_PROFILES, PROFILE_ERROR, UPDATE_PROFILE } from "./types";

//get current users profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/profiles/me");

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Create or update profile
export const createProfile =
  (formData, navigate, edit = false) =>
  async (dispatch) => {
    try {
      const config = {
        header: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post("/api/profiles", formData, config);
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });

      dispatch(
        setAlert(edit ? "Profile Updated" : "Profile Created", "success")
      );

      navigate("/dashboard");
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((err) => {
          dispatch(setAlert(err.msg, "danger"));
        });
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

// add experience
export const addExperience = (formData, navigate) => async (dispatch) => {
  try {
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.put("api/profiles/experience", formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Experience added", "success"));

    navigate("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((err) => {
        dispatch(setAlert(err.msg, "danger"));
      });
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//delete experience
export const deleteExperience = (id) => async(dispatch) => {
  try {
    const res= await axios.delete(`api/profiles/experience/${id}`)

    dispatch({
      type:UPDATE_PROFILE,
      payload:res.data
    })

    dispatch(setAlert('Experience Removed','success'))

  } catch(err) {
    dispatch({
      type:PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })

  }
}

// add education
export const addEducation = (formData, navigate) => async (dispatch) => {
  try {
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.put("api/profiles/education", formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Education added", "success"));

    navigate("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((err) => {
        dispatch(setAlert(err.msg, "danger"));
      });
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//delete education
export const deleteEducation = (id) => async(dispatch) => {
  try {
    const res= await axios.delete(`api/profiles/education/${id}`)

    dispatch({
      type:UPDATE_PROFILE,
      payload:res.data
    })

    dispatch(setAlert('Education Removed','success'))

  } catch(err) {
    dispatch({
      type:PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })

  }
}

//delete account and profile
export const deleteAccount = (navigate) => async(dispatch) => {
  if(!window.confirm("Are you sure to delete?")) {return;}
  try {

    const res=axios.delete("api/profiles");

    dispatch({type:CLEAR_PROFILE})
    dispatch({type:DELETE_ACCOUNT})

    dispatch(setAlert("Your account has been deleted"))

    navigate('/dashboard');

  } catch(err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
}

//get all profiles
const getProfiles = () => async(dispatch) =>{
  try{
    const res=axios.get("/api/profiles")

    dispatch({
      type:GET_PROFILES,
      payload:res.data
    })

  } catch(err) {

  }
}


export default getCurrentProfile;
