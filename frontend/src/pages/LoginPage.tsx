import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import apiClient from "../axios/apiClient";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  //TODO call login API then navigate to guessing page
  async function onLoginSubmit() {
    console.log(username);
    console.log(password);
    navigate("/guessing");
  }

  return (
    <div className="h-screen">
      <div className="flex justify-center items-center w-full h-full">
        <div className="card w-96 bg-primary text-primary-content">
          <div className="card-body space-y-4">
            <h2 className="flex justify-center card-title text-base-100">
              Login
            </h2>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text text-base-100">Username</span>
              </label>
              <input
                type="text"
                placeholder="Please enter your username"
                className="input input-bordered w-full max-w-xs text-black"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text text-base-100">Password</span>
              </label>
              <input
                type="text"
                placeholder="Please enter your password"
                className="input input-bordered w-full max-w-xs text-black"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="card-actions justify-end">
              <button className="btn" onClick={onLoginSubmit}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
