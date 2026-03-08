import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SignUpBox } from "@components/SignUpBox";
import { supabase } from "../../server/supabase";

export const VerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleResend = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      setMessage(null);

      if (!email) {
        setErrorMsg("No email found to resend verification.");
        return;
      }

      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) throw error;

      setMessage("Verification email sent again.");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to resend verification email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-customBeige">
      <SignUpBox>
        <div className="flex flex-col justify-center h-full px-10 py-8 gap-6">
          <h1 className="text-3xl text-black text-center font-semibold">
            Check your email
          </h1>

          <p className="text-black text-center" style={{ lineHeight: "1.6" }}>
            We sent a verification link to:
            <br />
            <span className="font-semibold">{email || "your email"}</span>
          </p>

          <p className="text-black text-center text-sm">
            Open the email and click the confirmation link, then come back and
            log in.
          </p>

          {message && (
            <p className="text-center text-sm text-green-700">{message}</p>
          )}

          {errorMsg && (
            <p className="text-center text-sm text-red-600">{errorMsg}</p>
          )}

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleResend}
              disabled={loading}
              className="px-10 py-2 rounded text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity bg-customGreen text-black disabled:opacity-60"
            >
              {loading ? "Sending..." : "Resend verification email"}
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-10 py-2 rounded text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity bg-customDarkBlue text-black"
            >
              Go to Login
            </button>
          </div>
        </div>
      </SignUpBox>
    </div>
  );
};