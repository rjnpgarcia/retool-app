import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Client from "../api/classes/client/Client";
import { withTracker } from "meteor/react-meteor-data";

import RegistrationPage from "./components/RegistrationPage";
import LoginPage from "./components/LoginPage";
import Main from "./components/Main";
import ResourceWatcher from "../api/classes/client/handlers/ResourceWatcher";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route
            path="/register"
            element={
              this.props.isLogin ? <Navigate to="/" /> : <RegistrationPage />
            }
          />
          <Route
            path="/login"
            element={this.props.isLogin ? <Navigate to="/" /> : <LoginPage />}
          />
          <Route
            path="/"
            element={
              this.props.isLogin ? <Main /> : <Navigate to="/register" />
            }
          />
        </Routes>
      </Router>
    );
  }
}

export default withTracker((props) => {
  const isLogin = Client.User;
  return {
    isLogin,
  };
})(App);
