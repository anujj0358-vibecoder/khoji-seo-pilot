import { Logo } from "@/components/khoji/Logo";

export const Footer = () => {
  return (
    <footer className="border-t border-border mt-20 bg-background">
      <div className="container py-12">
        <div className="flex flex-col items-center text-center gap-8 md:flex-row md:text-left md:justify-between">
          <Logo size="sm" />
          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground/80">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </nav>
        </div>
        <div className="mt-10 pt-6 border-t border-border/60 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Khoji · Made in India 🇮🇳
        </div>
      </div>
    </footer>
  );
};