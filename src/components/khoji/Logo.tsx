import logo from "@/assets/khoji-logo.png";
import { Link } from "react-router-dom";

interface LogoProps {
  to?: string;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ to = "/", size = "md" }: LogoProps) => {
  const h = size === "sm" ? "h-7" : size === "lg" ? "h-12" : "h-9";
  return (
    <Link to={to} className="flex items-center group" aria-label="Khoji home">
      <img
        src={logo}
        alt="Khoji"
        className={`${h} w-auto object-contain transition-opacity group-hover:opacity-90`}
      />
    </Link>
  );
};