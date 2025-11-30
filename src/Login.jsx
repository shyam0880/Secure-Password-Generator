import React, { useState } from "react";
import { usePassword } from "./PasswordContext";

const Login = ({ popup, setpopup }) => {
  const {
    activeUser,
    signUp,
    login,
    logout,
    deleteAccount,
  } = usePassword();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    if (isSignUpMode) {
      signUp(username, password);
    } else {
      login(username, password);
    }

    setUsername("");
    setPassword("");
  };

  const handleDelete = () => {
    if (!activeUser) {
      alert("You must be logged in to delete your account.");
      return;
    }
    deleteAccount(activeUser);
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        {/* IF USER IS LOGGED IN */}
        {activeUser ? (
          <div className="log_sec">
            <h1>Welcome, {activeUser} 👋</h1>
            <div className="botton_list">
              <button
                type="button"
                onClick={logout}
                style={{ margin: "10px", background:'#fff' }}
              >
                Logout
              </button>
              <button
                type="button"
                onClick={handleDelete}
                style={{ backgroundColor: "red", color: "white" }}
              >
                Delete My Account
              </button>
            </div>
          </div>
        ) : (
          <div className="log_sec">
            {/* LOGIN / SIGNUP FORM */}
            <h1>{isSignUpMode ? "Sign Up" : "Login"}</h1>

            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>

            <button type="submit" className="sign">
              {isSignUpMode ? "Sign Up" : "Sign In"}
            </button>

            <p className="signup">
              {isSignUpMode
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsSignUpMode(!isSignUpMode);
                }}
              >
                {isSignUpMode ? "Sign in" : "Sign up"}
              </a>
            </p>
          </div>
        )}

        <span
          onClick={() => setpopup(!popup)}
          style={{
            cursor: "pointer",
            display: "block",
            marginTop: "15px",
          }}
        >
          Close
        </span>
      </form>
    </div>
  );
};

export default Login;
