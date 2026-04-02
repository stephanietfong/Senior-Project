import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getUserById, logout } from "@lib/users";
import { supabase } from "@server/supabase";

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
  {
    label: "One special character",
    test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
  },
];

export function SettingsPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Display name
  const [displayName, setDisplayName] = useState("");
  const [savedDisplayName, setSavedDisplayName] = useState("");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSuccess, setNameSuccess] = useState<string | null>(null);

  // Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Logout
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const authUser = await getCurrentUser();
        if (!authUser) {
          navigate("/login");
          return;
        }
        setUserId(authUser.id);
        const profile = await getUserById(authUser.id);
        const name = profile?.display_name || "";
        setDisplayName(name);
        setSavedDisplayName(name);
      } catch (e: any) {
        setNameError(e.message || "Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSaveName = async () => {
    setNameError(null);
    setNameSuccess(null);
    if (!displayName.trim()) {
      setNameError("Display name cannot be empty.");
      return;
    }
    if (displayName.trim() === savedDisplayName) {
      setNameError("No changes to save.");
      return;
    }
    setNameSaving(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({ display_name: displayName.trim() })
        .eq("user_id", userId);
      if (error) throw error;
      setSavedDisplayName(displayName.trim());
      setNameSuccess("Display name updated.");
    } catch (e: any) {
      setNameError(e.message || "Failed to update display name.");
    } finally {
      setNameSaving(false);
    }
  };

  const passwordValid = passwordRules.every((r) => r.test(newPassword));
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== "";

  const handleSavePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(null);
    if (!newPassword) {
      setPasswordError("Please enter a new password.");
      return;
    }
    if (!passwordValid) {
      setPasswordError("Password does not meet requirements.");
      return;
    }
    if (!passwordsMatch) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setPasswordSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess("Password updated successfully.");
    } catch (e: any) {
      setPasswordError(e.message || "Failed to update password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/");
    } catch (e: any) {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="py-10 px-6 text-black">
        <p className="font-redhat text-black/70">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 text-black md:px-10 lg:px-20">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">

        {/* Header */}
        <div className="rounded-[2rem] border border-black/10 bg-customBeige p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-black/50">Account</p>
          <h1 className="mt-2 font-oswald text-5xl leading-none">Settings</h1>
          <p className="mt-3 max-w-2xl font-redhat text-base text-black/70">
            Manage your account details and security preferences.
          </p>
        </div>

        {/* Display Name */}
        <section className="rounded-[2rem] border border-black/10 bg-customBeige p-8 shadow-sm">
          <h2 className="font-oswald text-3xl">Display Name</h2>
          <p className="mt-2 font-redhat text-black/65">
            This is the name shown on your profile and events.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                setNameError(null);
                setNameSuccess(null);
              }}
              className="flex-1 rounded-xl border border-black/15 bg-white px-4 py-3 font-redhat text-base outline-none focus:border-black/40"
            />
            <button
              type="button"
              onClick={handleSaveName}
              disabled={nameSaving || displayName.trim() === savedDisplayName}
              className="rounded-full bg-customGreen px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {nameSaving ? "Saving..." : "Save"}
            </button>
          </div>
          {nameError && (
            <p className="mt-3 font-redhat text-sm text-red-600">{nameError}</p>
          )}
          {nameSuccess && (
            <p className="mt-3 font-redhat text-sm text-green-600">{nameSuccess}</p>
          )}
        </section>

        {/* Change Password */}
        <section className="rounded-[2rem] border border-black/10 bg-customBeige p-8 shadow-sm">
          <h2 className="font-oswald text-3xl">Change Password</h2>
          <p className="mt-2 font-redhat text-black/65">
            Choose a strong password you don't use elsewhere.
          </p>

          <div className="mt-6 flex flex-col gap-4">
            {/* New password */}
            <div className="relative">
              <label className="mb-1 block font-redhat text-sm text-black/60">
                New Password
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordError(null);
                  setPasswordSuccess(null);
                }}
                className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 font-redhat text-base outline-none focus:border-black/40"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((p) => !p)}
                className="absolute right-4 top-9 text-xs text-black/50 hover:text-black"
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Password rules */}
            {newPassword.length > 0 && (
              <ul className="flex flex-wrap gap-x-6 gap-y-1">
                {passwordRules.map((rule) => (
                  <li
                    key={rule.label}
                    className={`font-redhat text-sm ${rule.test(newPassword) ? "text-green-600" : "text-black/40"}`}
                  >
                    {rule.test(newPassword) ? "✓" : "✗"} {rule.label}
                  </li>
                ))}
              </ul>
            )}

            {/* Confirm password */}
            <div className="relative">
              <label className="mb-1 block font-redhat text-sm text-black/60">
                Confirm New Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError(null);
                  setPasswordSuccess(null);
                }}
                className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 font-redhat text-base outline-none focus:border-black/40"
                placeholder="Re-enter new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-4 top-9 text-xs text-black/50 hover:text-black"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {confirmPassword !== "" && !passwordsMatch && (
              <p className="font-redhat text-sm text-red-500">Passwords do not match.</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSavePassword}
            disabled={passwordSaving}
            className="mt-6 rounded-full bg-customGreen px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {passwordSaving ? "Updating..." : "Update Password"}
          </button>

          {passwordError && (
            <p className="mt-3 font-redhat text-sm text-red-600">{passwordError}</p>
          )}
          {passwordSuccess && (
            <p className="mt-3 font-redhat text-sm text-green-600">{passwordSuccess}</p>
          )}
        </section>

        {/* Logout */}
        <section className="rounded-[2rem] border border-black/10 bg-customBeige p-8 shadow-sm">
          <h2 className="font-oswald text-3xl">Sign Out</h2>
          <p className="mt-2 font-redhat text-black/65">
            You'll be returned to the home page.
          </p>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="mt-6 rounded-full bg-customBrown px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </section>

      </div>
    </div>
  );
}
