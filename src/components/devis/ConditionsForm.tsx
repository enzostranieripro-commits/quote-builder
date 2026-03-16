import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type { ConditionsDevis, EcheanceItem } from "@/types/devis";

interface ConditionsFormProps {
  conditions: ConditionsDevis;
  onChange: (conditions: ConditionsDevis) => void;
}

const ConditionsForm = ({ conditions, onChange }: ConditionsFormProps) => {
  const update = <K extends keyof ConditionsDevis>(field: K, value: ConditionsDevis[K]) => {
    onChange({ ...conditions, [field]: value });
  };

  const updateEcheance = (id: string, field: keyof EcheanceItem, value: string | number) => {
    update(
      "echeancier",
      conditions.echeancier.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const addEcheance = () => {
    update("echeancier", [
      ...conditions.echeancier,
      { id: crypto.randomUUID(), pourcentage: 0, description: "" },
    ]);
  };

  const removeEcheance = (id: string) => {
    update("echeancier", conditions.echeancier.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
        Conditions & échéancier
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Validité (jours)</Label>
          <Input
            type="number"
            min={1}
            value={conditions.validiteDuree}
            onChange={(e) => update("validiteDuree", parseInt(e.target.value) || 30)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Acompte (%)</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={conditions.acomptePercent}
            onChange={(e) => update("acomptePercent", parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Conditions de paiement</Label>
        <Textarea
          rows={2}
          value={conditions.conditionsPaiement}
          onChange={(e) => update("conditionsPaiement", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Mentions légales</Label>
        <Textarea
          rows={3}
          value={conditions.mentionsLegales}
          onChange={(e) => update("mentionsLegales", e.target.value)}
        />
      </div>

      {/* Échéancier */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground font-semibold">Échéancier de paiement</Label>
          <Button variant="outline" size="sm" onClick={addEcheance}>
            <Plus className="w-3 h-3 mr-1" /> Ajouter
          </Button>
        </div>

        {conditions.echeancier.map((ech) => (
          <div key={ech.id} className="flex items-center gap-3">
            <Input
              type="number"
              min={0}
              max={100}
              className="w-20 h-9 text-sm font-mono text-right"
              value={ech.pourcentage || ""}
              onChange={(e) => updateEcheance(ech.id, "pourcentage", parseInt(e.target.value) || 0)}
            />
            <span className="text-sm text-muted-foreground">%</span>
            <Input
              className="h-9 text-sm flex-1"
              placeholder="Description de l'échéance"
              value={ech.description}
              onChange={(e) => updateEcheance(ech.id, "description", e.target.value)}
            />
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeEcheance(ech.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConditionsForm;
