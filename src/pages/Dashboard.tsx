// src/pages/Dashboard.tsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/layout/AppLayout";
import { useDevis, useEntreprise, useChantiers, useMandats, useReservations, useReservationsResto, useStock, useCommandesClients } from "@/hooks/useStore";
import { calcTotaux, fmt, STATUS_LABELS, STATUS_COLORS, type SecteurId } from "@/types";
import { Plus, FileText, Calendar, TrendingUp, Clock, Euro, AlertTriangle, CheckCircle2, Package, Users, ArrowRight, Paintbrush, Home, UtensilsCrossed, Mountain, Wrench } from "lucide-react";

const Kpi = ({ label, value, icon: I, color, bg, border }: { label: string; value: string; icon: React.ElementType; color: string; bg: string; border: string }) => (
  <div className={`rounded-2xl border ${border} ${bg} p-5`}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider leading-none">{label}</span>
      <I className={`w-4 h-4 ${color} shrink-0`} />
    </div>
    <p className={`text-2xl font-bold font-mono ${color}`}>{value}</p>
  </div>
);

const AlertBtn = ({ msg, type, onClick }: { msg: string; type: string; onClick: () => void }) => {
  const map: Record<string, string> = { relance: "text-amber-600 bg-amber-50 border-amber-200", chantier: "text-blue-600 bg-blue-50 border-blue-200", acompte: "text-emerald-600 bg-emerald-50 border-emerald-200", expiration: "text-red-600 bg-red-50 border-red-200", stock: "text-purple-600 bg-purple-50 border-purple-200" };
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-2 p-3 rounded-xl border text-left hover:opacity-80 transition-opacity ${map[type] || "text-gray-600 bg-gray-50 border-gray-200"}`}>
      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
      <p className="text-xs font-medium flex-1 truncate">{msg}</p>
      <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
    </button>
  );
};

// ── Peinture ──
const DBPeinture = () => {
  const navigate = useNavigate();
  const { list: devis } = useDevis();
  const { list: chantiers } = useChantiers();
  const acceptes = devis.filter(d => d.status === "accepte");
  const envoyes = devis.filter(d => d.status === "envoye");
  const caAccepte = acceptes.reduce((s, d) => s + calcTotaux(d.lignes).totalTTC, 0);
  const acomptesAttente = acceptes.filter(d => !d.acompteRecu).length;
  const today = new Date(); today.setHours(0,0,0,0);
  const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7);
  const chantiersWeek = chantiers.filter(c => { const d = new Date(c.dateDebut); return d >= today && d <= nextWeek; });
  const alertes = useMemo(() => {
    const a: { msg: string; type: string; path: string }[] = [];
    envoyes.forEach(d => { if (!d.dateEnvoi) return; const diff = Math.floor((Date.now() - new Date(d.dateEnvoi).getTime()) / 86400000); if (diff >= 7) a.push({ msg: `${d.numero} — Relance (${diff}j sans réponse)`, type: "relance", path: `/devis/${d.id}` }); });
    acceptes.filter(d => !d.acompteRecu).forEach(d => a.push({ msg: `${d.numero} — Acompte ${d.conditions.acomptePercent}% en attente`, type: "acompte", path: `/devis/${d.id}` }));
    acceptes.filter(d => !d.chantierPlanifie).forEach(d => a.push({ msg: `${d.numero} — Chantier à planifier`, type: "chantier", path: "/chantiers" }));
    return a.slice(0, 6);
  }, [devis]);
  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold flex items-center gap-2"><Paintbrush className="w-5 h-5 text-orange-500" /> Tableau de bord Peinture / BTP</h1>
          <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p></div>
        <Button onClick={() => navigate("/devis/nouveau")} className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 border-0 shadow-sm text-white">
          <Plus className="w-4 h-4 mr-1" /> Nouveau devis
        </Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Devis en cours" value={String(envoyes.length)} icon={FileText} color="text-blue-600" bg="bg-blue-50" border="border-blue-100" />
        <Kpi label="CA accepté" value={fmt(caAccepte)} icon={TrendingUp} color="text-emerald-600" bg="bg-emerald-50" border="border-emerald-100" />
        <Kpi label="Chantiers (7j)" value={String(chantiersWeek.length)} icon={Calendar} color="text-orange-600" bg="bg-orange-50" border="border-orange-100" />
        <Kpi label="Acomptes en attente" value={String(acomptesAttente)} icon={Euro} color="text-amber-600" bg="bg-amber-50" border="border-amber-100" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Alertes ({alertes.length})</h3>
          <div className="space-y-2">{alertes.length === 0 ? <p className="text-sm text-muted-foreground text-center py-6">Aucune alerte 🎉</p> : alertes.map((a, i) => <AlertBtn key={i} msg={a.msg} type={a.type} onClick={() => navigate(a.path)} />)}</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Derniers devis</h3>
            <button onClick={() => navigate("/devis")} className="text-xs text-primary hover:underline">Voir tous →</button>
          </div>
          <div className="space-y-2">
            {devis.slice(0, 5).map(d => { const c = STATUS_COLORS[d.status]; return (
              <button key={d.id} onClick={() => navigate(`/devis/${d.id}`)} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors text-left">
                <div><p className="text-xs font-mono font-bold">{d.numero}</p><p className="text-xs text-muted-foreground truncate max-w-[150px]">{d.client.societe || `${d.client.prenom} ${d.client.nom}`.trim() || "—"}</p></div>
                <div className="flex items-center gap-2 shrink-0"><span className="text-xs font-mono font-bold">{fmt(calcTotaux(d.lignes).totalTTC)}</span><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>{STATUS_LABELS[d.status]}</span></div>
              </button>
            ); })}
            {devis.length === 0 && <div className="text-center py-8"><p className="text-sm text-muted-foreground mb-3">Aucun devis</p><Button size="sm" onClick={() => navigate("/devis/nouveau")} className="rounded-xl"><Plus className="w-3.5 h-3.5 mr-1" /> Créer</Button></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Immobilier ──
const DBImmobilier = () => {
  const navigate = useNavigate();
  const { list: mandats } = useMandats();
  const { list: devis } = useDevis();
  const actifs = mandats.filter(m => m.status === "actif");
  const ca = mandats.filter(m => m.status === "vendu" || m.status === "loue").reduce((s, m) => s + m.honoraires, 0);
  const in30 = new Date(); in30.setDate(in30.getDate() + 30);
  const expirent = actifs.filter(m => new Date(m.dateExpiration) <= in30);
  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold flex items-center gap-2"><Home className="w-5 h-5 text-blue-500" /> Tableau de bord Immobilier</h1>
          <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p></div>
        <Button onClick={() => navigate("/mandats")} className="rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 border-0 text-white shadow-sm"><Plus className="w-4 h-4 mr-1" /> Nouveau mandat</Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Mandats actifs" value={String(actifs.length)} icon={FileText} color="text-blue-600" bg="bg-blue-50" border="border-blue-100" />
        <Kpi label="Commissions" value={fmt(ca)} icon={TrendingUp} color="text-emerald-600" bg="bg-emerald-50" border="border-emerald-100" />
        <Kpi label="Offres en cours" value={String(devis.filter(d => d.status === "envoye").length)} icon={Euro} color="text-purple-600" bg="bg-purple-50" border="border-purple-100" />
        <Kpi label="Mandats expirent (30j)" value={String(expirent.length)} icon={AlertTriangle} color="text-amber-600" bg="bg-amber-50" border="border-amber-100" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold mb-4">Mandats à renouveler</h3>
          <div className="space-y-2">{expirent.length === 0 ? <p className="text-sm text-muted-foreground text-center py-6">Aucun 🎉</p> : expirent.map(m => <AlertBtn key={m.id} msg={`${m.numero} — ${m.adresse} — expire ${new Date(m.dateExpiration).toLocaleDateString("fr-FR")}`} type="expiration" onClick={() => navigate("/mandats")} />)}</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold">Derniers mandats</h3><button onClick={() => navigate("/mandats")} className="text-xs text-primary hover:underline">Voir tous →</button></div>
          <div className="space-y-2">{mandats.slice(0, 5).map(m => (
            <button key={m.id} onClick={() => navigate("/mandats")} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors text-left">
              <div><p className="text-xs font-mono font-bold">{m.numero}</p><p className="text-xs text-muted-foreground truncate max-w-[180px]">{m.adresse}, {m.ville}</p></div>
              <span className="text-xs font-mono font-bold shrink-0">{fmt(m.prix)}</span>
            </button>
          ))}{mandats.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Aucun mandat</p>}</div>
        </div>
      </div>
    </div>
  );
};

// ── Restauration ──
const DBRestauration = () => {
  const navigate = useNavigate();
  const { list: reservations } = useReservationsResto();
  const today = new Date().toISOString().split("T")[0];
  const resaToday = reservations.filter(r => r.date === today);
  const couvertsToday = resaToday.reduce((s, r) => s + r.nbCouverts, 0);
  const attente = reservations.filter(r => r.status === "en_attente").length;
  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold flex items-center gap-2"><UtensilsCrossed className="w-5 h-5 text-red-500" /> Tableau de bord Restauration</h1>
          <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p></div>
        <Button onClick={() => navigate("/reservations")} className="rounded-xl bg-gradient-to-r from-red-500 to-rose-500 border-0 text-white shadow-sm"><Plus className="w-4 h-4 mr-1" /> Réservation</Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Couverts aujourd'hui" value={String(couvertsToday)} icon={Users} color="text-red-600" bg="bg-red-50" border="border-red-100" />
        <Kpi label="Réservations du jour" value={String(resaToday.length)} icon={Calendar} color="text-rose-600" bg="bg-rose-50" border="border-rose-100" />
        <Kpi label="En attente confirm." value={String(attente)} icon={Clock} color="text-amber-600" bg="bg-amber-50" border="border-amber-100" />
        <Kpi label="À venir" value={String(reservations.filter(r => r.date > today).length)} icon={TrendingUp} color="text-emerald-600" bg="bg-emerald-50" border="border-emerald-100" />
      </div>
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold">Réservations du jour</h3><button onClick={() => navigate("/reservations")} className="text-xs text-primary hover:underline">Voir toutes →</button></div>
        <div className="space-y-2">{resaToday.length === 0 ? <p className="text-sm text-muted-foreground text-center py-6">Aucune réservation aujourd'hui</p> : resaToday.sort((a, b) => a.heure.localeCompare(b.heure)).map(r => (
          <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
            <div className="flex items-center gap-3"><span className="text-sm font-bold text-red-600 w-12">{r.heure}</span><div><p className="text-sm font-medium">{r.clientNom}</p><p className="text-xs text-muted-foreground">{r.nbCouverts} couvert{r.nbCouverts > 1 ? "s" : ""}</p></div></div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${r.status === "confirmee" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>{r.status === "confirmee" ? "Confirmée" : "En attente"}</span>
          </div>
        ))}</div>
      </div>
    </div>
  );
};

// ── Tourisme ──
const DBTourisme = () => {
  const navigate = useNavigate();
  const { list: reservations } = useReservations();
  const today = new Date().toISOString().split("T")[0];
  const arrivees = reservations.filter(r => r.dateArrivee === today);
  const nextWeek = new Date(); nextWeek.setDate(nextWeek.getDate() + 7);
  const aVenir = reservations.filter(r => new Date(r.dateArrivee) >= new Date() && new Date(r.dateArrivee) <= nextWeek);
  const acomptesAttente = reservations.filter(r => r.status === "confirmee" && !r.acompteRecu);
  const ca = reservations.filter(r => r.status === "terminee").reduce((s, r) => s + r.montantTotal, 0);
  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold flex items-center gap-2"><Mountain className="w-5 h-5 text-emerald-500" /> Tableau de bord Tourisme</h1>
          <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p></div>
        <Button onClick={() => navigate("/reservations")} className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 border-0 text-white shadow-sm"><Plus className="w-4 h-4 mr-1" /> Réservation</Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Arrivées aujourd'hui" value={String(arrivees.length)} icon={CheckCircle2} color="text-emerald-600" bg="bg-emerald-50" border="border-emerald-100" />
        <Kpi label="Réservations (7j)" value={String(aVenir.length)} icon={Calendar} color="text-teal-600" bg="bg-teal-50" border="border-teal-100" />
        <Kpi label="CA réalisé" value={fmt(ca)} icon={TrendingUp} color="text-blue-600" bg="bg-blue-50" border="border-blue-100" />
        <Kpi label="Acomptes en attente" value={String(acomptesAttente.length)} icon={Euro} color="text-amber-600" bg="bg-amber-50" border="border-amber-100" />
      </div>
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold">Prochaines arrivées (7 jours)</h3><button onClick={() => navigate("/reservations")} className="text-xs text-primary hover:underline">Voir toutes →</button></div>
        <div className="space-y-2">{aVenir.length === 0 ? <p className="text-sm text-muted-foreground text-center py-6">Aucune arrivée prévue</p> : aVenir.sort((a, b) => a.dateArrivee.localeCompare(b.dateArrivee)).map(r => (
          <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
            <div><p className="text-sm font-medium">{r.clientPrenom} {r.clientNom}</p><p className="text-xs text-muted-foreground">{r.hebergement} · {r.nbPersonnes} pers.</p></div>
            <div className="text-right"><p className="text-xs font-bold">{new Date(r.dateArrivee).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</p><p className="text-xs text-muted-foreground">{fmt(r.montantTotal)}</p></div>
          </div>
        ))}</div>
      </div>
    </div>
  );
};

// ── Artisan ──
const DBArtisan = () => {
  const navigate = useNavigate();
  const { list: devis } = useDevis();
  const { list: commandes } = useCommandesClients();
  const { alertes: stockAlertes } = useStock();
  const ca = devis.filter(d => d.status === "accepte").reduce((s, d) => s + calcTotaux(d.lignes).totalTTC, 0);
  const aTraiter = commandes.filter(c => c.status === "en_attente" || c.status === "en_preparation");
  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold flex items-center gap-2"><Wrench className="w-5 h-5 text-purple-500" /> Tableau de bord Artisan / Commerce</h1>
          <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p></div>
        <Button onClick={() => navigate("/devis/nouveau")} className="rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 border-0 text-white shadow-sm"><Plus className="w-4 h-4 mr-1" /> Nouveau devis</Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Devis en cours" value={String(devis.filter(d => d.status === "envoye").length)} icon={FileText} color="text-purple-600" bg="bg-purple-50" border="border-purple-100" />
        <Kpi label="CA accepté" value={fmt(ca)} icon={TrendingUp} color="text-emerald-600" bg="bg-emerald-50" border="border-emerald-100" />
        <Kpi label="Commandes à traiter" value={String(aTraiter.length)} icon={Package} color="text-blue-600" bg="bg-blue-50" border="border-blue-100" />
        <Kpi label="Alertes stock" value={String(stockAlertes.length)} icon={AlertTriangle} color="text-amber-600" bg="bg-amber-50" border="border-amber-100" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {stockAlertes.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Stock bas ({stockAlertes.length})</h3>
            <div className="space-y-2">{stockAlertes.slice(0, 5).map(p => <AlertBtn key={p.id} msg={`${p.nom} — ${p.quantite} ${p.unite} (min: ${p.quantiteMin})`} type="stock" onClick={() => navigate("/stock")} />)}</div>
          </div>
        )}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold">Derniers devis</h3><button onClick={() => navigate("/devis")} className="text-xs text-primary hover:underline">Voir tous →</button></div>
          <div className="space-y-2">{devis.slice(0, 5).map(d => { const c = STATUS_COLORS[d.status]; return (
            <button key={d.id} onClick={() => navigate(`/devis/${d.id}`)} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors">
              <div className="text-left"><p className="text-xs font-mono font-bold">{d.numero}</p><p className="text-xs text-muted-foreground">{d.client.nom || "—"}</p></div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>{STATUS_LABELS[d.status]}</span>
            </button>
          ); })} {devis.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Aucun devis</p>}</div>
        </div>
      </div>
    </div>
  );
};

// ── Router ──
export default function Dashboard() {
  const { entreprise } = useEntreprise();
  const s = entreprise.secteur;
  const map: Record<SecteurId, React.ReactNode> = { peinture: <DBPeinture />, immobilier: <DBImmobilier />, restauration: <DBRestauration />, tourisme: <DBTourisme />, artisan: <DBArtisan /> };
  return <AppLayout secteur={s}>{map[s] || map.peinture}</AppLayout>;
}
