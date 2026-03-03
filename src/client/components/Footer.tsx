import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="w-full border-t border-black/10 bg-customBlue py-4 px-6 text-black">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-6 text-sm text-black">
        <Link to="/faq" className="text-black hover:underline">
          FAQ
        </Link>
        <span aria-hidden="true">•</span>
        <Link to="/contact" className="text-black hover:underline">
          Contact Us
        </Link>
      </div>
    </footer>
  );
}
