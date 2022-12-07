import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { UserStatus } from "./types";

import LoginPage from "./pages/LoginPage";
import GuessingPage from "./pages/GuessingPage";
import { UserContext } from "./UserContext";

function Index() {
  const [userState, setUserState] = useState<UserStatus>(UserStatus.LOADING);
  const basename = document.querySelector("base")?.getAttribute("href") ?? "/";

  const userStateRef = useRef(userState);

  function setUserStateAndRef(newState: UserStatus) {
    userStateRef.current = newState;
    setUserState(newState);
  }

  function onLogoutClick() {
    localStorage.removeItem("token");
    setUserStateAndRef(UserStatus.UNAUTHENTICATED);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const tokenPayload: { exp: number; iss: string } = JSON.parse(
        atob(token.split(".")[1])
      );
      if (tokenPayload.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        setUserStateAndRef(UserStatus.UNAUTHENTICATED);
      } else {
        setUserStateAndRef(UserStatus.LOGGEDIN);
      }
    } else {
      setUserStateAndRef(UserStatus.UNAUTHENTICATED);
    }
  }, []);

  return (
    <div className="flex flex-col relative bg-base-200 min-h-screen">
      <div className="navbar bg-primary">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl text-base-100">
            Guessing Game
          </a>
        </div>
        {userState === UserStatus.LOGGEDIN ? (
          <div className="flex-none">
            <button
              className="btn btn-ghost normal-case text-xl text-base-100"
              onClick={onLogoutClick}
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>
      <BrowserRouter basename={basename}>
        <UserContext.Provider value={[userState, setUserStateAndRef]}>
          <Routes>
            <Route path="/" element={<LoginPage />}></Route>
            <Route path="/guessing" element={<GuessingPage />}></Route>
          </Routes>
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<Index />);
