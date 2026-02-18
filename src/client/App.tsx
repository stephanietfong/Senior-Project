import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./routes/Landing";
import { UpcomingEventsPage } from "./routes/UpcomingEvents";
import { EventsPage } from "./routes/Events";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/upcoming" element={<UpcomingEventsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
