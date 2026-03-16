import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, FileDown } from "lucide-react";
import { useDevisList } from "@/hooks/useDevis";
import { creerDevisVide } from "@/types/devis";
import type { Devis } from "@/types/devis";
import ClientForm from "@/components/devis/ClientForm";
import LignesEditor from "@/components/devis/LignesEditor";
import ConditionsForm from "@/components/devis/ConditionsForm";
import TotauxPanel from "@/components/devis/TotauxPanel";
import { generateDevisPDF } from "@/lib/pdf";
import { useEntreprise } from "@/hooks/useDevis";
import { toast } from "sonner";

const DevisEditor = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { devisList, addDevis, updateDevis, getDevis } = useDevisList();
  const { entreprise } = useEntreprise();
  const editId = searchParams.get("id");

  const [devis, setDevis] = useState<Devis>(() => {
    if (editId) {
      const existing = getDevis(editId);
      if (existing) return existing;
    }
    return creerDevisVide();
  });

  const isNew = !editId;

  const handleSave = () => {
    if (isNew) {
      addDevis(devis);
    } else {
      updateDevis(devis);
    }
    toast.success(isNew ? "Devis créé avec succès" : "Devis mis à jour");
    navigate("/dashboard");
  };

  const handleExportPDF = () => {
    generateDevisPDF(devis, entreprise);
    toast.success("PDF téléchargé");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {isNew ? "Nouveau devis" : `Devis ${devis.numero}`}
              </p>
              <p className="text-xs text-muted-foreground">
                {isNew ? "Brouillon" : devis.status}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <FileDown className="w-4 h-4 mr-1" /> PDF
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-1" /> Enregistrer
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Main form */}
          <div className="space-y-8">
            {/* Header info */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-card">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">N° Devis</Label>
                  <Input value={devis.numero} onChange={(e) => setDevis({ ...devis, numero: e.target.value })} className="font-mono" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Date de création</Label>
                  <Input type="date" value={devis.dateCreation} onChange={(e) => setDevis({ ...devis, dateCreation: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Date de validité</Label>
                  <Input type="date" value={devis.dateValidite} onChange={(e) => setDevis({ ...devis, dateValidite: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Objet du devis</Label>
                <Input placeholder="Ex: Rénovation salle de bain - Appartement 3ème étage" value={devis.objet} onChange={(e) => setDevis({ ...devis, objet: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Description complémentaire</Label>
                <Textarea rows={2} placeholder="Détails supplémentaires sur le chantier..." value={devis.description} onChange={(e) => setDevis({ ...devis, description: e.target.value })} />
              </div>
            </div>

            {/* Client */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-card">
              <ClientForm client={devis.client} onChange={(client) => setDevis({ ...devis, client })} />
            </div>

            {/* Lignes */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-card">
              <LignesEditor lignes={devis.lignes} onChange={(lignes) => setDevis({ ...devis, lignes })} />
            </div>

            {/* Conditions */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-card">
              <ConditionsForm conditions={devis.conditions} onChange={(conditions) => setDevis({ ...devis, conditions })} />
            </div>

            {/* Notes */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-2">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Notes internes</h3>
              <Textarea rows={3} placeholder="Notes privées (non visibles sur le PDF)..." value={devis.notes} onChange={(e) => setDevis({ ...devis, notes: e.target.value })} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TotauxPanel lignes={devis.lignes} conditions={devis.conditions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevisEditor;
