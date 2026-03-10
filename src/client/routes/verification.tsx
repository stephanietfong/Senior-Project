import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SignUpBox } from "@components/SignUpBox";

export const VerificationPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = (state as any)?.email as string | undefined;

  useEffect(() => {
    // If the user somehow lands here without having just signed up,
    // send them back to the signup page.
    if (!email) {
      navigate("/signup", { replace: true });
    }
  }, [email, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#e8f0e8" }}
    >
      <SignUpBox>
        <div className="flex flex-col justify-center h-full px-10 py-8 gap-6">
          <p className="text-black text-center" style={{ lineHeight: "1.5" }}>
            Thanks for signing up! We sent a confirmation link to
            <br />
            <span className="font-semibold">{email || "your email"}</span>.
            <br />
            Click the link in that email to complete verification.
          </p>

          <button
            onClick={() => navigate("/events")}
            className="px-10 py-2 rounded text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#99aa55", color: "#333" }}
          >
            Go to events
          </button>

          <p className="text-sm text-center text-gray-700">
            If you didn&apos;t receive the email, check your spam folder or try
            signing up again.
          </p>
        </div>
      </SignUpBox>
    </div>
  );
};
