import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/khoji-logo.png";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" aria-label="Khoji home" className="flex items-center">
          <img src={logo} alt="Khoji" className="h-10 w-auto object-contain mr-2" />
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#why" className="hover:text-foreground transition-colors">Why Khoji</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="text-foreground hover:text-foreground">
            <Link to="/auth">Log in</Link>
          </Button>
          <Button asChild variant="hero" size="sm">
            <Link to="/auth">Start Free Trial</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};