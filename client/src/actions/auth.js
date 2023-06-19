import axios from 'axios';
import { REGISTER_FAIL,REGISTER_SUCCESS,USER_LOADED,AUTH_ERROR,LOGIN_SUCCESS,LOGIN_FAIL,LOGOUT } from './types';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';

//loadUser 用于在应用程序加载时自动获取用户数据，并将用户数据存储到 Redux 状态中。
//这样，在整个应用程序中，你可以通过访问 Redux 状态来获取和使用用户信息。

export const loadUser = () => async dispatch =>{
    //在 loadUser 函数内部，它首先检查本地存储中是否存在用户的访问令牌（token）。
    //如果存在，则调用 setAuthToken 函数将令牌设置到全局的请求头中，以便后续的 API 请求可以携带该令牌进行身份验证。
    if(localStorage.token) {
        setAuthToken(localStorage.token);
    }

    try {
        const res = await axios.get("/api/auth"); // 用token拿到user collection data,放到Redux state中
        dispatch({
            type:USER_LOADED,
            payload:res.data
        })
    } catch (err) {
        dispatch({
            type:AUTH_ERROR
        })
    }
}

//Register User
export const register = ({name, email, password}) => async dispatch =>{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const body = JSON.stringify({name, email, password}); // convert js object to json string

    try {
        const res= await axios.post("/api/users", body, config);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data //token returned from backend
        })
        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors; // array of errors, from backend
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg,"danger")));
        }
        dispatch({
            type: REGISTER_FAIL
        }) 
    }
}


//Login User
export const login = ({ email, password}) => async dispatch =>{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const body = JSON.stringify({email, password}); // convert js object to json string

    try {
        const res= await axios.post("/api/auth", body, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data //token returned from backend
        })
        dispatch(loadUser());

    } catch (err) {
        const errors = err.response.data.errors; // array of errors, from backend
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg,"danger")));
        }
        dispatch({
            type: LOGIN_FAIL
        }) 
    }
}

//Logout / Clear Profile
export const logout = () => dispatch =>{
    dispatch({type:LOGOUT});
    
}