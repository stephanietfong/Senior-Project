import { useState } from "react";
import React from "react";
import { SignUpBox } from "@components/SignUpBox";
import { useNavigate } from "react-router-dom";
import { supabase } from "@server/supabase";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetMsg, setResetMsg] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrorMsg(null);
    if (!email.trim()) return setErrorMsg("Please enter your email.");
    if (!password) return setErrorMsg("Please enter your password.");

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // Redirect after successful login
      navigate("/events");
    } catch (err: any) {
      setErrorMsg(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setErrorMsg(null);
    setResetMsg(null);
    if (!email.trim()) return setErrorMsg("Enter your email above first.");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setResetMsg("Check your email for a password reset link.");
    } catch (err: any) {
      setErrorMsg(err.message || String(err));
    }
  };

  const navigate = useNavigate();
  const handleBack = () => {
    console.log("Back button clicked");
    navigate(-1);
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-customBeige">
      <button
        onClick={handleBack}
        className="bg-customGreen button-style absolute top-6 left-6 text-sm  text-black hover:bg-customGreen/50 transition-opacity cursor-pointer"
      >
        ← Back
      </button>
      <SignUpBox>
        <div className="relative flex flex-col items-center justify-center h-full px-16">
          <h1 className="subheader-text text-black p-10">Log Into Account</h1>

          <div className="w-full mb-6 font-redhat">
            <label className="block text-black text-base mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded px-2 py-1 text-sm outline-none bg-customBeige border-none text-black"
            />
          </div>

          <div className="w-full mb-6 relative group font-redhat">
            <label className="block text-black text-base mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full rounded px-2 py-1 text-sm outline-none bg-customBeige border-none text-black"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 translate-y-1 text-xs text-gray-500 hover:text-black cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`bg-customGreen px-10 py-2 rounded text-base font-medium transition-opacity mb-4 text-black w-full ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-customGreen/50"
            }`}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          {errorMsg && (
            <p className="text-sm text-red-600 text-center mb-4">{errorMsg}</p>
          )}

          <p 
            onClick={handleForgotPassword}
            className="text-center text-sm text-black cursor-pointer hover:underline hover:opacity-80"
          >
            Forgot your password?
          </p>
          {resetMsg && (
            <p className="text-sm text-green-600 text-center mt-2">{resetMsg}</p>
          )}
        </div>
      </SignUpBox>
    </div>
  );
};
