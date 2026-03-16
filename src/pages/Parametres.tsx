// ════════════════════════════════════════════════
// src/pages/Parametres.tsx
// ════════════════════════════════════════════════
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/components/layout/AppLayout";
import { useEntreprise } from "@/hooks/useStore";
import { changePassword, getAuthConfig } from "@/lib/auth";
import { SECTEURS, type Entreprise, type SecteurId } from "@/types";
import { Building2, Mail, Lock, FileText, Globe, ArrowLeft, Save, CheckCircle2, Eye, EyeOff, Shield } from "lucide-react";
import { toast } from "sonner";

const TABS = [
  { id: "entreprise", label: "Entreprise", icon: Building2 },
  { id: "contact", label: "Contact & Email", icon: Mail },
  { id: "securite", label: "Sécurité", icon: Lock },
  { id: "devis", label: "Défauts devis", icon: FileText },
  { id: "secteur", label: "Secteur", icon: Globe },
];

export function Parametres() {
  const navigate = useNavigate();
  const { entreprise, setEntreprise } = useEntreprise();
  const [form, setForm] = useState<Entreprise>({ ...entreprise });
  const [tab, setTab] = useState("entreprise");
  const [oldPwd, setOldPwd] = useState(""); const [newPwd, setNewPwd] = useState(""); const [confirmPwd, setConfirmPwd] = useState("");
  const [showOld, setShowOld] = useState(false); const [showNew, setShowNew] = useState(false);
  const authCfg = getAuthConfig();
  const up = (f: keyof Entreprise, v: string | number) => setForm(x => ({ ...x, [f]: v }));
  const save = () => { setEntreprise(form); toast.success("Paramètres sauvegardés ✓"); };
  const changePwd = () => {
    if (!oldPwd || !newPwd) { toast.error("Remplissez tous les champs"); return; }
    if (newPwd.length < 6) { toast.error("Nouveau mot de passe trop court"); return; }
    if (newPwd !== confirmPwd) { toast.error("Mots de passe différents"); return; }
    if (changePassword(oldPwd, newPwd)) { toast.success("Mot de passe modifié ✓"); setOldPwd(""); setNewPwd(""); setConfirmPwd(""); }
    else toast.error("Ancien mot de passe incorrect");
  };
  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => setForm(x => ({ ...x, logo: r.result as string })); r.readAsDataURL(f); };

  return (
    <AppLayout secteur={form.secteur}>
      <div className="max-w-[900px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="p-2 rounded-xl hover:bg-secondary"><ArrowLeft className="w-4 h-4" /></button>
            <div><h1 className="text-xl font-bold">Paramètres</h1><p className="text-xs text-muted-foreground">{form.raisonSociale || "Votre entreprise"}</p></div>
          </div>
          {tab !== "securite" && <Button onClick={save} size="sm" className="rounded-xl shadow-sm"><Save className="w-4 h-4 mr-1" /> Sauvegarder</Button>}
        </div>
        <div className="grid md:grid-cols-[180px_1fr] gap-6">
          <div className="space-y-1">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </div>
          <div className="space-y-5">
            {tab === "entreprise" && (
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Identité</h3>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Logo</Label>
                  <div className="flex items-center gap-4">
                    {form.logo ? <div className="relative"><img src={form.logo} alt="Logo" className="h-16 w-auto rounded-xl border border-border p-2 bg-white object-contain" /><button onClick={() => setForm(x => ({ ...x, logo: undefined }))} className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-white rounded-full text-xs flex items-center justify-center font-bold">×</button></div> : <div className="h-16 w-24 bg-secondary rounded-xl border-2 border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">Logo</div>}
                    <Input type="file" accept="image/*" onChange={handleLogo} className="max-w-[200px] h-9" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[{ l: "Raison sociale *", f: "raisonSociale", p: "Martin Peinture SARL" }, { l: "SIRET", f: "siret", p: "123 456 789 00012", mono: true }, { l: "Adresse", f: "adresse", p: "12 rue des Artisans" }, { l: "Code postal", f: "codePostal", p: "12000" }, { l: "Ville", f: "ville", p: "Rodez" }, { l: "RCS", f: "rcs", p: "RCS Rodez B 123 456 789" }, { l: "TVA Intracom", f: "tvaIntracom", p: "FR 12 345678901", mono: true }, { l: "Assurance décennale", f: "assuranceDecennale", p: "AXA — N° 12345678" }].map(({ l, f, p, mono }) => (
                    <div key={f} className="space-y-1.5"><Label className="text-xs text-muted-foreground">{l}</Label><Input value={(form as any)[f] || ""} onChange={e => up(f as keyof Entreprise, e.target.value)} placeholder={p} className={`h-9 ${mono ? "font-mono" : ""}`} /></div>
                  ))}
                </div>
              </div>
            )}
            {tab === "contact" && (
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Contact & Emails</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[{ l: "Téléphone", f: "telephone", p: "05 65 12 34 56" }, { l: "Email professionnel", f: "email", p: "contact@entreprise.fr" }].map(({ l, f, p }) => (
                    <div key={f} className="space-y-1.5"><Label className="text-xs text-muted-foreground">{l}</Label><Input value={(form as any)[f] || ""} onChange={e => up(f as keyof Entreprise, e.target.value)} placeholder={p} className="h-9" /></div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground font-semibold">Email d'envoi des devis *</Label>
                  <Input type="email" value={form.emailEnvoi || ""} onChange={e => up("emailEnvoi", e.target.value)} placeholder="devis@entreprise.fr" className="h-9" />
                  <p className="text-xs text-muted-foreground">Utilisé pour les emails de devis, relances et confirmations.</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-amber-800 mb-1">📧 Comment fonctionne l'envoi ?</p>
                  <p className="text-xs text-amber-700">Les emails s'ouvrent dans votre client mail (Outlook, Gmail) pré-remplis. Vous cliquez "Envoyer". Un historique est conservé dans l'application.</p>
                </div>
                {form.secteur === "tourisme" && (
                  <div className="space-y-4 pt-2 border-t border-border">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Infos arrivée (emails automatiques)</h4>
                    {[{ l: "Code d'accès", f: "codeAcces", p: "Boîte à clé code 1234" }, { l: "WiFi", f: "wifi", p: "Nom: MonWifi / Mdp: 12345" }].map(({ l, f, p }) => (
                      <div key={f} className="space-y-1.5"><Label className="text-xs text-muted-foreground">{l}</Label><Input value={(form as any)[f] || ""} onChange={e => up(f as keyof Entreprise, e.target.value)} placeholder={p} className="h-9" /></div>
                    ))}
                    <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Infos supplémentaires</Label><Textarea rows={3} value={form.infosArrivee || ""} onChange={e => up("infosArrivee", e.target.value)} placeholder="Parking, accueil, règlement..." /></div>
                  </div>
                )}
              </div>
            )}
            {tab === "securite" && (
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Sécurité</h3>
                <div className="bg-secondary/50 rounded-xl p-4 flex items-center gap-3"><Shield className="w-5 h-5 text-primary" /><div><p className="text-sm font-medium">Compte connecté</p><p className="text-xs text-muted-foreground">{authCfg.email}</p></div></div>
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold">Changer le mot de passe</h4>
                  {[{ l: "Mot de passe actuel", v: oldPwd, set: setOldPwd, show: showOld, toggle: () => setShowOld(x => !x) }, { l: "Nouveau mot de passe", v: newPwd, set: setNewPwd, show: showNew, toggle: () => setShowNew(x => !x) }].map(({ l, v, set, show, toggle }) => (
                    <div key={l} className="space-y-1.5"><Label className="text-xs text-muted-foreground">{l}</Label><div className="relative"><Input type={show ? "text" : "password"} value={v} onChange={e => set(e.target.value)} placeholder="••••••••" className="h-9 pr-10" /><button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></div>
                  ))}
                  <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Confirmer nouveau mot de passe</Label><Input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder="Répétez" className="h-9" /></div>
                  <Button onClick={changePwd} size="sm" className="rounded-xl"><CheckCircle2 className="w-4 h-4 mr-1" /> Modifier</Button>
                </div>
              </div>
            )}
            {tab === "devis" && (
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Valeurs par défaut</h3>
                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Acompte par défaut (%)</Label><Input type="number" min={0} max={100} value={form.acompteDefaut || 30} onChange={e => up("acompteDefaut", parseInt(e.target.value) || 30)} className="h-9 font-mono w-32" /></div>
                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Conditions de paiement</Label><Textarea rows={3} value={form.conditionsPaiementDefaut || ""} onChange={e => up("conditionsPaiementDefaut", e.target.value)} /></div>
                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Mentions légales</Label><Textarea rows={4} value={form.mentionsLegalesDefaut || ""} onChange={e => up("mentionsLegalesDefaut", e.target.value)} /><p className="text-xs text-muted-foreground">Pré-remplies sur chaque nouveau devis.</p></div>
              </div>
            )}
            {tab === "secteur" && (
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Secteur d'activité</h3>
                <p className="text-sm text-muted-foreground">Changer de secteur adapte l'interface, les outils et les modèles de devis.</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {SECTEURS.map(s => (
                    <button key={s.id} onClick={() => setForm(x => ({ ...x, secteur: s.id }))}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${form.secteur === s.id ? `${s.colorBorder} ${s.colorLight}` : "border-border bg-secondary/20 hover:border-gray-300"}`}>
                      <span className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-lg shadow-sm`}>{s.emoji}</span>
                      <div className="flex-1"><p className={`text-sm font-semibold ${form.secteur === s.id ? s.colorText : "text-foreground"}`}>{s.label}</p><p className="text-xs text-muted-foreground">{s.description}</p></div>
                      {form.secteur === s.id && <CheckCircle2 className={`w-4 h-4 shrink-0 ${s.colorText}`} />}
                    </button>
                  ))}
                </div>
                <Button onClick={save} className="w-full rounded-xl"><Save className="w-4 h-4 mr-1" /> Sauvegarder le secteur</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
export default Parametres;
