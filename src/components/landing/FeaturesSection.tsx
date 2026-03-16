import { Palette, Calculator, Bell } from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Personnalisation",
    description: "Votre logo, vos couleurs, votre image. Chaque devis reflète l'identité de votre entreprise.",
  },
  {
    icon: Calculator,
    title: "Calculs automatiques",
    description: "Marges, TVA, remises — tout est calculé en temps réel. Zéro erreur, zéro prise de tête.",
  },
  {
    icon: Bell,
    title: "Relances automatiques",
    description: "Ne courez plus après vos paiements. Les relances partent automatiquement selon votre calendrier.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="fonctionnalites" className="py-24 px-8 bg-secondary/30">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16 max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tout ce qu'il faut pour facturer sereinement
          </h2>
          <p className="text-muted-foreground text-lg">
            Concentrez-vous sur votre métier. On s'occupe de la paperasse.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-card rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
