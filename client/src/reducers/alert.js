const { SET_ALERT, REMOVE_ALERT } = require("../actions/types");
const intialState = [];
//对的，state = initialState 的含义是如果 state 是 undefined 或者 null，那么它会被初始化为 initialState，否则保持原来的值。
const Alert = (state = intialState, action) => {
  console.log("action", action);
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload); // payload is id
    default:
      return state;
  }
};
export default Alert;
