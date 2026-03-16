import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-[1200px] mx-auto px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-foreground" strokeWidth={1.5} />
          </div>
          <span className="text-lg font-semibold text-foreground tracking-tight">DevisPro</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#fonctionnalites" className="hover:text-foreground transition-colors">Fonctionnalités</a>
          <a href="#securite" className="hover:text-foreground transition-colors">Sécurité</a>
          <a href="#tarifs" className="hover:text-foreground transition-colors">Tarifs</a>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">Se connecter</Button>
          <Button size="sm">Essai gratuit</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
