import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from "./components/layout/Alert";
import "./App.css";

//Redux
import { Provider } from "react-redux";
import store from "./store";


//npx prettier --write . 格式化代码

const App = () => {
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
