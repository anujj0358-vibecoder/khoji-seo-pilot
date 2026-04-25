import { Logo } from "@/components/khoji/Logo";

export const Footer = () => {
  return (
    <footer className="border-t border-border mt-20">
      <div className="container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="sm" />
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Made in India 🇮🇳
        </div>
      </div>
    </footer>
  );
};