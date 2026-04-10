import { useState } from "react";
import React from "react";
import { SignUpBox } from "@components/SignUpBox";
import { useNavigate } from "react-router-dom";
import { signUp } from "@/server/lib/users";

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
    if (!passwordValid) {
      return "Password does not meet requirements.";
    }
    return null;
  };

  const handleSignUp = async () => {
    setErrorMsg(null);
    const validationError = validateForm();
    if (validationError) {
      return setErrorMsg(validationError);
    }

    setLoading(true);
    try {
      const vc = Math.floor(100000 + Math.random() * 900000).toString();
      await signUp(email, password, name, dob, vc);

      try {
        const response = await fetch("http://localhost:5000/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: email,
            subject: "Verify your Local Loop Account",
            text: `Your verification code is ${vc}`,
          }),
        });

        const data = await response.json();
        alert(data.message);
        navigate("/verification", { state: { email } });
      } catch (error) {
        console.error(error);
        alert("Error sending email");
      }
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

  const passwordRules = [
    { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "One number", test: (p: string) => /[0-9]/.test(p) },
    {
      label: "One special character",
      test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
    },
  ];

  const passwordValid = passwordRules.every((rule) => rule.test(password));

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

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
              placeholder="First and Last Name"
              className="w-full rounded px-2 py-1 text-sm outline-none bg-customBeige border-none text-black"
            />
          </div>

          {/* Date of Birth */}
          <div className="mb-4">
            <label className="block text-black text-base mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full rounded px-2 py-1 text-sm outline-none bg-customBeige border-none text-black uppercase"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-black text-base mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded px-2 py-1 text-sm outline-none bg-customBeige border-none text-black"
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative group">
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
              className="absolute right-2 bottom-1 text-xs text-gray-500 hover:text-black cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {/* Password requirements */}
            <div className="absolute left-full top-0 ml-3 w-52 bg-white border border-gray-200 rounded shadow-md px-4 py-3 text-sm text-black opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <p className="font-semibold mb-2">Password must have:</p>
              <ul className="space-y-1 list-disc list-inside text-gray-700">
                {passwordRules.map((rule) => (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-2 ${rule.test(password) ? "text-green-600" : "text-gray-500"}`}
                  >
                    <span>{rule.test(password) ? "✓" : "✗"}</span>
                    {rule.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-8">
            <label className="block text-black text-base mb-1">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter Password"
                className="w-full rounded px-2 py-1 text-sm outline-none bg-customBeige border-none text-black"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-2 translate-y-1 text-xs text-gray-500 hover:text-black cursor-pointer"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {confirmPassword !== "" && !passwordsMatch && (
              <p className="text-red-500 text-sm mt-1">
                Passwords do not match
              </p>
            )}
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
                  loading
                    ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                    : "bg-customGreen text-black hover:opacity-90 cursor-pointer"
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
