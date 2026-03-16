import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QuotePreview from "./QuotePreview";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="pt-32 pb-20 px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Nouveau : Relances automatiques
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-foreground leading-[1.1]">
              Vos devis, plus rapides que vos chantiers.
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
              Créez des devis professionnels en quelques clics. Suivi, relances, export PDF — tout est automatisé pour vous faire gagner du temps.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl">
                Créer mon premier devis
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
              <Button variant="heroGhost" size="xl">
                <Play className="w-4 h-4" />
                Voir un exemple
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Gratuit pendant 14 jours · Sans carte bancaire
            </p>
          </div>

          {/* Right: Interface Preview */}
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-3xl opacity-50" />
            <QuotePreview />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
