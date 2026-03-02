import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./routes/Landing";
import { UpcomingEventsPage } from "./routes/UpcomingEvents";
import { EventsPage } from "./routes/Events";
import { CoordinatorViewPage } from "./routes/CoordinatorView";
import { LoginPage } from "./routes/login";
import { SignUpPage } from "./routes/signup";
import { VerificationPage } from "./routes/verification";
import { FAQPage } from "./routes/FAQ";
import { CreateEventPage } from "./routes/CreateEvent";
import { ContactUsPage } from "./routes/ContactUs";
import { Footer } from "./components/Footer";
import { SectionHeaderLayout } from "./components/SectionHeaderLayout";
import { SettingsPage } from "./routes/Settings";
import { MyEventsPage } from "./routes/MyEvents";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route element={<SectionHeaderLayout />}>
              <Route path="/create-event" element={<CreateEventPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/upcoming" element={<UpcomingEventsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/my-events" element={<MyEventsPage />} />
            </Route>
            <Route path="/coordinator" element={<CoordinatorViewPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/verification" element={<VerificationPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactUsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
