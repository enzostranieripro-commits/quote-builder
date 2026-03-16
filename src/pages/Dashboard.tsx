import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, FileDown, Trash2, Pencil, Search, FileText, Settings } from "lucide-react";
import { useDevisList, useEntreprise } from "@/hooks/useDevis";
import type { DevisStatus } from "@/types/devis";
import { STATUS_LABELS, calculerTotauxDevis, formatMontant } from "@/types/devis";
import { generateDevisPDF } from "@/lib/pdf";
import { toast } from "sonner";

const statusColors: Record<DevisStatus, string> = {
  brouillon: "bg-secondary text-secondary-foreground",
  envoye: "bg-primary/10 text-primary",
  accepte: "bg-accent/10 text-accent",
  refuse: "bg-destructive/10 text-destructive",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { devisList, deleteDevis, updateDevis } = useDevisList();
  const { entreprise } = useEntreprise();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return devisList.filter((d) => {
      const matchSearch =
        !search ||
        d.numero.toLowerCase().includes(search.toLowerCase()) ||
        d.client.nom.toLowerCase().includes(search.toLowerCase()) ||
        d.client.societe.toLowerCase().includes(search.toLowerCase()) ||
        d.objet.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || d.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [devisList, search, statusFilter]);

  const handleDelete = (id: string) => {
    if (window.confirm("Supprimer ce devis ?")) {
      deleteDevis(id);
      toast.success("Devis supprimé");
    }
  };

  const handleStatusChange = (id: string, status: DevisStatus) => {
    const devis = devisList.find((d) => d.id === id);
    if (devis) {
      updateDevis({ ...devis, status });
      toast.success(`Statut mis à jour : ${STATUS_LABELS[status]}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-foreground" strokeWidth={1.5} />
            </div>
            <span className="text-lg font-semibold text-foreground tracking-tight">DevisPro</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/parametres")}>
              <Settings className="w-4 h-4 mr-1" /> Paramètres
            </Button>
            <Button size="sm" onClick={() => navigate("/devis/nouveau")}>
              <Plus className="w-4 h-4 mr-1" /> Nouveau devis
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {(["brouillon", "envoye", "accepte", "refuse"] as DevisStatus[]).map((status) => {
            const count = devisList.filter((d) => d.status === status).length;
            return (
              <div key={status} className="bg-card border border-border rounded-xl p-4 shadow-card">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{STATUS_LABELS[status]}</p>
                <p className="text-2xl font-bold text-foreground font-mono mt-1">{count}</p>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Rechercher par n°, client, objet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-xl">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">
              {devisList.length === 0 ? "Aucun devis pour le moment." : "Aucun résultat."}
            </p>
            {devisList.length === 0 && (
              <Button className="mt-4" onClick={() => navigate("/devis/nouveau")}>
                <Plus className="w-4 h-4 mr-1" /> Créer mon premier devis
              </Button>
            )}
          </div>
        ) : (
          <div className="border border-border rounded-xl overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50 text-xs text-muted-foreground uppercase tracking-wider">
                    <th className="text-left px-4 py-3 font-medium">N° Devis</th>
                    <th className="text-left px-4 py-3 font-medium">Client</th>
                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Objet</th>
                    <th className="text-left px-4 py-3 font-medium">Date</th>
                    <th className="text-right px-4 py-3 font-medium">Montant TTC</th>
                    <th className="text-center px-4 py-3 font-medium">Statut</th>
                    <th className="text-right px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((devis) => {
                    const { totalTTC } = calculerTotauxDevis(devis.lignes);
                    const clientDisplay = devis.client.societe || `${devis.client.prenom} ${devis.client.nom}`.trim() || "—";
                    return (
                      <tr key={devis.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 font-mono font-medium text-foreground">{devis.numero}</td>
                        <td className="px-4 py-3 text-foreground">{clientDisplay}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell max-w-[200px] truncate">{devis.objet || "—"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{new Date(devis.dateCreation).toLocaleDateString("fr-FR")}</td>
                        <td className="px-4 py-3 text-right font-mono font-medium text-foreground">{formatMontant(totalTTC)}</td>
                        <td className="px-4 py-3 text-center">
                          <Select value={devis.status} onValueChange={(v) => handleStatusChange(devis.id, v as DevisStatus)}>
                            <SelectTrigger className={`h-7 text-xs border-0 w-auto inline-flex ${statusColors[devis.status]}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                                <SelectItem key={k} value={k} className="text-xs">{v}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/devis/nouveau?id=${devis.id}`)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => generateDevisPDF(devis, entreprise)}>
                              <FileDown className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(devis.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
