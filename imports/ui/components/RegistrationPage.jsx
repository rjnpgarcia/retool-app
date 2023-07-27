import React from "react";
import { Accounts } from "meteor/accounts-base";
import { check } from "meteor/check";
// import Client from "../../api/classes/client/Client";

class RegistrationPage extends React.Component {
  constructor(props) {
    super(props);
    // Client.setWatcher(this, "user");
    this.state = {
      email: "",
      username: "",
      password: "",
    };
  }

  handleRegistration = (e) => {
    e.preventDefault();
    const { email, username, password } = this.state;

    if (username.length < 4 && password.length < 4) {
      alert("Username and Password length should be at least 4 characters");
      return;
    } else if (username.length < 4) {
      alert("Password length should be at least 4 characters");
      return;
    } else if (password.length < 4) {
      alert("Password length should be at least 4 characters");
      return;
    }

    try {
      check(email, String);
      check(username, String);
      check(password, String);

      // Call the Meteor method to create a new user
      Accounts.createUser({ email, username, password }, (error) => {
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
    const { email, username, password } = this.state;

    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card mt-5">
              <div className="card-header">
                <h3 className="text-center">Registration</h3>
              </div>
              <div className="card-body">
                <form onSubmit={this.handleRegistration}>
                  <div className="form-group m-2">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => this.setState({ email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group m-2">
                    <label>Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) =>
                        this.setState({ username: e.target.value })
                      }
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
                    Register
                  </button>
                </form>
                <div className="text-center mt-3">
                  Already registered? <a href="/login">Login here</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RegistrationPage;
