import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import GuessingPage from "./pages/GuessingPage";

function Index() {
  const basename = document.querySelector("base")?.getAttribute("href") ?? "/";

  //TODO check token
  useEffect(() => {}, []);

  return (
    <div className="flex flex-col relative bg-base-200 min-h-screen">
      <div className="navbar bg-primary">
        <a className="btn btn-ghost normal-case text-xl text-base-100">
          Guessing Game
        </a>
      </div>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<LoginPage />}></Route>
          <Route path="/guessing" element={<GuessingPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<Index />);
