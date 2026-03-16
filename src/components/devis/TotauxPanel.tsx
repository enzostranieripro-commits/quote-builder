import { calculerTotauxDevis, formatMontant } from "@/types/devis";
import type { LigneDevis, ConditionsDevis } from "@/types/devis";

interface TotauxPanelProps {
  lignes: LigneDevis[];
  conditions: ConditionsDevis;
}

const TotauxPanel = ({ lignes, conditions }: TotauxPanelProps) => {
  const { totalHT, tvaDetails, totalTVA, totalTTC } = calculerTotauxDevis(lignes);
  const acompte = totalTTC * (conditions.acomptePercent / 100);

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-card">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Récapitulatif</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total HT</span>
          <span className="font-mono font-medium text-foreground">{formatMontant(totalHT)}</span>
        </div>

        {Object.entries(tvaDetails)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([rate, amount]) => (
            <div key={rate} className="flex justify-between">
              <span className="text-muted-foreground">TVA {rate}%</span>
              <span className="font-mono text-muted-foreground">{formatMontant(amount)}</span>
            </div>
          ))}

        <div className="flex justify-between">
          <span className="text-muted-foreground">Total TVA</span>
          <span className="font-mono text-muted-foreground">{formatMontant(totalTVA)}</span>
        </div>

        <div className="border-t border-border pt-2 flex justify-between">
          <span className="font-semibold text-foreground">Total TTC</span>
          <span className="font-mono font-bold text-lg text-foreground">{formatMontant(totalTTC)}</span>
        </div>

        {conditions.acomptePercent > 0 && (
          <div className="flex justify-between pt-1">
            <span className="text-muted-foreground">Acompte ({conditions.acomptePercent}%)</span>
            <span className="font-mono font-medium text-primary">{formatMontant(acompte)}</span>
          </div>
        )}
      </div>

      {conditions.echeancier.length > 0 && (
        <div className="border-t border-border pt-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Échéancier</p>
          {conditions.echeancier.map((ech) => (
            <div key={ech.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{ech.description}</span>
              <span className="font-mono text-foreground">{formatMontant(totalTTC * (ech.pourcentage / 100))}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TotauxPanel;
