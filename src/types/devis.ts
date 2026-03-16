export type DevisStatus = "brouillon" | "envoye" | "accepte" | "refuse";

export type Unite = "m²" | "ml" | "m³" | "u" | "h" | "j" | "forfait" | "kg" | "l" | "lot";

export const UNITES: Unite[] = ["m²", "ml", "m³", "u", "h", "j", "forfait", "kg", "l", "lot"];

export const TVA_RATES = [0, 5.5, 10, 20] as const;
export type TvaRate = typeof TVA_RATES[number];

export interface LigneDevis {
  id: string;
  categorie: string;
  designation: string;
  unite: Unite;
  quantite: number;
  prixUnitaireHT: number;
  tva: TvaRate;
}

export interface Client {
  nom: string;
  prenom: string;
  societe: string;
  adresse: string;
  codePostal: string;
  ville: string;
  telephone: string;
  email: string;
}

export interface Entreprise {
  raisonSociale: string;
  siret: string;
  adresse: string;
  codePostal: string;
  ville: string;
  telephone: string;
  email: string;
  logo?: string; // base64
  tvaIntracom: string;
  assuranceDecennale: string;
  rcs: string;
}

export interface ConditionsDevis {
  validiteDuree: number; // jours
  conditionsPaiement: string;
  mentionsLegales: string;
  acomptePercent: number;
  echeancier: EcheanceItem[];
}

export interface EcheanceItem {
  id: string;
  pourcentage: number;
  description: string;
}

export interface Devis {
  id: string;
  numero: string;
  dateCreation: string;
  dateValidite: string;
  status: DevisStatus;
  client: Client;
  objet: string;
  description: string;
  lignes: LigneDevis[];
  conditions: ConditionsDevis;
  notes: string;
}

// Computed helpers
export function calculerTotalLigneHT(ligne: LigneDevis): number {
  return ligne.quantite * ligne.prixUnitaireHT;
}

export function calculerTVALigne(ligne: LigneDevis): number {
  return calculerTotalLigneHT(ligne) * (ligne.tva / 100);
}

export function calculerTotalLigneTTC(ligne: LigneDevis): number {
  return calculerTotalLigneHT(ligne) + calculerTVALigne(ligne);
}

export function calculerTotauxDevis(lignes: LigneDevis[]) {
  const totalHT = lignes.reduce((sum, l) => sum + calculerTotalLigneHT(l), 0);

  // Group TVA
  const tvaDetails: Record<number, number> = {};
  lignes.forEach((l) => {
    const tvaAmount = calculerTVALigne(l);
    tvaDetails[l.tva] = (tvaDetails[l.tva] || 0) + tvaAmount;
  });

  const totalTVA = Object.values(tvaDetails).reduce((s, v) => s + v, 0);
  const totalTTC = totalHT + totalTVA;

  return { totalHT, tvaDetails, totalTVA, totalTTC };
}

export function formatMontant(montant: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(montant);
}

export function genererNumeroDevis(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const rand = String(Math.floor(Math.random() * 999) + 1).padStart(3, "0");
  return `D-${year}${month}-${rand}`;
}

export const STATUS_LABELS: Record<DevisStatus, string> = {
  brouillon: "Brouillon",
  envoye: "Envoyé",
  accepte: "Accepté",
  refuse: "Refusé",
};

export const CATEGORIES_BTP = [
  "Gros œuvre",
  "Second œuvre",
  "Plomberie",
  "Électricité",
  "Peinture",
  "Carrelage",
  "Menuiserie",
  "Isolation",
  "Couverture / Toiture",
  "Terrassement",
  "Démolition",
  "Fournitures",
  "Main d'œuvre",
  "Transport",
  "Divers",
];

export function creerDevisVide(): Devis {
  const now = new Date();
  const validite = new Date(now);
  validite.setDate(validite.getDate() + 30);

  return {
    id: crypto.randomUUID(),
    numero: genererNumeroDevis(),
    dateCreation: now.toISOString().split("T")[0],
    dateValidite: validite.toISOString().split("T")[0],
    status: "brouillon",
    client: {
      nom: "",
      prenom: "",
      societe: "",
      adresse: "",
      codePostal: "",
      ville: "",
      telephone: "",
      email: "",
    },
    objet: "",
    description: "",
    lignes: [],
    conditions: {
      validiteDuree: 30,
      conditionsPaiement: "Paiement à 30 jours à compter de la date de facture.",
      mentionsLegales:
        "Devis valable {validite} jours. TVA non applicable, art. 293 B du CGI (si applicable). Assurance décennale souscrite auprès de [compagnie]. En cas de litige, le tribunal compétent sera celui du siège social de l'entreprise.",
      acomptePercent: 30,
      echeancier: [
        { id: crypto.randomUUID(), pourcentage: 30, description: "À la commande" },
        { id: crypto.randomUUID(), pourcentage: 40, description: "En cours de travaux" },
        { id: crypto.randomUUID(), pourcentage: 30, description: "À la réception des travaux" },
      ],
    },
    notes: "",
  };
}
