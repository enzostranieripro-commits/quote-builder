// src/lib/email.ts
const HISTORY_KEY = "dp_emails_v1";

export interface EmailRecord {
  id: string;
  date: string;
  to: string;
  subject: string;
  body: string;
  type: string;
  refId?: string;
}

function load<T>(key: string, fb: T): T {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fb; }
  catch { return fb; }
}

export function getEmailHistory(): EmailRecord[] {
  return load<EmailRecord[]>(HISTORY_KEY, []);
}

export function saveEmail(record: Omit<EmailRecord, "id" | "date">): EmailRecord {
  const history = getEmailHistory();
  const rec: EmailRecord = { ...record, id: crypto.randomUUID(), date: new Date().toISOString() };
  history.unshift(rec);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 200)));
  return rec;
}

export function sendEmail(to: string, subject: string, body: string, type: string, refId?: string): void {
  saveEmail({ to, subject, body, type, refId });
  window.open(`mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
}

// ── Templates ──
export const tplEnvoiDevis = (p: { clientPrenom: string; entreprise: string; numero: string; objet: string; montant: string; validite: string; tel: string; email: string }) => ({
  subject: `Votre devis ${p.numero} — ${p.entreprise}`,
  body: `Bonjour ${p.clientPrenom},\n\nVeuillez trouver ci-joint votre devis ${p.numero} concernant : ${p.objet}.\n\nMontant TTC : ${p.montant}\nValable jusqu'au : ${p.validite}\n\nPour toute question :\n📞 ${p.tel}\n✉️ ${p.email}\n\nCordialement,\n${p.entreprise}`,
});

export const tplRelance = (p: { clientPrenom: string; entreprise: string; numero: string; objet: string; montant: string; validite: string; tel: string }) => ({
  subject: `Rappel — Devis ${p.numero} en attente de votre réponse`,
  body: `Bonjour ${p.clientPrenom},\n\nNous revenons vers vous au sujet de notre devis ${p.numero} (${p.objet}).\n\nMontant TTC : ${p.montant}\nValable jusqu'au : ${p.validite}\n\nN'hésitez pas à nous contacter : 📞 ${p.tel}\n\nCordialement,\n${p.entreprise}`,
});

export const tplAcceptation = (p: { clientPrenom: string; entreprise: string; numero: string; objet: string; montant: string; acompte: string; pctAcompte: number; tel: string }) => ({
  subject: `Devis ${p.numero} accepté — Confirmation`,
  body: `Bonjour ${p.clientPrenom},\n\nNous avons bien enregistré votre accord pour le devis ${p.numero} : ${p.objet}.\n\nMontant TTC : ${p.montant}\nAcompte à verser (${p.pctAcompte}%) : ${p.acompte}\n\nNous vous recontacterons rapidement pour fixer les dates d'intervention.\n\n📞 ${p.tel}\n\nMerci de votre confiance,\n${p.entreprise}`,
});

export const tplConfirmResa = (p: { clientPrenom: string; entreprise: string; ref: string; arrivee: string; depart: string; montant: string; acompte: string; tel: string }) => ({
  subject: `Réservation ${p.ref} confirmée — ${p.entreprise}`,
  body: `Bonjour ${p.clientPrenom},\n\nVotre réservation ${p.ref} est confirmée.\n\n📅 Arrivée : ${p.arrivee}\n📅 Départ : ${p.depart}\n💶 Montant : ${p.montant}\n💶 Acompte : ${p.acompte}\n\nVous recevrez les informations pratiques 2 jours avant votre arrivée.\n\nÀ bientôt,\n${p.entreprise}\n📞 ${p.tel}`,
});

export const tplInfosPratiques = (p: { clientPrenom: string; entreprise: string; arrivee: string; adresse: string; code: string; wifi: string; infos: string; tel: string }) => ({
  subject: `Votre arrivée demain — Informations pratiques`,
  body: `Bonjour ${p.clientPrenom},\n\nVotre séjour commence demain ${p.arrivee}.\n\n📍 Adresse : ${p.adresse}\n🔑 Accès : ${p.code}\n📶 WiFi : ${p.wifi}\n\n${p.infos}\n\nPour toute question : 📞 ${p.tel}\n\nÀ demain,\n${p.entreprise}`,
});

export const tplConfirmCommande = (p: { clientPrenom: string; entreprise: string; numero: string; detail: string; montant: string; tel: string }) => ({
  subject: `Commande ${p.numero} confirmée — ${p.entreprise}`,
  body: `Bonjour ${p.clientPrenom},\n\nVotre commande ${p.numero} est bien enregistrée.\n\n${p.detail}\nMontant : ${p.montant}\n\nNous vous contacterons prochainement.\n📞 ${p.tel}\n\nMerci,\n${p.entreprise}`,
});
export const tplRappelReservation = (p: {
  clientPrenom: string;
  entreprise: string;
  ref: string;
  arrivee: string;
  depart: string;
  tel: string;
}) => ({
  subject: `Rappel — Votre réservation ${p.ref}`,
  body: `Bonjour ${p.clientPrenom},\n\nNous vous rappelons votre réservation ${p.ref}.\n\n📅 Arrivée : ${p.arrivee}\n📅 Départ : ${p.depart}\n\nPour toute question : 📞 ${p.tel}\n\nÀ bientôt,\n${p.entreprise}`,
});
