import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./routes/Landing";
import { UpcomingEventsPage } from "./routes/UpcomingEvents";
import { EventsPage } from "./routes/Events";
import { LoginPage } from "./routes/login";
import { SignUpPage } from "./routes/signup";
import { VerificationPage } from "./routes/verification";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/upcoming" element={<UpcomingEventsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verification" element={<VerificationPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
