import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { useEntreprise } from "@/hooks/useDevis";
import type { Entreprise } from "@/types/devis";
import { toast } from "sonner";

const Parametres = () => {
  const navigate = useNavigate();
  const { entreprise, setEntreprise } = useEntreprise();
  const [form, setForm] = useState<Entreprise>(entreprise);

  const update = (field: keyof Entreprise, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = () => {
    setEntreprise(form);
    toast.success("Paramètres sauvegardés");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm({ ...form, logo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-[800px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <p className="text-sm font-semibold text-foreground">Paramètres entreprise</p>
          </div>
          <Button size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-1" /> Sauvegarder
          </Button>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-6 py-8 space-y-8">
        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-4">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Identité de l'entreprise
          </h3>

          {/* Logo */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Logo</Label>
            <div className="flex items-center gap-4">
              {form.logo && (
                <img src={form.logo} alt="Logo" className="h-16 w-auto object-contain rounded-lg border border-border p-1" />
              )}
              <Input type="file" accept="image/*" onChange={handleLogoUpload} className="max-w-[250px]" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Raison sociale</Label>
              <Input value={form.raisonSociale} onChange={(e) => update("raisonSociale", e.target.value)} placeholder="Mon Entreprise SARL" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">SIRET</Label>
              <Input value={form.siret} onChange={(e) => update("siret", e.target.value)} placeholder="123 456 789 00012" className="font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Adresse</Label>
              <Input value={form.adresse} onChange={(e) => update("adresse", e.target.value)} placeholder="12 rue des Artisans" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Code postal</Label>
              <Input value={form.codePostal} onChange={(e) => update("codePostal", e.target.value)} placeholder="75001" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Ville</Label>
              <Input value={form.ville} onChange={(e) => update("ville", e.target.value)} placeholder="Paris" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Téléphone</Label>
              <Input value={form.telephone} onChange={(e) => update("telephone", e.target.value)} placeholder="01 23 45 67 89" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Email</Label>
              <Input value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="contact@entreprise.fr" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">TVA Intracommunautaire</Label>
              <Input value={form.tvaIntracom} onChange={(e) => update("tvaIntracom", e.target.value)} placeholder="FR 12 345678901" className="font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">RCS</Label>
              <Input value={form.rcs} onChange={(e) => update("rcs", e.target.value)} placeholder="RCS Paris B 123 456 789" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Assurance décennale</Label>
              <Input value={form.assuranceDecennale} onChange={(e) => update("assuranceDecennale", e.target.value)} placeholder="Compagnie - N° de police" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parametres;
