import { useState } from "react";
import React from "react";
import { SignUpBox } from "@components/SignUpBox";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../server/supabase";

export const SignUpPage = () => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleSignUp = async () => {
    try {
      setErrorMsg(null);

      if (!name.trim() || !dob.trim() || !email.trim() || !password.trim()) {
        setErrorMsg("Please fill out all fields.");
        return;
      }

      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }

      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      const userId = data.user?.id;
      if (!userId) {
        throw new Error("User was created, but no user id was returned.");
      }

      const { error: profileError } = await supabase.from("users").upsert({
        user_id: userId,
        display_name: name.trim(),
        email: email.trim(),
        date_of_birth: dob,
      });

      if (profileError) {
        throw new Error(
          `Account created, but profile setup failed: ${profileError.message}`,
        );
      }

      navigate("/verification", {
        state: { email: email.trim() },
      });
    } catch (err: any) {
      setErrorMsg(err?.message || "Signup failed.");
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
        <div className="flex flex-col justify-center h-full px-10 py-8">
          <h1 className="text-3xl mb-6 text-black text-center font-semibold">
            Create your account
          </h1>

          {errorMsg && (
            <p className="mb-4 text-sm text-red-600 text-center">{errorMsg}</p>
          )}

          <div className="mb-4">
            <label className="block text-black text-base mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First & Last"
              className="w-full rounded px-2 py-1 text-sm outline-none bg-customBeige border-none text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-black text-base mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full rounded px-2 py-1 text-sm outline-none bg-customBeige border-none text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-black text-base mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded px-2 py-1 text-sm outline-none bg-customBeige border-none text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-black text-base mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded px-2 py-1 text-sm outline-none bg-customBeige border-none text-black"
            />
          </div>

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

          <div className="flex justify-center">
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="bg-customGreen px-10 py-2 rounded text-base font-medium cursor-pointer hover:opacity-90 transition-opacity text-black disabled:opacity-60"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </div>
      </SignUpBox>
    </div>
  );
};