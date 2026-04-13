import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@server/supabase";
import { SignUpBox } from "@components/SignUpBox";

export const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const passwordRules = [
    { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "One number", test: (p: string) => /[0-9]/.test(p) },
    {
      label: "One special character",
      test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
    },
  ];

  const passwordValid = passwordRules.every((rule) => rule.test(newPassword));
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== "";

  const handleReset = async () => {
    setErrorMsg(null);
    if (!newPassword) return setErrorMsg("Please enter a new password.");
    if (!passwordValid) return setErrorMsg("Password does not meet requirements.");
    if (newPassword !== confirmPassword) return setErrorMsg("Passwords do not match.");

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setSuccessMsg("Password updated! Redirecting...");
      setTimeout(() => navigate("/events"), 2000);
    } catch (err: any) {
      setErrorMsg(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-customBeige">
      <SignUpBox>
        <div className="relative flex flex-col items-center justify-center h-full px-16">
          <h1
            className="text-3xl mb-10 text-black text-center font-semibold"
            style={{ letterSpacing: "0.04em" }}
          >
            Reset your password
          </h1>

          {/* New Password */}
          <div className="w-full mb-5 relative group">
            <label className="block text-black text-base mb-1">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full rounded px-2 py-1 text-sm outline-none bg-customBeige border-none text-black"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 bottom-1 text-xs text-gray-500 hover:text-black cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {/* Password requirements tooltip */}
            <div className="absolute left-full top-0 ml-3 w-52 bg-white border border-gray-200 rounded shadow-md px-4 py-3 text-sm text-black opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <p className="font-semibold mb-2">Password must have:</p>
              <ul className="space-y-1 list-disc list-inside text-gray-700">
                {passwordRules.map((rule) => (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-2 ${
                      rule.test(newPassword) ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    <span>{rule.test(newPassword) ? "✓" : "✗"}</span>
                    {rule.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="w-full mb-8 relative">
            <label className="block text-black text-base mb-1">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full rounded px-2 py-1 text-sm outline-none bg-customBeige border-none text-black"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-2 bottom-1 text-xs text-gray-500 hover:text-black cursor-pointer"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
            {confirmPassword !== "" && !passwordsMatch && (
              <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
            )}
          </div>

          <button
            onClick={handleReset}
            disabled={loading}
            className={`bg-customGreen px-10 py-2 rounded text-base font-medium transition-opacity mb-4 text-black w-full ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

          {errorMsg && (
            <p className="text-sm text-red-600 text-center mb-2">{errorMsg}</p>
          )}
          {successMsg && (
            <p className="text-sm text-green-600 text-center mb-2">{successMsg}</p>
          )}
        </div>
      </SignUpBox>
    </div>
  );
};