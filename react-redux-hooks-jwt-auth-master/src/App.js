import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Router, Switch, Route } from "react-router-dom";
import PrimarySearchAppBar from './components/NavBar';
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Home from "./components/Home";

import { logout,refreshToken } from "./actions/auth";
import { clearMessage } from "./actions/message";

import { history } from "./helpers/history";
import LabourDesc from "./components/LabourDesc";

const App = () => {

  const { user: currentUser } = useSelector((state) => state.auth);
  const { isLoggedIn } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if(currentUser){
      if(!isLoggedIn) dispatch(refreshToken());    
      history.listen(() => {
        dispatch(clearMessage()); // clear message when changing location
      });
      const interval = setInterval(() => {
        if(currentUser){dispatch(refreshToken())};
      }, 300000);
      return () => clearInterval(interval);
    }      
  }, [dispatch,currentUser]);

  const logOut = () => {
    dispatch(logout());
  };

  return (
    <Router history={history}>
      <div>
        <PrimarySearchAppBar />
        
        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/login"]} component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/labour_desc" component={LabourDesc} />
            <Route path="/home" component={Home} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
