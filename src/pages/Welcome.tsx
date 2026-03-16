// src/pages/Welcome.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SECTEURS, type SecteurId } from "@/types";
import { useEntreprise } from "@/hooks/useStore";
import { logout } from "@/lib/auth";
import { ArrowRight, CheckCircle2, LogOut, FileText, TrendingUp, Zap, Shield } from "lucide-react";

const FEATURES = [
  { icon: FileText, label: "Devis & documents", desc: "Prestations pré-remplies par métier, export PDF" },
  { icon: TrendingUp, label: "Dashboard visuel", desc: "KPIs, Kanban, alertes en temps réel" },
  { icon: Zap, label: "Emails automatiques", desc: "Relances, confirmations, rappels" },
  { icon: Shield, label: "100% local & sécurisé", desc: "Données sur votre appareil uniquement" },
];

export default function Welcome() {
  const navigate = useNavigate();
  const { entreprise, setEntreprise } = useEntreprise();
  const [selected, setSelected] = useState<SecteurId | null>(entreprise.secteur || null);

  const handleContinue = () => {
    if (!selected) return;
    setEntreprise({ ...entreprise, secteur: selected });
    navigate("/dashboard");
  };

  const sel = SECTEURS.find(s => s.id === selected);

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col">
      <div className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight">DevisPro</span>
            <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">Aveyron & Occitanie</span>
          </div>
        </div>
        <button onClick={() => { logout(); navigate("/login"); }}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-500 transition-colors px-3 py-1.5 rounded-xl hover:bg-red-50">
          <LogOut className="w-3.5 h-3.5" /> Déconnexion
        </button>
      </div>

      <div className="flex-1 max-w-[960px] mx-auto w-full px-6 py-10 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 text-sm font-semibold text-blue-700">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Plateforme de gestion — Aveyron & Occitanie
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Bienvenue sur <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">DevisPro</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">Choisissez votre secteur — l'interface s'adapte entièrement à votre métier.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FEATURES.map(f => (
            <div key={f.label} className="bg-white rounded-2xl border border-border p-4 shadow-sm">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-xl flex items-center justify-center mb-3">
                <f.icon className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs font-bold mb-0.5">{f.label}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wider mb-4 text-center">Sélectionnez votre secteur d'activité</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTEURS.map(s => (
              <button key={s.id} onClick={() => setSelected(s.id)}
                className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-200 bg-white hover:shadow-md hover:-translate-y-0.5 ${selected === s.id ? "shadow-lg scale-[1.02]" : "border-border"}`}
                style={selected === s.id ? { borderImage: "none", outline: `2px solid transparent`, boxShadow: "0 0 0 2px rgba(99,102,241,0.4), 0 10px 25px -5px rgba(0,0,0,0.1)" } : {}}>
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${s.gradient} transition-opacity ${selected === s.id ? "opacity-100" : "opacity-0"}`} />
                {selected === s.id && <CheckCircle2 className={`absolute top-3 right-3 w-5 h-5 ${s.colorText}`} />}
                <div className="flex items-center gap-3 mb-3">
                  <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-xl shadow-sm`}>{s.emoji}</span>
                  <div>
                    <p className="font-bold text-sm text-foreground">{s.label}</p>
                    <div className={`w-1.5 h-1.5 rounded-full ${s.colorDot} mt-1`} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{s.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Button size="lg" disabled={!selected} onClick={handleContinue}
            className={`rounded-2xl px-10 py-6 text-base font-semibold shadow-lg transition-all border-0 ${selected ? "text-white hover:opacity-90" : "opacity-40 cursor-not-allowed bg-gray-300 text-gray-500"}`}
            style={selected && sel ? { background: `linear-gradient(135deg, var(--tw-gradient-stops))` } : {}}>
            <span className={selected && sel ? `bg-gradient-to-r ${sel.gradient} bg-clip-text` : ""}>
              {selected ? `Accéder à mon espace ${sel?.label}` : "Choisissez un secteur pour continuer"}
            </span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-xs text-muted-foreground">Vous pourrez changer de secteur depuis les Paramètres</p>
        </div>
      </div>
    </div>
  );
}
