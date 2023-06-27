import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from "./components/layout/Alert";
import Dashboard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/profile-forms/CreateProfile";
import EditProfile from "./components/profile-forms/EditProfile";
import AddExperience from "./components/profile-forms/AddExperience";

import "./App.css";

import PrivateRoute from "./components/routing/PrivateRoute";

import setAuthToken from "./utils/setAuthToken";

//Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";

//npx prettier --write . 格式化代码

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  //会触发一个 loadUser 的 Redux action。当你调用 store.dispatch(action) 时，
  //Redux 会将该 action 传递给 reducer，然后根据 action 的类型来更新相应的状态。
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar></Navbar>
          <div className="container">
            <Alert></Alert>
            <Routes>
              <Route element={<Landing />} path="/"></Route>
              <Route element={<Login />} path="/login"></Route>
              <Route element={<Register />} path="/register"></Route>
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/create-profile"
                element={
                  <PrivateRoute>
                    <CreateProfile />
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/edit-profile"
                element={
                  <PrivateRoute>
                    <EditProfile />
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/add-experience"
                element={
                  <PrivateRoute>
                    <AddExperience />
                  </PrivateRoute>
                }
              ></Route>
            </Routes>
          </div>
        </Fragment>
      </Router>
    </Provider>
  );
};
/*
Routes:
在没有 Switch 的情况下，当一个路径匹配多个 <Route> 组件时，所有匹配的路由组件都会被渲染，而不是只渲染第一个匹配的路由组件。
使用 Switch 组件可以确保只有第一个匹配的路由组件被渲染，一旦匹配到一个符合条件的路由，就会停止继续匹配。这可以防止多个路由同时渲染，避免不必要的性能开销。
*/
export default App;
