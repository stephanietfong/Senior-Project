import { useState } from "react";
import React from "react";
import { SignUpBox } from "@components/SignUpBox";
import { useNavigate } from "react-router-dom";

export const SignUpPage = () => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
    console.log("Sign up attempted", {
      name,
      dob,
      email,
      password,
      confirmPassword,
    });
  };

  const navigate = useNavigate();
  const handleBack = () => {
    console.log("Back button clicked");
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-customBeige">
      <button
        onClick={handleBack}
        className="bg-customGreen px-4 py-2 rounded absolute top-6 left-6 flex items-center gap-1 text-sm font-medium text-black hover:opacity-60 transition-opacity cursor-pointer"
      >
        ← Back
      </button>
      <SignUpBox>
        <div className="flex flex-col justify-center h-full px-10 py-8">
          {/* Name */}
          <div className="mb-4">
            <label className="block text-black text-base mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First&Last"
              className="w-full rounded px-2 py-1 text-sm outline-none bg-customBeige border-none text-black"
            />
          </div>

          {/* Date of Birth */}
          <div className="mb-4">
            <label className="block text-black text-base mb-1">
              Date of Birth
            </label>
            <input
              type="text"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full rounded px-2 py-1 text-sm outline-none bg-customBeige border-none text-black"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-black text-base mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded px-2 py-1 text-sm outline-none bg-customBeige border-none text-black"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-black text-base mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded px-2 py-1 text-sm outline-none bg-customBeige border-none text-black"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-8">
            <label className="block text-black text-base mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded px-2 py-1 text-sm outline-none bg-customBeige border-none text-black"
            />
          </div>
          {/* Sign Up Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSignUp}
              className="bg-customGreen px-10 py-2 rounded text-base font-medium cursor-pointer hover:opacity-90 transition-opacity text-black"
            >
              Sign Up
            </button>
          </div>
        </div>
      </SignUpBox>
    </div>
  );
};
