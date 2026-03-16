import { Check } from "lucide-react";

const QuotePreview = () => {
  const lines = [
    { desc: "Pose de carrelage 60×60", qty: "25 m²", unit: "45,00 €", total: "1 125,00 €" },
    { desc: "Fourniture joints époxy", qty: "3 kg", unit: "18,50 €", total: "55,50 €" },
    { desc: "Main d'œuvre pose", qty: "2 jours", unit: "350,00 €", total: "700,00 €" },
  ];

  return (
    <div className="relative rounded-xl shadow-card bg-card border border-border overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">DP</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Devis #2024-087</p>
            <p className="text-xs text-muted-foreground">Martin Dupont · Rénovation salle de bain</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
          <Check className="w-3 h-3" strokeWidth={2} />
          Validé
        </span>
      </div>

      {/* Table */}
      <div className="px-6 py-3">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground uppercase tracking-wider">
              <th className="text-left py-2 font-medium">Description</th>
              <th className="text-right py-2 font-medium">Qté</th>
              <th className="text-right py-2 font-medium">P.U. HT</th>
              <th className="text-right py-2 font-medium">Total HT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {lines.map((line, i) => (
              <tr key={i}>
                <td className="py-3 text-foreground">{line.desc}</td>
                <td className="py-3 text-right text-muted-foreground font-mono text-xs">{line.qty}</td>
                <td className="py-3 text-right text-muted-foreground font-mono text-xs">{line.unit}</td>
                <td className="py-3 text-right text-foreground font-mono text-xs font-medium">{line.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer totals */}
      <div className="px-6 py-4 bg-secondary/50 border-t border-border">
        <div className="flex justify-end gap-8 text-sm">
          <div className="text-right">
            <p className="text-muted-foreground">Total HT</p>
            <p className="text-muted-foreground">TVA 20%</p>
            <p className="text-foreground font-semibold mt-1">Total TTC</p>
          </div>
          <div className="text-right font-mono">
            <p className="text-muted-foreground">1 880,50 €</p>
            <p className="text-muted-foreground">376,10 €</p>
            <p className="text-foreground font-semibold mt-1">2 256,60 €</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePreview;
