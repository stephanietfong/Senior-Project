import { useState } from "react";
import React from "react";
import { SignUpBox } from "@components/SignUpBox";
import { useNavigate } from "react-router-dom";
import { supabase } from "@server/supabase";

export const SignUpPage = () => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name.trim()) {
      return "Please enter your name.";
    }
    if (!email.trim()) {
      return "Please enter your email.";
    }
    if (!password) {
      return "Please enter a password.";
    } 
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    return null;
  };

  const createProfile = async (userId: string) => {
    const { error: insertError } = await supabase.from("users").insert({
      user_id: userId,
      email,
      display_name: name,
      date_of_birth: dob || null,
    });
    if (insertError) {
      throw insertError;
    } 
  };

  const handleSignUp = async () => {
    setErrorMsg(null);
    const validationError = validateForm();
    if (validationError){
      return setErrorMsg(validationError);
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        throw error;
      } 

      const userId = data.user?.id;
      if (userId) {
          await createProfile(userId);
      }

      navigate("/verification", { state: { email } });
    } catch (err: any) {
      setErrorMsg(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

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
            <div className="flex flex-col items-center gap-3 w-full">
              {errorMsg && (
                <p className="text-sm text-red-600 text-center">{errorMsg}</p>
              )}
              <button
                onClick={handleSignUp}
                disabled={loading}
                className={`px-10 py-2 rounded text-base font-medium transition-opacity w-full ${
                  loading ? "bg-gray-400 text-gray-800 cursor-not-allowed" : "bg-customGreen text-black hover:opacity-90 cursor-pointer"
                }`}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </div>
          </div>
        </div>
      </SignUpBox>
    </div>
  );
};
