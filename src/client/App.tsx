import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { LandingPage } from "./routes/Landing";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
