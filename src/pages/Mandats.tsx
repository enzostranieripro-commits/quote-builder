// src/pages/Mandats.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/components/layout/AppLayout";
import { useMandats, useEntreprise } from "@/hooks/useStore";
import type { Mandat, MandatStatus } from "@/types";
import { fmt } from "@/types";
import { Plus, Pencil, Trash2, X, Save, Home } from "lucide-react";
import { toast } from "sonner";

const ST: Record<MandatStatus, { label: string; bg: string; text: string; border: string }> = {
  actif: { label: "Actif", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  compromis: { label: "Compromis", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  vendu: { label: "Vendu", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  loue: { label: "Loué", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  expire: { label: "Expiré", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  resilie: { label: "Résilié", bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" },
};

const vide = (): Mandat => ({ id: crypto.randomUUID(), numero: `M-${new Date().getFullYear()}-${String(Math.floor(Math.random()*999)+1).padStart(3,"0")}`, type: "vente", status: "actif", adresse: "", ville: "", surface: 0, nbPieces: 0, prix: 0, proprietaireNom: "", proprietaireTel: "", proprietaireEmail: "", dateMandat: new Date().toISOString().split("T")[0], dateExpiration: new Date(Date.now()+90*86400000).toISOString().split("T")[0], honoraires: 0, notes: "" });

export default function Mandats() {
  const { entreprise } = useEntreprise();
  const { list, add, update, remove } = useMandats();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Mandat>(vide());
  const [isNew, setIsNew] = useState(true);
  const up = (f: keyof Mandat, v: string | number) => setForm(x => ({ ...x, [f]: v }));
  const openNew = () => { setForm(vide()); setIsNew(true); setModal(true); };
  const save = () => { if (!form.adresse) { toast.error("Adresse requise"); return; } if (isNew) add(form); else update(form); toast.success(isNew ? "Mandat créé ✓" : "Mis à jour ✓"); setModal(false); };

  return (
    <AppLayout secteur={entreprise.secteur}>
      <div className="max-w-[1200px] mx-auto px-6 py-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-xl font-bold flex items-center gap-2"><Home className="w-5 h-5 text-blue-500" /> Mandats ({list.length})</h1>
          <Button onClick={openNew} className="rounded-xl shadow-sm"><Plus className="w-4 h-4 mr-1" /> Nouveau mandat</Button>
        </div>
        {list.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-white"><Home className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" /><p className="text-sm text-muted-foreground">Aucun mandat.</p><Button className="mt-4 rounded-xl" onClick={openNew}><Plus className="w-4 h-4 mr-1" /> Créer</Button></div>
        ) : (
          <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead><tr className="bg-secondary/40 text-xs text-muted-foreground uppercase tracking-wider border-b border-border">{["N°", "Bien", "Type", "Prix", "Propriétaire", "Expiration", "Statut", ""].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-border">
                {list.map(m => { const s = ST[m.status]; return (
                  <tr key={m.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-xs">{m.numero}</td>
                    <td className="px-5 py-3.5"><p className="font-medium text-sm">{m.adresse}</p><p className="text-xs text-muted-foreground">{m.ville} · {m.surface}m² · {m.nbPieces}p</p></td>
                    <td className="px-5 py-3.5"><span className="text-xs font-semibold">{m.type === "vente" ? "Vente" : "Location"}</span></td>
                    <td className="px-5 py-3.5 font-mono font-bold">{fmt(m.prix)}</td>
                    <td className="px-5 py-3.5 text-sm">{m.proprietaireNom}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{new Date(m.dateExpiration).toLocaleDateString("fr-FR")}</td>
                    <td className="px-5 py-3.5"><span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${s.bg} ${s.text} ${s.border}`}>{s.label}</span></td>
                    <td className="px-5 py-3.5"><div className="flex gap-1"><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setForm(m); setIsNew(false); setModal(true); }}><Pencil className="w-3.5 h-3.5" /></Button><Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => { if(window.confirm("Supprimer ?")) { remove(m.id); toast.success("Supprimé"); } }}><Trash2 className="w-3.5 h-3.5" /></Button></div></td>
                  </tr>
                ); })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={() => setModal(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg my-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-bold">{isNew ? "Nouveau mandat" : "Modifier"}</h2><button onClick={() => setModal(false)}><X className="w-5 h-5" /></button></div>
            <div className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                {[{ l: "N° Mandat", f: "numero" }, { l: "Adresse *", f: "adresse" }, { l: "Ville", f: "ville" }, { l: "Surface (m²)", f: "surface", t: "number" }, { l: "Nb pièces", f: "nbPieces", t: "number" }, { l: "Prix (€)", f: "prix", t: "number" }, { l: "Honoraires (€)", f: "honoraires", t: "number" }, { l: "Propriétaire", f: "proprietaireNom" }, { l: "Tel propriétaire", f: "proprietaireTel" }, { l: "Email propriétaire", f: "proprietaireEmail" }, { l: "Date mandat", f: "dateMandat", t: "date" }, { l: "Date expiration", f: "dateExpiration", t: "date" }].map(({ l, f, t }) => (
                  <div key={f} className="space-y-1"><Label className="text-xs text-muted-foreground">{l}</Label><Input type={t || "text"} value={(form as any)[f]} onChange={e => up(f as keyof Mandat, t === "number" ? parseFloat(e.target.value) || 0 : e.target.value)} className="h-9" /></div>
                ))}
                <div className="space-y-1"><Label className="text-xs text-muted-foreground">Type</Label><select value={form.type} onChange={e => up("type", e.target.value)} className="w-full h-9 rounded-lg border border-border bg-background text-sm px-2 outline-none"><option value="vente">Vente</option><option value="location">Location</option></select></div>
                <div className="space-y-1"><Label className="text-xs text-muted-foreground">Statut</Label><select value={form.status} onChange={e => up("status", e.target.value)} className="w-full h-9 rounded-lg border border-border bg-background text-sm px-2 outline-none">{Object.entries(ST).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
              </div>
              <Button onClick={save} className="w-full rounded-xl"><Save className="w-4 h-4 mr-1" /> Sauvegarder</Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
