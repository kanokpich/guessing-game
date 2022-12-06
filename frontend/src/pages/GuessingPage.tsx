import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import apiClient from "../axios/apiClient";

function GuessingPage() {
  const [number, setNumber] = useState(0);

  const navigate = useNavigate();

  //TODO subscribe to useState to check authorization
  useEffect(() => {});

  //TODO call guess API then reset page
  async function onGuessSubmit() {
    console.log(number);
    navigate(0);
  }

  return (
    <div className="h-screen">
      <div className="flex justify-center items-center w-full h-full">
        <div className="card w-96 bg-primary text-primary-content">
          <div className="card-body space-y-4">
            <h2 className="flex justify-center card-title text-base-100">
              Guess the number
            </h2>
            <input
              type="number"
              placeholder="Enter number here"
              className="input input-bordered input-primary w-full max-w-xs text-black"
              onChange={(e) => {
                setNumber(Number(e.target.value));
              }}
            />
            <div className="card-actions justify-center">
              <button className="btn" onClick={onGuessSubmit}>
                Guess
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuessingPage;
