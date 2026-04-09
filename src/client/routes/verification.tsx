import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SignUpBox } from "@components/SignUpBox";
import { getVCByEmail, updateVCByEmail, verifyUser } from "@/server/lib/users";

export const VerificationPage = () => {
  const [vc, setVC] = useState("");
  const [verificationError, setverificationError] = useState(false);
  const [resentCode, setresentCode] = useState(false);
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

  const handleVerification = async () => {
    try {
      if (email) {
        const { verification_code } = await getVCByEmail(email);
        console.log(verification_code);
        console.log(vc);
        if (verification_code.toString() === vc.toString()) {
          await verifyUser(email);
          navigate("/interests");
        }
      }
    } catch (error) {
      setverificationError(true);
      console.error("Error get VC for user", error);
    }
  };

  const handleNewCode = async () => {
    const newVC = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      if (email) {
        await updateVCByEmail(email, newVC);

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
        } catch (error) {
          console.error(error);
          alert("Error sending email");
        }

        setresentCode(true);
      }
    } catch (error) {
      console.error("Error resetting VC for user", error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#e8f0e8" }}
    >
      <SignUpBox>
        <div className="flex flex-col justify-center h-full px-10 py-8 gap-6">
          <p className="text-black text-center" style={{ lineHeight: "1.5" }}>
            Thanks for signing up! We sent a confirmation link to your email
            containing a 6-digit{" "}
            <span className="font-semibold">verification code</span>.
            <br /> <br />
            Please enter the code in the box below.
          </p>

          <input
            type="text"
            className="bg-white h-12 mx-[25%] text-center text-black text-xl"
            onChange={(e) => setVC(e.target.value)}
            value={vc}
          />

          {verificationError && !resentCode ? (
            <p>Code is incorrect. Please try again or request a new code.</p>
          ) : null}

          {verificationError && resentCode ? (
            <p>Code has been resent.</p>
          ) : null}

          <button
            onClick={handleVerification}
            className="px-10 py-2 rounded text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity bg-customGreen"
          >
            Verify account
          </button>

          <p className="text-sm text-center text-gray-700">
            If you didn&apos;t receive the email, check your spam folder or
            click the button to send a new code.
          </p>

          <button
            onClick={handleNewCode}
            className="px-10 py-2 rounded text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity bg-customGray text-black"
          >
            Get new code
          </button>
        </div>
      </SignUpBox>
    </div>
  );
};
