import React from "react";
import Client from "../../api/classes/client/Client";
import { check } from "meteor/check";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    // Client.setWatcher(this, "user");
    this.state = {
      username: "",
      password: "",
    };
  }

  handleLogin = (e) => {
    e.preventDefault();

    const { email, password } = this.state;

    try {
      check(email, String);
      check(password, String);

      // Call the Meteor method to log in the user
      Client.login(email, password, (error) => {
        if (error) {
          console.log(error.reason);
          alert(error.reason);
        }
      });
    } catch (error) {
      console.log(error);
      alert("Invalid Input");
    }
  };

  render() {
    // Client.initiateWatch("user");
    const { email, password } = this.state;

    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card mt-5">
              <div className="card-header">
                <h3 className="text-center">Login</h3>
              </div>
              <div className="card-body">
                <form onSubmit={this.handleLogin}>
                  <div className="form-group m-2">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => this.setState({ email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group m-2">
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) =>
                        this.setState({ password: e.target.value })
                      }
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-block m-2"
                  >
                    Login
                  </button>
                </form>
                <div className="text-center mt-3">
                  <a href="/register">Sign-up here</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
