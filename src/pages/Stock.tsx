// src/pages/Stock.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/components/layout/AppLayout";
import { useStock, useEntreprise } from "@/hooks/useStore";
import type { ProduitStock } from "@/types";
import { fmt } from "@/types";
import { Plus, Pencil, Trash2, X, Save, Package, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const vide = (): ProduitStock => ({ id: crypto.randomUUID(), nom: "", reference: "", categorie: "Général", quantite: 0, quantiteMin: 5, unite: "u", prixAchat: 0, prixVente: 0, fournisseur: "" });

export default function Stock() {
  const { entreprise } = useEntreprise();
  const { list, add, update, remove, alertes } = useStock();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<ProduitStock>(vide());
  const [isNew, setIsNew] = useState(true);
  const [search, setSearch] = useState("");
  const up = (f: keyof ProduitStock, v: string | number) => setForm(x => ({ ...x, [f]: v }));
  const filtered = list.filter(p => !search || p.nom.toLowerCase().includes(search.toLowerCase()) || p.reference.toLowerCase().includes(search.toLowerCase()));
  const save = () => { if (!form.nom) { toast.error("Nom requis"); return; } if (isNew) add(form); else update(form); toast.success(isNew ? "Produit créé ✓" : "Mis à jour ✓"); setModal(false); };

  return (
    <AppLayout secteur={entreprise.secteur}>
      <div className="max-w-[1200px] mx-auto px-6 py-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-xl font-bold flex items-center gap-2"><Package className="w-5 h-5 text-purple-500" /> Stock ({list.length})</h1>
          <Button onClick={() => { setForm(vide()); setIsNew(true); setModal(true); }} className="rounded-xl shadow-sm"><Plus className="w-4 h-4 mr-1" /> Nouveau produit</Button>
        </div>
        {alertes.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div><p className="text-sm font-bold text-amber-800">Stock bas — {alertes.length} produit{alertes.length > 1 ? "s" : ""} à réapprovisionner</p><p className="text-xs text-amber-700">{alertes.map(p => p.nom).join(", ")}</p></div>
          </div>
        )}
        <div className="relative"><Input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm bg-white rounded-xl" /></div>
        {filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-white"><Package className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" /><p className="text-sm text-muted-foreground">Aucun produit en stock.</p></div>
        ) : (
          <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead><tr className="bg-secondary/40 text-xs text-muted-foreground uppercase tracking-wider border-b border-border">{["Produit", "Réf.", "Qté", "Min", "P. Achat", "P. Vente", "Fournisseur", ""].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-border">
                {filtered.map(p => {
                  const low = p.quantite <= p.quantiteMin;
                  return (
                    <tr key={p.id} className={`hover:bg-secondary/20 transition-colors ${low ? "bg-amber-50/50" : ""}`}>
                      <td className="px-5 py-3.5"><div className="flex items-center gap-2">{low && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}<div><p className="font-medium">{p.nom}</p><p className="text-xs text-muted-foreground">{p.categorie}</p></div></div></td>
                      <td className="px-5 py-3.5 font-mono text-xs">{p.reference || "—"}</td>
                      <td className={`px-5 py-3.5 font-bold font-mono ${low ? "text-amber-600" : "text-foreground"}`}>{p.quantite} {p.unite}</td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{p.quantiteMin}</td>
                      <td className="px-5 py-3.5 font-mono text-xs">{fmt(p.prixAchat)}</td>
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold">{fmt(p.prixVente)}</td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{p.fournisseur || "—"}</td>
                      <td className="px-5 py-3.5"><div className="flex gap-1"><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setForm(p); setIsNew(false); setModal(true); }}><Pencil className="w-3.5 h-3.5" /></Button><Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => { if(window.confirm("Supprimer ?")) { remove(p.id); toast.success("Supprimé"); } }}><Trash2 className="w-3.5 h-3.5" /></Button></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={() => setModal(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg my-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-bold">{isNew ? "Nouveau produit" : "Modifier"}</h2><button onClick={() => setModal(false)}><X className="w-5 h-5" /></button></div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[{ l: "Nom *", f: "nom" }, { l: "Référence", f: "reference" }, { l: "Catégorie", f: "categorie" }, { l: "Fournisseur", f: "fournisseur" }, { l: "Unité", f: "unite" }, { l: "Quantité", f: "quantite", t: "number" }, { l: "Quantité min.", f: "quantiteMin", t: "number" }, { l: "Prix achat (€)", f: "prixAchat", t: "number" }, { l: "Prix vente (€)", f: "prixVente", t: "number" }].map(({ l, f, t }) => (
                <div key={f} className="space-y-1"><Label className="text-xs text-muted-foreground">{l}</Label><Input type={t || "text"} value={(form as any)[f]} onChange={e => up(f as keyof ProduitStock, t === "number" ? parseFloat(e.target.value) || 0 : e.target.value)} className="h-9" /></div>
              ))}
            </div>
            <Button onClick={save} className="w-full rounded-xl mt-4"><Save className="w-4 h-4 mr-1" /> Sauvegarder</Button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
