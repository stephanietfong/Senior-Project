import { useState } from "react";
import React from "react";
import { SignUpBox } from "@components/SignUpBox";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../server/supabase";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogin = async () => {
    try {
      setErrorMsg(null);

      if (!email.trim() || !password.trim()) {
        setErrorMsg("Please enter both email and password.");
        return;
      }

      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      navigate("/events");
    } catch (err: any) {
      setErrorMsg(err?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
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
        <div className="relative flex flex-col items-center justify-center h-full px-16">
          <h1
            className="text-3xl mb-10 text-black text-center font-semibold"
            style={{ letterSpacing: "0.04em" }}
          >
            Sign into your account
          </h1>

          {errorMsg && (
            <p className="w-full mb-4 text-sm text-red-600 text-center">
              {errorMsg}
            </p>
          )}

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
            disabled={loading}
            className="bg-customGreen px-10 py-2 rounded text-base font-medium cursor-pointer hover:opacity-90 transition-opacity mb-4 text-black disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          <p
            className="text-center text-sm text-black cursor-pointer hover:underline hover:opacity-80"
            onClick={() => navigate("/signup")}
          >
            Don&apos;t have an account? Sign up
          </p>
        </div>
      </SignUpBox>
    </div>
  );
};