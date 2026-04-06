import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserIcon from "@client/assets/user.png";
import { logout } from "@lib/users";

export function SectionHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <header className="w-full border-b border-black/10 bg-customBlue px-6 py-4 text-black">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link
          to="/events"
          className="text-4xl text-black"
          style={{ fontFamily: "Ropest", fontWeight: 400 }}
        >
          LocalLoop
        </Link>

        <div className="relative -my-4 py-4">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="rounded-full"
            aria-label="Open user menu"
          >
            <img src={UserIcon} alt="User menu" className="h-7 w-7" />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-52 border border-black/10 bg-[#e8f0e8] py-2 shadow-sm">
              <Link
                to="/profile"
                onClick={handleNavigate}
                className="block px-4 py-2 text-black hover:opacity-80"
              >
                Profile
              </Link>
              <Link
                to="/my-events"
                onClick={handleNavigate}
                className="block px-4 py-2 text-black hover:opacity-80"
              >
                My Events
              </Link>
              <Link
                to="/upcoming"
                onClick={handleNavigate}
                className="block px-4 py-2 text-black hover:opacity-80"
              >
                Interested Events
              </Link>
              <Link
                to="/create-event"
                onClick={handleNavigate}
                className="block px-4 py-2 text-black hover:opacity-80"
              >
                Create Event
              </Link>
              <Link
                to="/settings"
                onClick={handleNavigate}
                className="block px-4 py-2 text-black hover:opacity-80"
              >
                Settings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-black hover:opacity-80"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
