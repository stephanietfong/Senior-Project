import React from "react";
import { Link } from "react-router-dom";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#e8f0e8] p-6 text-black">
      <h1
        className="mb-6 text-center text-6xl font-bold md:text-7xl"
        style={{ fontFamily: "Ropest", fontWeight: 400 }}
      >
        LocalLoop
      </h1>
      <p className="mb-8 text-center text-xl" style={{ fontFamily: "RopestBlack", fontWeight: 400 }}>
        Keep me in the LocalLoop!
      </p>
      <div className="mb-12 flex justify-center gap-20">
        <Link to="/login" className="inline-block">
          <button
            type="button"
            className="rounded-md bg-[#9CADD8] px-4 py-2 font-semibold text-white hover:bg-[#7797E8]"
          >
            Login
          </button>
        </Link>
        <Link to="/signup" className="inline-block">
          <button
            type="button"
            className="rounded-md bg-[#BAC67A] px-4 py-2 font-semibold text-white hover:bg-[#B4C750]"
          >
            Sign Up
          </button>
        </Link>
      </div>

      <section className="mx-auto mt-8 max-w-6xl text-center">
        <h2
          className="mb-8 text-2xl font-bold"
          style={{ fontFamily: "RopestBlack", fontWeight: 400 }}
        >
          How It Works
        </h2>
        <div className="mx-auto max-w-3xl rounded-lg border border-gray-400 p-6 text-left">
          <p className="mb-4">
            <span className="font-semibold">Drop In:</span> Set your location
            and interests.
          </p>
          <p className="mb-4">
            <span className="font-semibold">Find Your Loop:</span> Browse
            local happenings or start your own.
          </p>
          <p>
            <span className="font-semibold">Show Up:</span> Turn digital
            connections into real-world community.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-6xl text-center">
        <h2
          className="mb-8 text-2xl font-bold"
          style={{ fontFamily: "RopestBlack", fontWeight: 400 }}
        >
          Our Mission
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-gray-400 p-6">
            <h3 className="mb-3 text-xl font-semibold">Discover</h3>
            <p>
              Find the hidden gems in your neighborhood that aren't on the
              big, bloated social apps.
            </p>
          </div>

          <div className="rounded-lg border border-gray-400 p-6">
            <h3 className="mb-3 text-xl font-semibold">Connect</h3>
            <p>
              Meet people who actually live near you and share your niche
              interests.
            </p>
          </div>

          <div className="rounded-lg border border-gray-400 p-6">
            <h3 className="mb-3 text-xl font-semibold">Create</h3>
            <p>
              Host your own meetups, book clubs, or pick-up games with zero
              friction.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
