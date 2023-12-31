import { SET_ALERT, REMOVE_ALERT } from "./types";
import { v4 } from "uuid";
export const setAlert =
  (msg, alertType, timeout = 4000) =>
  (dispatch) => {
    const id = v4();
    dispatch({
      type: SET_ALERT,
      payload: { msg, alertType, id },
    });
    // remove alert after 5 seconds
    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
  };
