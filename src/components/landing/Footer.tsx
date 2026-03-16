import { FileText } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 px-8 border-t border-border">
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
            <FileText className="w-3 h-3 text-primary-foreground" strokeWidth={1.5} />
          </div>
          <span className="text-sm font-semibold text-foreground">DevisPro</span>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Mentions légales</a>
          <a href="#" className="hover:text-foreground transition-colors">Confidentialité</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} DevisPro. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
