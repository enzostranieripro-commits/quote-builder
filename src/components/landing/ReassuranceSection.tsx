import { Shield, Lock, FileCheck, Clock } from "lucide-react";

const items = [
  {
    icon: FileCheck,
    title: "Conformité légale",
    description: "Mentions obligatoires, numérotation conforme — vos documents respectent la réglementation française.",
  },
  {
    icon: Lock,
    title: "Données sécurisées",
    description: "Chiffrement de bout en bout, hébergement en France, sauvegardes automatiques quotidiennes.",
  },
  {
    icon: Shield,
    title: "RGPD compliant",
    description: "Vos données et celles de vos clients sont protégées conformément au RGPD.",
  },
  {
    icon: Clock,
    title: "Export instantané",
    description: "Générez un PDF professionnel en un clic. Envoyez-le directement par email à votre client.",
  },
];

const ReassuranceSection = () => {
  return (
    <section id="securite" className="py-24 px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16 max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            La rigueur d'un expert-comptable
          </h2>
          <p className="text-muted-foreground text-lg">
            Conformité, sécurité et fiabilité — sans compromis.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <div key={i} className="text-center p-6">
              <div className="w-12 h-12 rounded-xl bg-secondary mx-auto flex items-center justify-center mb-5">
                <item.icon className="w-6 h-6 text-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReassuranceSection;
