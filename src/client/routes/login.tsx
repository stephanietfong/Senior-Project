import { useState } from "react";
import React from "react";
import { SignUpBox } from "../components/SignUpBox";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Login attempted", { email, password });
  };

  const navigate = useNavigate();
  const handleBack = () => {
    console.log("Back button clicked");
    navigate(-1);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-customBeige"
    >
      <button
        onClick={handleBack}
        className="bg-customGreen px-4 py-2 rounded absolute top-6 left-6 flex items-center gap-1 text-sm font-medium text-black hover:opacity-60 transition-opacity cursor-pointer"
        >
          ← Back
        </button>
      <SignUpBox>
        <div className="relative flex flex-col items-center justify-center h-full px-16">
          <h1
            className="text-3xl mb-10 text-black text-center font-semibold"
            style={{ letterSpacing: "0.04em" }}
          >
            Sign into your account
          </h1>

          <div className="w-full mb-5">
            <label className="block text-black text-base mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded px-2 py-1 text-sm outline-none bg-customBeige border-none text-black"
            />
          </div>

          <div className="w-full mb-8">
            <label className="block text-black text-base mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded px-2 py-1 text-sm outline-none bg-customBeige border-none text-black"
            />
          </div>

          <button
            onClick={handleLogin}
            className="bg-customGreen px-10 py-2 rounded text-base font-medium cursor-pointer hover:opacity-90 transition-opacity mb-4 text-black"
          >
            Log in
          </button>

          <p className="text-center text-sm text-black cursor-pointer hover:underline hover:opacity-80">
            Forgot your password?
          </p>
        </div>
      </SignUpBox>
    </div>
  );
}