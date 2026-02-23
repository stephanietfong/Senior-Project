import { useState, useRef, useEffect } from "react";
import { SignUpBox } from "../components/SignUpBox";

export const VerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(28);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const newCode = [...code];
    newCode[index] = value.slice(-1); // only last char
    setCode(newCode);
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const fullCode = code.join("");
    console.log("Verifying code:", fullCode);
  };

  const handleResend = () => {
    setTimer(28);
    console.log("Resending verification email...");
  };

  // Render a single digit box
  const DigitBox = ({ index }: { index: number }) => (
    <input
      ref={(el) => { inputs.current[index] = el; }}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={code[index]}
      onChange={(e) => handleChange(index, e.target.value)}
      onKeyDown={(e) => handleKeyDown(index, e)}
      className="w-12 h-12 text-center text-lg rounded outline-none"
      style={{
        backgroundColor: "#ffffff",
        border: "none",
        color: "#333",
        fontSize: "1.2rem",
      }}
    />
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#e8f0e8" }}
    >
      <SignUpBox>
        <div className="flex flex-col justify-center h-full px-10 py-8 gap-6">

          {/* Message */}
          <p className="text-black text-center" style={{ lineHeight: "1.5" }}>
            We sent a verification code<br />to your inbox.
          </p>

          {/* Code inputs: 3 boxes — dash — 3 boxes */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <DigitBox index={0} />
            <DigitBox index={1} />
            <DigitBox index={2} />
            <span className="text-black text-xl mx-1">—</span>
            <DigitBox index={3} />
            <DigitBox index={4} />
            <DigitBox index={5} />
          </div>

          {/* Resend + timer */}
          <p className="text-black text-center" style={{ lineHeight: "1.6" }}>
            Didn't get it?{" "}
            <span
              className="underline cursor-pointer hover:opacity-80"
              onClick={timer === 0 ? handleResend : undefined}
            >
              Resend verification email
            </span>
            {timer > 0 && <> in {timer} seconds...</>}
          </p>

          {/* {Verify button} */}
          <div className="flex flex-col items-center gap-6">
            <button
              onClick={handleVerify}
              className="px-10 py-2 rounded text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#99aa55", color: "#333" }}
            >
              Verify →
            </button>
          </div>

        </div>
      </SignUpBox>
    </div>
  );
};