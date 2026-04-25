import logo from "@/assets/khoji-logo.png";
import { Link } from "react-router-dom";

interface LogoProps {
  to?: string;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ to = "/", size = "md" }: LogoProps) => {
  const dim = size === "sm" ? "h-7 w-7" : size === "lg" ? "h-10 w-10" : "h-9 w-9";
  const text = size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";
  return (
    <Link to={to} className="flex items-center gap-2 group">
      <img src={logo} alt="Khoji logo" className={`${dim} rounded-lg shadow-card group-hover:shadow-glow transition-shadow`} />
      <span className={`${text} font-extrabold tracking-tight text-foreground`}>KHOJI</span>
    </Link>
  );
};