import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import apiClient from "../axios/apiClient";
import { UserStatus } from "../types";
import { UserContext } from "../UserContext";

function GuessingPage() {
  const [number, setNumber] = useState(0);

  const navigate = useNavigate();

  const [userState, setUserState] = useContext(UserContext);
  useEffect(() => {
    /*
     *  If the users don't have right to access this page, navigate to home page.
     */
    if (userState === UserStatus.UNAUTHENTICATED) {
      navigate("/");
    } else {
      getNumber();
    }
  }, [userState]);

  //TODO call guess API then reset page
  async function onGuessSubmit() {
    const SubmitBody = {
      GuessedNumber: number,
    };
    await apiClient
      .post("http://localhost:8080/guess", SubmitBody)
      .then((response) => {
        if (response.status === 201) {
          alert("Correct answer!");
          navigate(0);
        } else if (response.status === 200) {
          alert("Wrong answer");
        }
      });
  }

  async function getNumber() {
    await apiClient.get("http://localhost:8080/number").then((response) => {
      if (response.status === 200) {
        console.log(response.data.randomNumber);
      }
    });
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
