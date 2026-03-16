// src/pages/Reservations.tsx  (Tourisme)
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/components/layout/AppLayout";
import { useReservations, useEntreprise } from "@/hooks/useStore";
import type { Reservation, ResaStatus } from "@/types";
import { fmt } from "@/types";
import { sendEmail, tplConfirmResa, tplInfosPratiques, tplRappelReservation } from "@/lib/email";
import { Plus, Trash2, X, Save, Calendar, Send, Mountain } from "lucide-react";
import { toast } from "sonner";

const ST: Record<ResaStatus, { label: string; bg: string; text: string; border: string }> = {
  option: { label: "Option", bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" },
  confirmee: { label: "Confirmée", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  en_cours: { label: "En cours", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  terminee: { label: "Terminée", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  annulee: { label: "Annulée", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

const vide = (): Reservation => ({ id: crypto.randomUUID(), numero: `R-${new Date().getFullYear()}-${String(Math.floor(Math.random()*999)+1).padStart(3,"0")}`, clientNom: "", clientPrenom: "", clientEmail: "", clientTel: "", hebergement: "", dateArrivee: "", dateDepart: "", nbPersonnes: 2, montantTotal: 0, acompte: 0, acompteRecu: false, soldeSolde: false, status: "option", notes: "", emailConfirmEnvoye: false, emailInfosEnvoye: false });

export default function Reservations() {
  const { entreprise } = useEntreprise();
  const { list, add, update, remove } = useReservations();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Reservation>(vide());
  const [isNew, setIsNew] = useState(true);
  const up = (f: keyof Reservation, v: string | number | boolean) => setForm(x => ({ ...x, [f]: v }));
  const save = () => { if (!form.clientNom || !form.dateArrivee) { toast.error("Champs requis manquants"); return; } if (isNew) add(form); else update(form); toast.success(isNew ? "Réservation créée ✓" : "Mise à jour ✓"); setModal(false); };
  const sendConfirm = (r: Reservation) => {
    if (!r.clientEmail) { toast.error("Email client manquant"); return; }
    const tpl = tplConfirmResa({ clientPrenom: r.clientPrenom || r.clientNom, entreprise: entreprise.raisonSociale, ref: r.numero, arrivee: new Date(r.dateArrivee).toLocaleDateString("fr-FR"), depart: new Date(r.dateDepart).toLocaleDateString("fr-FR"), montant: fmt(r.montantTotal), acompte: fmt(r.acompte), tel: entreprise.telephone });
    sendEmail(r.clientEmail, tpl.subject, tpl.body, "confirmation", r.id);
    update({ ...r, emailConfirmEnvoye: true }); toast.success("Email de confirmation ouvert ✓");
  };
  const sendInfos = (r: Reservation) => {
    if (!r.clientEmail) { toast.error("Email client manquant"); return; }
    const tpl = tplInfosPratiques({ clientPrenom: r.clientPrenom || r.clientNom, entreprise: entreprise.raisonSociale, arrivee: new Date(r.dateArrivee).toLocaleDateString("fr-FR"), adresse: entreprise.adresse + ", " + entreprise.codePostal + " " + entreprise.ville, code: entreprise.codeAcces || "À définir", wifi: entreprise.wifi || "À définir", infos: entreprise.infosArrivee || "", tel: entreprise.telephone });
    sendEmail(r.clientEmail, tpl.subject, tpl.body, "infos", r.id);
    update({ ...r, emailInfosEnvoye: true }); toast.success("Email infos pratiques ouvert ✓");
  };

  return (
    <AppLayout secteur={entreprise.secteur}>
      <div className="max-w-[1200px] mx-auto px-6 py-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-xl font-bold flex items-center gap-2"><Mountain className="w-5 h-5 text-emerald-500" /> Réservations ({list.length})</h1>
          <Button onClick={() => { setForm(vide()); setIsNew(true); setModal(true); }} className="rounded-xl shadow-sm"><Plus className="w-4 h-4 mr-1" /> Nouvelle réservation</Button>
        </div>
        {list.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-white"><Calendar className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" /><p className="text-sm text-muted-foreground">Aucune réservation.</p></div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {list.sort((a, b) => a.dateArrivee.localeCompare(b.dateArrivee)).map(r => {
              const s = ST[r.status];
              return (
                <div key={r.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div><p className="font-bold text-sm">{r.clientPrenom} {r.clientNom}</p><p className="text-xs text-muted-foreground font-mono">{r.numero}</p></div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${s.bg} ${s.text} ${s.border}`}>{s.label}</span>
                  </div>
                  <div className="text-xs space-y-1 mb-3">
                    <p className="text-muted-foreground">🏠 {r.hebergement} · {r.nbPersonnes} pers.</p>
                    <p className="text-muted-foreground">📅 {r.dateArrivee && new Date(r.dateArrivee).toLocaleDateString("fr-FR")} → {r.dateDepart && new Date(r.dateDepart).toLocaleDateString("fr-FR")}</p>
                    <p className="font-bold font-mono">{fmt(r.montantTotal)}<span className="text-muted-foreground font-normal ml-2">Acompte : {fmt(r.acompte)} {r.acompteRecu ? "✓" : "⏳"}</span></p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <button onClick={() => { setForm(r); setIsNew(false); setModal(true); }} className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors font-medium">✏️ Modifier</button>
                    {!r.emailConfirmEnvoye && <button onClick={() => sendConfirm(r)} className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors font-medium"><Send className="w-3 h-3" /> Confirmation</button>}
                    {r.status === "confirmee" && !r.emailInfosEnvoye && <button onClick={() => sendInfos(r)} className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-medium"><Send className="w-3 h-3" /> Infos arrivée</button>}
                    <button onClick={() => { if(window.confirm("Supprimer ?")) { remove(r.id); toast.success("Supprimé"); } }} className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors">🗑️</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {modal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={() => setModal(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg my-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-bold">{isNew ? "Nouvelle réservation" : "Modifier"}</h2><button onClick={() => setModal(false)}><X className="w-5 h-5" /></button></div>
            <div className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                {[{ l: "Nom *", f: "clientNom" }, { l: "Prénom", f: "clientPrenom" }, { l: "Email", f: "clientEmail" }, { l: "Téléphone", f: "clientTel" }, { l: "Hébergement", f: "hebergement", sp: 2 }, { l: "Arrivée *", f: "dateArrivee", t: "date" }, { l: "Départ *", f: "dateDepart", t: "date" }, { l: "Nb personnes", f: "nbPersonnes", t: "number" }, { l: "Montant total (€)", f: "montantTotal", t: "number" }, { l: "Acompte (€)", f: "acompte", t: "number" }].map(({ l, f, t, sp }) => (
                  <div key={f} className={`space-y-1 ${sp ? "sm:col-span-2" : ""}`}><Label className="text-xs text-muted-foreground">{l}</Label><Input type={t || "text"} value={(form as any)[f]} onChange={e => up(f as keyof Reservation, t === "number" ? parseFloat(e.target.value) || 0 : e.target.value)} className="h-9" /></div>
                ))}
                <div className="space-y-1"><Label className="text-xs text-muted-foreground">Statut</Label><select value={form.status} onChange={e => up("status", e.target.value as ResaStatus)} className="w-full h-9 rounded-lg border border-border bg-background text-sm px-2 outline-none">{Object.entries(ST).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
                <div className="space-y-1 flex items-center gap-2 pt-5"><input type="checkbox" id="ar" checked={form.acompteRecu} onChange={e => up("acompteRecu", e.target.checked)} /><Label htmlFor="ar" className="text-xs text-muted-foreground cursor-pointer">Acompte reçu</Label></div>
              </div>
              <Button onClick={save} className="w-full rounded-xl"><Save className="w-4 h-4 mr-1" /> Sauvegarder</Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
