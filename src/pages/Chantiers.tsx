// src/pages/Chantiers.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/components/layout/AppLayout";
import { useChantiers, useEntreprise } from "@/hooks/useStore";
import type { Chantier, ChantierStatus, NoteChantier, MateriauxItem } from "@/types";
import { Plus, Pencil, Trash2, X, Save, Calendar, Users, Package, FileText } from "lucide-react";
import { toast } from "sonner";

const STATUS_CHANTIER: Record<ChantierStatus, { label: string; bg: string; text: string; border: string }> = {
  planifie: { label: "Planifié", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  en_cours: { label: "En cours", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  termine: { label: "Terminé", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  facture: { label: "Facturé", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
};

const vide = (): Chantier => ({ id: crypto.randomUUID(), clientNom: "", adresse: "", status: "planifie", dateDebut: new Date().toISOString().split("T")[0], dateFin: "", nbOuvriers: 1, notes: [], materiaux: [], bonLivraison: "" });

export default function Chantiers() {
  const { entreprise } = useEntreprise();
  const { list, add, update, remove } = useChantiers();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Chantier>(vide());
  const [isNew, setIsNew] = useState(true);
  const [noteInput, setNoteInput] = useState("");
  const [matInput, setMatInput] = useState({ nom: "", quantite: 1, unite: "u" });

  const openNew = () => { setForm(vide()); setIsNew(true); setModal(true); };
  const openEdit = (c: Chantier) => { setForm(c); setIsNew(false); setModal(true); };
  const save = () => {
    if (!form.clientNom) { toast.error("Nom client requis"); return; }
    if (isNew) add(form); else update(form);
    toast.success(isNew ? "Chantier créé ✓" : "Chantier mis à jour ✓");
    setModal(false);
  };
  const addNote = () => {
    if (!noteInput.trim()) return;
    const note: NoteChantier = { id: crypto.randomUUID(), date: new Date().toISOString().split("T")[0], texte: noteInput.trim() };
    setForm(f => ({ ...f, notes: [note, ...f.notes] }));
    setNoteInput("");
  };
  const addMat = () => {
    if (!matInput.nom.trim()) return;
    const mat: MateriauxItem = { id: crypto.randomUUID(), ...matInput, recu: false };
    setForm(f => ({ ...f, materiaux: [...f.materiaux, mat] }));
    setMatInput({ nom: "", quantite: 1, unite: "u" });
  };

  return (
    <AppLayout secteur={entreprise.secteur}>
      <div className="max-w-[1200px] mx-auto px-6 py-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-xl font-bold flex items-center gap-2"><Calendar className="w-5 h-5 text-orange-500" /> Chantiers ({list.length})</h1>
          <Button onClick={openNew} className="rounded-xl shadow-sm"><Plus className="w-4 h-4 mr-1" /> Nouveau chantier</Button>
        </div>

        {/* Grid chantiers */}
        {list.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-white">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-sm text-muted-foreground">Aucun chantier enregistré.</p>
            <Button className="mt-4 rounded-xl" onClick={openNew}><Plus className="w-4 h-4 mr-1" /> Créer un chantier</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {list.map(c => {
              const sc = STATUS_CHANTIER[c.status];
              return (
                <div key={c.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div><p className="font-bold text-sm">{c.clientNom}</p><p className="text-xs text-muted-foreground truncate">{c.adresse}</p></div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>{sc.label}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground"><Calendar className="w-3 h-3" />{new Date(c.dateDebut).toLocaleDateString("fr-FR")}</div>
                    <div className="flex items-center gap-1 text-muted-foreground"><Users className="w-3 h-3" />{c.nbOuvriers} ouvrier{c.nbOuvriers > 1 ? "s" : ""}</div>
                    <div className="flex items-center gap-1 text-muted-foreground"><FileText className="w-3 h-3" />{c.notes.length} note{c.notes.length > 1 ? "s" : ""}</div>
                    <div className="flex items-center gap-1 text-muted-foreground"><Package className="w-3 h-3" />{c.materiaux.filter(m => m.recu).length}/{c.materiaux.length} mat.</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <select value={c.status} onChange={e => update({ ...c, status: e.target.value as ChantierStatus })} className="flex-1 h-8 rounded-lg border border-border bg-background text-xs px-2 outline-none focus:border-primary">
                      {Object.entries(STATUS_CHANTIER).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => { if (window.confirm("Supprimer ?")) { remove(c.id); toast.success("Chantier supprimé"); } }}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={() => setModal(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-xl my-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">{isNew ? "Nouveau chantier" : "Modifier chantier"}</h2>
              <button onClick={() => setModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                {[{ l: "Nom client *", f: "clientNom", p: "M. Dupont" }, { l: "Adresse chantier", f: "adresse", p: "12 rue des Lilas, Rodez" }].map(({ l, f, p }) => (
                  <div key={f} className="space-y-1"><Label className="text-xs text-muted-foreground">{l}</Label><Input value={(form as any)[f]} onChange={e => setForm(x => ({ ...x, [f]: e.target.value }))} placeholder={p} className="h-9" /></div>
                ))}
                {[{ l: "Date début", f: "dateDebut", t: "date" }, { l: "Date fin prévue", f: "dateFin", t: "date" }].map(({ l, f, t }) => (
                  <div key={f} className="space-y-1"><Label className="text-xs text-muted-foreground">{l}</Label><Input type={t} value={(form as any)[f]} onChange={e => setForm(x => ({ ...x, [f]: e.target.value }))} className="h-9" /></div>
                ))}
                <div className="space-y-1"><Label className="text-xs text-muted-foreground">Nb ouvriers</Label><Input type="number" min={1} value={form.nbOuvriers} onChange={e => setForm(x => ({ ...x, nbOuvriers: parseInt(e.target.value) || 1 }))} className="h-9 font-mono w-24" /></div>
                <div className="space-y-1"><Label className="text-xs text-muted-foreground">Statut</Label>
                  <select value={form.status} onChange={e => setForm(x => ({ ...x, status: e.target.value as ChantierStatus }))} className="w-full h-9 rounded-lg border border-border bg-background text-sm px-2 outline-none focus:border-primary">
                    {Object.entries(STATUS_CHANTIER).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
              </div>
              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Notes journalières</Label>
                <div className="flex gap-2"><Textarea rows={2} placeholder="Ajouter une note..." value={noteInput} onChange={e => setNoteInput(e.target.value)} className="flex-1" /><Button size="sm" onClick={addNote} className="h-9 rounded-xl self-end">+</Button></div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {form.notes.map(n => <div key={n.id} className="text-xs bg-secondary/30 rounded-lg px-3 py-2"><span className="text-muted-foreground mr-2">{n.date}</span>{n.texte}</div>)}
                </div>
              </div>
              {/* Matériaux */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Matériaux</Label>
                <div className="flex gap-2">
                  <Input placeholder="Matériau" value={matInput.nom} onChange={e => setMatInput(x => ({ ...x, nom: e.target.value }))} className="h-9 flex-1" />
                  <Input type="number" min={1} value={matInput.quantite} onChange={e => setMatInput(x => ({ ...x, quantite: parseInt(e.target.value) || 1 }))} className="h-9 w-16 font-mono" />
                  <Input placeholder="unité" value={matInput.unite} onChange={e => setMatInput(x => ({ ...x, unite: e.target.value }))} className="h-9 w-16" />
                  <Button size="sm" onClick={addMat} className="h-9 rounded-xl">+</Button>
                </div>
                <div className="space-y-1 max-h-28 overflow-y-auto">
                  {form.materiaux.map(m => (
                    <div key={m.id} className="flex items-center gap-2 text-xs bg-secondary/30 rounded-lg px-3 py-1.5">
                      <input type="checkbox" checked={m.recu} onChange={e => setForm(f => ({ ...f, materiaux: f.materiaux.map(x => x.id === m.id ? { ...x, recu: e.target.checked } : x) }))} className="rounded" />
                      <span className={m.recu ? "line-through text-muted-foreground" : ""}>{m.nom} — {m.quantite} {m.unite}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-1"><Label className="text-xs text-muted-foreground">N° bon de livraison</Label><Input value={form.bonLivraison} onChange={e => setForm(x => ({ ...x, bonLivraison: e.target.value }))} placeholder="BL-2025-001" className="h-9" /></div>
              <Button onClick={save} className="w-full rounded-xl"><Save className="w-4 h-4 mr-1" /> Sauvegarder</Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
