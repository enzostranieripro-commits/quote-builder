// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, setupAuth, getAuthConfig } from "@/lib/auth";
import { FileText, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const isSetup = !getAuthConfig().configured;
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const doShake = () => { setShake(true); setTimeout(() => setShake(false), 500); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSetup) {
      if (!email.includes("@")) { setError("Email invalide"); doShake(); return; }
      if (pwd.length < 6) { setError("Mot de passe trop court (6 car. min)"); doShake(); return; }
      if (pwd !== confirm) { setError("Les mots de passe ne correspondent pas"); doShake(); return; }
      setupAuth(email, pwd);
      toast.success("Compte créé ! Bienvenue 🎉");
      navigate("/");
    } else {
      if (login(email, pwd)) { navigate("/"); }
      else { setError("Email ou mot de passe incorrect"); doShake(); setPwd(""); }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>
      <style>{`@keyframes loginShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-10px)}40%{transform:translateX(10px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}`}</style>

      <div className={`w-full max-w-sm relative`} style={shake ? { animation: "loginShake 0.4s ease-in-out" } : {}}>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">DevisPro</h1>
            <p className="text-white/50 text-sm mt-1">{isSetup ? "Créez votre compte" : "Connectez-vous"}</p>
          </div>

          {isSetup && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-5 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-300">Première connexion — Définissez vos identifiants. Tout reste sur votre appareil.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-white/60">Email</Label>
              <Input type="email" placeholder="vous@exemple.fr" value={email} onChange={e => setEmail(e.target.value)} autoFocus
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 h-10" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-white/60">Mot de passe</Label>
              <div className="relative">
                <Input type={showPwd ? "text" : "password"} placeholder={isSetup ? "Min. 6 caractères" : "••••••••"}
                  value={pwd} onChange={e => setPwd(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 h-10 pr-16" />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 text-xs font-medium transition-colors">
                  {showPwd ? "Cacher" : "Voir"}
                </button>
              </div>
            </div>
            {isSetup && (
              <div className="space-y-1.5">
                <Label className="text-xs text-white/60">Confirmer le mot de passe</Label>
                <Input type="password" placeholder="Répétez le mot de passe" value={confirm} onChange={e => setConfirm(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 h-10" />
              </div>
            )}
            {error && <p className="text-xs text-red-400 text-center bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
            <Button type="submit" className="w-full h-11 bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white border-0 rounded-xl font-semibold shadow-lg">
              {isSetup ? "Créer mon compte" : "Se connecter"} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
          <p className="text-center text-xs text-white/30 mt-5">Données 100% locales · Aucun serveur tiers</p>
        </div>
      </div>
    </div>
  );
}
