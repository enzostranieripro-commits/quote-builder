import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="py-24 px-8 bg-secondary/30">
      <div className="max-w-[700px] mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Prêt à gagner du temps ?
        </h2>
        <p className="text-lg text-muted-foreground mb-10">
          Rejoignez les professionnels qui ont déjà simplifié leur facturation. Essai gratuit de 14 jours, sans engagement.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="hero" size="xl">
            Commencer gratuitement
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Configuration en 2 minutes · Sans carte bancaire · Annulation à tout moment
        </p>
      </div>
    </section>
  );
};

export default CtaSection;
