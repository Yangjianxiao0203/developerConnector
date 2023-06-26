import axios from "axios";
//add global header
//在 loadUser 函数内部，它首先检查本地存储中是否存在用户的访问令牌（token）。
//如果存在，则调用 setAuthToken 函数将令牌设置到全局的请求头中，以便后续的 API 请求可以携带该令牌进行身份验证。
export const setAuthToken = (token) => {
  // check if token in local storage
  if (token) {
    // if exist set global header
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
