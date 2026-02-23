import { useState } from "react";
import React from "react";
import { SignUpBox } from "../components/SignUpBox";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Login attempted", { email, password });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#e8f0e8" }}
    >
      <SignUpBox>
        <div className="flex flex-col items-center justify-center h-full px-16">
          <h1
            className="text-2xl mb-10 text-black text-center"
            style={{ letterSpacing: "0.04em" }}
          >
            Sign into your account
          </h1>

          <div className="w-full mb-5">
            <label className="block text-black text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded px-2 py-1 text-sm outline-none"
              style={{ backgroundColor: "#ffffff", border: "none", color: "#000000",}}
            />
          </div>

          <div className="w-full mb-8">
            <label className="block text-black text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded px-2 py-1 text-sm outline-none"
              style={{ backgroundColor: "#ffffff", border: "none", color: "#000000",}}
            />
          </div>

          <button
            onClick={handleLogin}
            className="px-10 py-2 rounded text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity mb-4"
            style={{ backgroundColor: "#99aa55", color: "#333" }}
          >
            Log in
          </button>

          <p className="text-center text-xs text-black cursor-pointer hover:opacity-80">
            Forgot your password?
          </p>
        </div>
      </SignUpBox>
    </div>
  );
}