// src/pages/Alertes.tsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { useDevis, useEntreprise, useReservations, useStock } from "@/hooks/useStore";
import { getEmailHistory } from "@/lib/email";
import { calcTotaux, fmt } from "@/types";
import { Bell, Clock, Calendar, Euro, AlertTriangle, Package, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

interface Alerte { id: string; type: string; titre: string; message: string; path: string; priorite: "haute" | "normale"; }

export default function Alertes() {
  const navigate = useNavigate();
  const { entreprise } = useEntreprise();
  const { list: devis } = useDevis();
  const { list: reservations } = useReservations();
  const { alertes: stockAlertes } = useStock();
  const emailHistory = getEmailHistory();

  const alertes: Alerte[] = useMemo(() => {
    const a: Alerte[] = [];
    const aujourd = new Date(); aujourd.setHours(0, 0, 0, 0);

    // Devis envoyés sans réponse 7j
    devis.filter(d => d.status === "envoye" && d.dateEnvoi).forEach(d => {
      const diff = Math.floor((aujourd.getTime() - new Date(d.dateEnvoi!).getTime()) / 86400000);
      if (diff >= 7) a.push({ id: `relance-${d.id}`, type: "relance", titre: `Relance recommandée`, message: `${d.numero} — ${d.client.societe || d.client.nom} — ${diff} jours sans réponse`, path: `/devis/${d.id}`, priorite: diff >= 14 ? "haute" : "normale" });
    });

    // Devis acceptés sans chantier planifié
    devis.filter(d => d.status === "accepte" && !d.chantierPlanifie).forEach(d => {
      a.push({ id: `chantier-${d.id}`, type: "chantier", titre: "Chantier à planifier", message: `${d.numero} — ${d.client.societe || d.client.nom} — ${fmt(calcTotaux(d.lignes).totalTTC)}`, path: `/devis/${d.id}`, priorite: "normale" });
    });

    // Acomptes manquants
    devis.filter(d => d.status === "accepte" && !d.acompteRecu && d.conditions.acomptePercent > 0).forEach(d => {
      const montant = calcTotaux(d.lignes).totalTTC * (d.conditions.acomptePercent / 100);
      a.push({ id: `acompte-${d.id}`, type: "acompte", titre: "Acompte en attente", message: `${d.numero} — ${d.client.nom} — ${fmt(montant)} (${d.conditions.acomptePercent}%)`, path: `/devis/${d.id}`, priorite: "normale" });
    });

    // Réservations tourisme : acompte manquant
    reservations.filter(r => r.status === "confirmee" && !r.acompteRecu).forEach(r => {
      a.push({ id: `resa-acompte-${r.id}`, type: "acompte", titre: "Acompte réservation en attente", message: `${r.numero} — ${r.clientPrenom} ${r.clientNom} — arrivée ${new Date(r.dateArrivee).toLocaleDateString("fr-FR")}`, path: "/reservations", priorite: "normale" });
    });

    // Réservations dans 2 jours sans email infos
    const in2 = new Date(aujourd); in2.setDate(in2.getDate() + 2);
    reservations.filter(r => r.status === "confirmee" && !r.emailInfosEnvoye && new Date(r.dateArrivee) <= in2 && new Date(r.dateArrivee) >= aujourd).forEach(r => {
      a.push({ id: `infos-${r.id}`, type: "expiration", titre: "Infos pratiques à envoyer", message: `${r.clientPrenom} ${r.clientNom} arrive dans moins de 2 jours — Email infos non envoyé`, path: "/reservations", priorite: "haute" });
    });

    // Stock bas
    stockAlertes.forEach(p => {
      a.push({ id: `stock-${p.id}`, type: "stock", titre: "Stock bas", message: `${p.nom} — ${p.quantite} ${p.unite} restant${p.quantite > 1 ? "s" : ""} (min: ${p.quantiteMin})`, path: "/stock", priorite: p.quantite === 0 ? "haute" : "normale" });
    });

    return a.sort((a, b) => (a.priorite === "haute" ? -1 : 1) - (b.priorite === "haute" ? -1 : 1));
  }, [devis, reservations, stockAlertes]);

  const iconMap: Record<string, React.ElementType> = { relance: Clock, chantier: Calendar, acompte: Euro, expiration: AlertTriangle, stock: Package };
  const colorMap: Record<string, string> = {
    relance: "text-amber-500 bg-amber-50 border-amber-200",
    chantier: "text-blue-500 bg-blue-50 border-blue-200",
    acompte: "text-emerald-500 bg-emerald-50 border-emerald-200",
    expiration: "text-red-500 bg-red-50 border-red-200",
    stock: "text-purple-500 bg-purple-50 border-purple-200",
  };

  return (
    <AppLayout secteur={entreprise.secteur} alertesCount={alertes.length}>
      <div className="max-w-[900px] mx-auto px-6 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold">Alertes & Notifications</h1>
          {alertes.length > 0 && <span className="w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{alertes.length}</span>}
        </div>

        {/* Alertes actives */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 border-b border-border bg-secondary/30">
            <h3 className="text-sm font-bold">Alertes actives ({alertes.length})</h3>
          </div>
          <div className="divide-y divide-border">
            {alertes.length === 0 && (
              <div className="flex flex-col items-center py-12 gap-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                <p className="text-sm text-muted-foreground">Aucune alerte — tout est à jour ! 🎉</p>
              </div>
            )}
            {alertes.map(a => {
              const Icon = iconMap[a.type] || AlertTriangle;
              const isHaute = a.priorite === "haute";
              return (
                <button key={a.id} onClick={() => navigate(a.path)} className={`w-full flex items-start gap-4 px-5 py-4 hover:bg-secondary/30 transition-colors text-left ${isHaute ? "bg-red-50/30" : ""}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${colorMap[a.type]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold">{a.titre}</p>
                      {isHaute && <span className="text-[10px] font-bold bg-red-100 text-red-600 border border-red-200 px-1.5 py-0.5 rounded-full">Urgent</span>}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{a.message}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Historique emails */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 border-b border-border bg-secondary/30">
            <h3 className="text-sm font-bold flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> Historique emails envoyés ({emailHistory.length})</h3>
          </div>
          <div className="divide-y divide-border max-h-80 overflow-y-auto">
            {emailHistory.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Aucun email envoyé</p>}
            {emailHistory.map(e => (
              <div key={e.id} className="px-5 py-3 flex items-start gap-3">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold truncate">{e.subject}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0">{new Date(e.date).toLocaleDateString("fr-FR")}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">→ {e.to}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
