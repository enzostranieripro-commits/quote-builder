// src/pages/Clients.tsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/layout/AppLayout";
import { useDevis, useEntreprise } from "@/hooks/useStore";
import { calcTotaux, fmt, STATUS_COLORS, STATUS_LABELS } from "@/types";
import { Users, ArrowRight, FileText, TrendingUp } from "lucide-react";

export default function Clients() {
  const navigate = useNavigate();
  const { entreprise } = useEntreprise();
  const { list: devis } = useDevis();

  const clients = useMemo(() => {
    const map = new Map<string, { key: string; nom: string; societe: string; email: string; tel: string; devis: typeof devis }>();
    devis.forEach(d => {
      const key = d.client.email || `${d.client.nom}_${d.client.prenom}`;
      if (!key) return;
      if (!map.has(key)) map.set(key, { key, nom: `${d.client.prenom} ${d.client.nom}`.trim(), societe: d.client.societe, email: d.client.email, tel: d.client.telephone, devis: [] });
      map.get(key)!.devis.push(d);
    });
    return Array.from(map.values()).sort((a, b) => a.nom.localeCompare(b.nom));
  }, [devis]);

  return (
    <AppLayout secteur={entreprise.secteur}>
      <div className="max-w-[1200px] mx-auto px-6 py-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-xl font-bold flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> Clients ({clients.length})</h1>
        </div>
        {clients.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-white">
            <Users className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-sm text-muted-foreground">Aucun client pour le moment.</p>
            <p className="text-xs text-muted-foreground mt-1">Les clients apparaissent automatiquement depuis vos devis.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {clients.map(client => {
              const totalCA = client.devis.filter(d => d.status === "accepte").reduce((s, d) => s + calcTotaux(d.lignes).totalTTC, 0);
              const lastDevis = client.devis.sort((a, b) => b.dateCreation.localeCompare(a.dateCreation))[0];
              return (
                <div key={client.key} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-sm">{client.societe || client.nom}</p>
                      {client.societe && <p className="text-xs text-muted-foreground">{client.nom}</p>}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <TrendingUp className="w-3 h-3" />{fmt(totalCA)}
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground mb-4">
                    {client.email && <p>✉️ {client.email}</p>}
                    {client.tel && <p>📞 {client.tel}</p>}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <FileText className="w-3.5 h-3.5" />
                      {client.devis.length} devis
                    </div>
                    {lastDevis && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[lastDevis.status].bg} ${STATUS_COLORS[lastDevis.status].text} ${STATUS_COLORS[lastDevis.status].border}`}>
                        Dernier : {STATUS_LABELS[lastDevis.status]}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {client.devis.slice(0, 3).map(d => (
                      <button key={d.id} onClick={() => navigate(`/devis/${d.id}`)} className="w-full flex items-center justify-between text-xs p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                        <span className="font-mono font-bold">{d.numero}</span>
                        <div className="flex items-center gap-2">
                          <span>{fmt(calcTotaux(d.lignes).totalTTC)}</span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        </div>
                      </button>
                    ))}
                  </div>
                  {client.devis.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center mt-2">+{client.devis.length - 3} devis</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
