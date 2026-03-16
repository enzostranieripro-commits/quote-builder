// src/pages/DevisList.tsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AppLayout from "@/components/layout/AppLayout";
import { useDevis, useEntreprise } from "@/hooks/useStore";
import { calcTotaux, fmt, STATUS_LABELS, STATUS_COLORS, type DevisStatus } from "@/types";
import { generateDevisPDF } from "@/lib/pdf";
import { sendEmail, tplRelance } from "@/lib/email";
import { Plus, FileDown, Trash2, Pencil, Search, FileText, LayoutKanban, List, Send } from "lucide-react";
import { toast } from "sonner";

export default function DevisList() {
  const navigate = useNavigate();
  const { list, remove, update } = useDevis();
  const { entreprise } = useEntreprise();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView] = useState<"kanban" | "liste">("kanban");

  const filtered = useMemo(() => list.filter(d => {
    const q = search.toLowerCase();
    const ms = !search || d.numero.toLowerCase().includes(q) || d.client.nom.toLowerCase().includes(q) || d.client.societe.toLowerCase().includes(q) || d.objet.toLowerCase().includes(q);
    return ms && (statusFilter === "all" || d.status === statusFilter);
  }), [list, search, statusFilter]);

  const handleDelete = (id: string) => { if (window.confirm("Supprimer ce devis ?")) { remove(id); toast.success("Devis supprimé"); } };

  const handleRelance = (id: string) => {
    const d = list.find(x => x.id === id);
    if (!d || !d.client.email) { toast.error("Email client manquant"); return; }
    const { totalTTC } = calcTotaux(d.lignes);
    const tpl = tplRelance({ clientPrenom: d.client.prenom || d.client.nom, entreprise: entreprise.raisonSociale, numero: d.numero, objet: d.objet, montant: fmt(totalTTC), validite: new Date(d.dateValidite).toLocaleDateString("fr-FR"), tel: entreprise.telephone });
    sendEmail(d.client.email, tpl.subject, tpl.body, "relance", d.id);
    update({ ...d, dateRelance: new Date().toISOString().split("T")[0] });
    toast.success("Email de relance ouvert ✓");
  };

  const cols: { status: DevisStatus; label: string }[] = [{ status: "brouillon", label: "Brouillons" }, { status: "envoye", label: "Envoyés" }, { status: "accepte", label: "Acceptés" }, { status: "refuse", label: "Refusés" }];

  return (
    <AppLayout secteur={entreprise.secteur}>
      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-xl font-bold flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Devis ({list.length})</h1>
          <Button onClick={() => navigate("/devis/nouveau")} className="rounded-xl shadow-sm"><Plus className="w-4 h-4 mr-1" /> Nouveau devis</Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-10 bg-white rounded-xl" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-white border border-border rounded-xl overflow-hidden">
              {[{ v: "all", l: "Tous" }, ...Object.entries(STATUS_LABELS).map(([v, l]) => ({ v, l }))].map(({ v, l }) => (
                <button key={v} onClick={() => setStatusFilter(v)} className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${statusFilter === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary/50"}`}>{l}</button>
              ))}
            </div>
            <div className="flex bg-white border border-border rounded-xl overflow-hidden">
              <button onClick={() => setView("kanban")} className={`p-2.5 transition-colors ${view === "kanban" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary/50"}`}><LayoutKanban className="w-4 h-4" /></button>
              <button onClick={() => setView("liste")} className={`p-2.5 transition-colors ${view === "liste" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary/50"}`}><List className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Kanban */}
        {view === "kanban" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {cols.map(col => {
              const colDevis = filtered.filter(d => d.status === col.status);
              const c = STATUS_COLORS[col.status];
              return (
                <div key={col.status} className="flex flex-col gap-3">
                  <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl border ${c.bg} ${c.border}`}>
                    <span className={`text-sm font-bold ${c.text}`}>{col.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono ${c.text}`}>{fmt(colDevis.reduce((s, d) => s + calcTotaux(d.lignes).totalTTC, 0))}</span>
                      <span className={`w-5 h-5 rounded-full ${c.dot} text-white text-[10px] font-bold flex items-center justify-center`}>{colDevis.length}</span>
                    </div>
                  </div>
                  <div className="space-y-3 min-h-[100px]">
                    {colDevis.length === 0 && <div className="text-center py-8 border border-dashed border-border/60 rounded-xl"><p className="text-xs text-muted-foreground">Aucun devis</p></div>}
                    {colDevis.map(d => {
                      const { totalTTC } = calcTotaux(d.lignes);
                      const clientNom = d.client.societe || `${d.client.prenom} ${d.client.nom}`.trim() || "—";
                      return (
                        <div key={d.id} className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-all group">
                          <div className="flex items-start justify-between mb-2"><span className="text-xs font-mono text-muted-foreground">{d.numero}</span></div>
                          <p className="font-semibold text-sm truncate mb-1">{clientNom}</p>
                          {d.objet && <p className="text-xs text-muted-foreground truncate mb-3">{d.objet}</p>}
                          <p className="text-base font-bold font-mono mb-3">{fmt(totalTTC)}</p>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => navigate(`/devis/${d.id}`)} className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"><Pencil className="w-3 h-3" /> Modifier</button>
                            <button onClick={() => generateDevisPDF(d, entreprise as any)} className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"><FileDown className="w-3.5 h-3.5" /></button>
                            {d.status === "envoye" && <button onClick={() => handleRelance(d.id)} className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 transition-colors"><Send className="w-3.5 h-3.5" /></button>}
                            <button onClick={() => handleDelete(d.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Liste */}
        {view === "liste" && (
          filtered.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-white">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-sm text-muted-foreground">{list.length === 0 ? "Aucun devis pour le moment." : "Aucun résultat."}</p>
              {list.length === 0 && <Button className="mt-4 rounded-xl" onClick={() => navigate("/devis/nouveau")}><Plus className="w-4 h-4 mr-1" /> Créer mon premier devis</Button>}
            </div>
          ) : (
            <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/40 text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
                      {["N° Devis", "Client", "Objet", "Date", "Montant TTC", "Statut", "Actions"].map(h => <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map(d => {
                      const { totalTTC } = calcTotaux(d.lignes);
                      const c = STATUS_COLORS[d.status];
                      return (
                        <tr key={d.id} className="hover:bg-secondary/20 transition-colors">
                          <td className="px-5 py-3.5 font-mono font-bold text-xs">{d.numero}</td>
                          <td className="px-5 py-3.5 font-medium">{d.client.societe || `${d.client.prenom} ${d.client.nom}`.trim() || "—"}</td>
                          <td className="px-5 py-3.5 text-muted-foreground text-xs max-w-[150px] truncate">{d.objet || "—"}</td>
                          <td className="px-5 py-3.5 text-muted-foreground text-xs">{new Date(d.dateCreation).toLocaleDateString("fr-FR")}</td>
                          <td className="px-5 py-3.5 font-mono font-bold">{fmt(totalTTC)}</td>
                          <td className="px-5 py-3.5"><span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${c.bg} ${c.text} ${c.border}`}>{STATUS_LABELS[d.status]}</span></td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate(`/devis/${d.id}`)}><Pencil className="w-3.5 h-3.5" /></Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => generateDevisPDF(d, entreprise as any)}><FileDown className="w-3.5 h-3.5" /></Button>
                              {d.status === "envoye" && <Button variant="ghost" size="icon" className="h-7 w-7 text-amber-500 hover:text-amber-600" onClick={() => handleRelance(d.id)}><Send className="w-3.5 h-3.5" /></Button>}
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(d.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </div>
    </AppLayout>
  );
}
