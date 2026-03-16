import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import type { LigneDevis, Unite, TvaRate } from "@/types/devis";
import { UNITES, TVA_RATES, CATEGORIES_BTP, calculerTotalLigneHT, formatMontant } from "@/types/devis";

interface LignesEditorProps {
  lignes: LigneDevis[];
  onChange: (lignes: LigneDevis[]) => void;
}

const LignesEditor = ({ lignes, onChange }: LignesEditorProps) => {
  const addLigne = () => {
    const newLigne: LigneDevis = {
      id: crypto.randomUUID(),
      categorie: "Divers",
      designation: "",
      unite: "u",
      quantite: 1,
      prixUnitaireHT: 0,
      tva: 20,
    };
    onChange([...lignes, newLigne]);
  };

  const updateLigne = (id: string, field: keyof LigneDevis, value: string | number) => {
    onChange(lignes.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const removeLigne = (id: string) => {
    onChange(lignes.filter((l) => l.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Lignes du devis
        </h3>
        <Button variant="outline" size="sm" onClick={addLigne}>
          <Plus className="w-4 h-4 mr-1" /> Ajouter une ligne
        </Button>
      </div>

      {lignes.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <p className="text-muted-foreground text-sm">Aucune ligne. Cliquez sur "Ajouter une ligne" pour commencer.</p>
        </div>
      )}

      {lignes.length > 0 && (
        <div className="border border-border rounded-xl overflow-hidden">
          {/* Header */}
          <div className="hidden lg:grid grid-cols-[140px_1fr_90px_80px_100px_80px_100px_40px] gap-2 px-4 py-2 bg-secondary/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span>Catégorie</span>
            <span>Désignation</span>
            <span>Unité</span>
            <span>Qté</span>
            <span>P.U. HT</span>
            <span>TVA</span>
            <span className="text-right">Total HT</span>
            <span />
          </div>

          <div className="divide-y divide-border">
            {lignes.map((ligne) => (
              <div key={ligne.id} className="grid grid-cols-1 lg:grid-cols-[140px_1fr_90px_80px_100px_80px_100px_40px] gap-2 px-4 py-3 items-center">
                <Select value={ligne.categorie} onValueChange={(v) => updateLigne(ligne.id, "categorie", v)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES_BTP.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-xs">{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  className="h-9 text-sm"
                  placeholder="Description du poste"
                  value={ligne.designation}
                  onChange={(e) => updateLigne(ligne.id, "designation", e.target.value)}
                />

                <Select value={ligne.unite} onValueChange={(v) => updateLigne(ligne.id, "unite", v as Unite)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITES.map((u) => (
                      <SelectItem key={u} value={u} className="text-xs">{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  className="h-9 text-sm font-mono text-right"
                  type="number"
                  min={0}
                  step="0.01"
                  value={ligne.quantite || ""}
                  onChange={(e) => updateLigne(ligne.id, "quantite", parseFloat(e.target.value) || 0)}
                />

                <Input
                  className="h-9 text-sm font-mono text-right"
                  type="number"
                  min={0}
                  step="0.01"
                  value={ligne.prixUnitaireHT || ""}
                  onChange={(e) => updateLigne(ligne.id, "prixUnitaireHT", parseFloat(e.target.value) || 0)}
                />

                <Select value={String(ligne.tva)} onValueChange={(v) => updateLigne(ligne.id, "tva", Number(v) as TvaRate)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TVA_RATES.map((rate) => (
                      <SelectItem key={rate} value={String(rate)} className="text-xs">{rate}%</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <p className="text-sm font-mono font-medium text-foreground text-right">
                  {formatMontant(calculerTotalLigneHT(ligne))}
                </p>

                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeLigne(ligne.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LignesEditor;
