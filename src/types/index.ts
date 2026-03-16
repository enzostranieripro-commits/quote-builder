// src/types/index.ts
export type SecteurId = "peinture" | "immobilier" | "restauration" | "tourisme" | "artisan";

export interface SecteurConfig {
  id: SecteurId;
  label: string;
  emoji: string;
  gradient: string;
  colorText: string;
  colorBorder: string;
  colorLight: string;
  colorDot: string;
  description: string;
}

export const SECTEURS: SecteurConfig[] = [
  { id: "peinture", label: "Peinture / BTP", emoji: "🖌️", gradient: "from-orange-500 to-amber-500", colorText: "text-orange-600", colorBorder: "border-orange-300", colorLight: "bg-orange-50", colorDot: "bg-orange-500", description: "Peintres, maçons, plaquistes, carreleurs..." },
  { id: "immobilier", label: "Immobilier", emoji: "🏠", gradient: "from-blue-500 to-sky-500", colorText: "text-blue-600", colorBorder: "border-blue-300", colorLight: "bg-blue-50", colorDot: "bg-blue-500", description: "Agents, mandataires, administrateurs..." },
  { id: "restauration", label: "Restauration", emoji: "🍽️", gradient: "from-red-500 to-rose-500", colorText: "text-red-600", colorBorder: "border-red-300", colorLight: "bg-red-50", colorDot: "bg-red-500", description: "Restaurants, traiteurs, cafés..." },
  { id: "tourisme", label: "Tourisme / Hôtellerie", emoji: "🏔️", gradient: "from-emerald-500 to-teal-500", colorText: "text-emerald-600", colorBorder: "border-emerald-300", colorLight: "bg-emerald-50", colorDot: "bg-emerald-500", description: "Hôtels, gîtes, camping, activités..." },
  { id: "artisan", label: "Artisan / Commerce", emoji: "🔧", gradient: "from-purple-500 to-violet-500", colorText: "text-purple-600", colorBorder: "border-purple-300", colorLight: "bg-purple-50", colorDot: "bg-purple-500", description: "Artisans, commerçants, prestataires..." },
];

// ── Entreprise ──
export interface Entreprise {
  raisonSociale: string; siret: string; adresse: string; codePostal: string;
  ville: string; telephone: string; email: string; emailEnvoi: string;
  logo?: string; tvaIntracom: string; assuranceDecennale: string; rcs: string;
  secteur: SecteurId; acompteDefaut: number;
  conditionsPaiementDefaut: string; mentionsLegalesDefaut: string;
  codeAcces?: string; wifi?: string; infosArrivee?: string;
  seuilStockAlerte?: number;
}

export const DEFAULT_ENTREPRISE: Entreprise = {
  raisonSociale: "", siret: "", adresse: "", codePostal: "", ville: "",
  telephone: "", email: "", emailEnvoi: "", tvaIntracom: "", assuranceDecennale: "",
  rcs: "", secteur: "peinture", acompteDefaut: 30,
  conditionsPaiementDefaut: "Acompte de 30% à la commande. Solde à réception.",
  mentionsLegalesDefaut: "Devis valable 30 jours.",
};

// ── Devis ──
export type DevisStatus = "brouillon" | "envoye" | "accepte" | "refuse";
export type Unite = "m²" | "ml" | "m³" | "u" | "h" | "j" | "forfait" | "kg" | "l" | "lot";
export const UNITES: Unite[] = ["m²", "ml", "m³", "u", "h", "j", "forfait", "kg", "l", "lot"];
export const TVA_RATES = [0, 5.5, 10, 20] as const;
export type TvaRate = (typeof TVA_RATES)[number];

export const STATUS_LABELS: Record<DevisStatus, string> = { brouillon: "Brouillon", envoye: "Envoyé", accepte: "Accepté", refuse: "Refusé" };
export const STATUS_COLORS: Record<DevisStatus, { bg: string; text: string; border: string; dot: string }> = {
  brouillon: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" },
  envoye:    { bg: "bg-blue-50",   text: "text-blue-600",  border: "border-blue-200",  dot: "bg-blue-500" },
  accepte:   { bg: "bg-emerald-50",text: "text-emerald-700",border: "border-emerald-200",dot: "bg-emerald-500" },
  refuse:    { bg: "bg-red-50",    text: "text-red-600",   border: "border-red-200",   dot: "bg-red-500" },
};

export interface LigneDevis {
  id: string; categorie: string; designation: string;
  unite: Unite; quantite: number; prixUnitaireHT: number; tva: TvaRate;
}

export interface Client {
  nom: string; prenom: string; societe: string; adresse: string;
  codePostal: string; ville: string; telephone: string; email: string;
}

export interface EcheanceItem { id: string; pourcentage: number; description: string; }

export interface Devis {
  id: string; numero: string; dateCreation: string; dateValidite: string;
  status: DevisStatus; secteur: SecteurId; client: Client;
  objet: string; description: string; adresseChantier: string;
  lignes: LigneDevis[];
  conditions: { validiteDuree: number; conditionsPaiement: string; mentionsLegales: string; acomptePercent: number; echeancier: EcheanceItem[] };
  notes: string; acompteRecu: boolean; soldeSolde: boolean;
  dateEnvoi?: string; dateRelance?: string; dateAcceptation?: string;
  chantierPlanifie?: boolean; dateChantier?: string; emailEnvoye?: boolean;
}

// ── Chantier ──
export type ChantierStatus = "planifie" | "en_cours" | "termine" | "facture";
export interface NoteChantier { id: string; date: string; texte: string; }
export interface MateriauxItem { id: string; nom: string; quantite: number; unite: string; recu: boolean; }
export interface Chantier {
  id: string; devisId?: string; clientNom: string; adresse: string;
  status: ChantierStatus; dateDebut: string; dateFin: string;
  nbOuvriers: number; notes: NoteChantier[]; materiaux: MateriauxItem[];
  bonLivraison: string;
}

// ── Mandat Immobilier ──
export type MandatStatus = "actif" | "compromis" | "vendu" | "loue" | "expire" | "resilie";
export interface Mandat {
  id: string; numero: string; type: "vente" | "location"; status: MandatStatus;
  adresse: string; ville: string; surface: number; nbPieces: number; prix: number;
  proprietaireNom: string; proprietaireTel: string; proprietaireEmail: string;
  dateMandat: string; dateExpiration: string; honoraires: number; notes: string;
}

export interface Visite {
  id: string; mandatId: string; clientNom: string; clientTel: string; clientEmail: string;
  date: string; heure: string; status: "planifiee" | "realisee" | "annulee"; feedback: string;
}

// ── Réservation Tourisme ──
export type ResaStatus = "option" | "confirmee" | "en_cours" | "terminee" | "annulee";
export interface Reservation {
  id: string; numero: string;
  clientNom: string; clientPrenom: string; clientEmail: string; clientTel: string;
  hebergement: string; dateArrivee: string; dateDepart: string;
  nbPersonnes: number; montantTotal: number; acompte: number;
  acompteRecu: boolean; soldeSolde: boolean; status: ResaStatus; notes: string;
  emailConfirmEnvoye: boolean; emailInfosEnvoye: boolean;
}

// ── Restauration ──
export interface ReservationResto {
  id: string; date: string; heure: string;
  clientNom: string; clientTel: string; clientEmail: string;
  nbCouverts: number; status: "confirmee" | "en_attente" | "annulee" | "terminee";
  notes: string; emailRappelEnvoye: boolean;
}

export interface CommandeFournisseur {
  id: string; fournisseur: string; produit: string; quantite: number;
  unite: string; dateCommande: string; dateLivraisonPrevue: string;
  status: "en_attente" | "recue" | "en_retard"; montant: number;
}

export interface MenuDuJour {
  id: string; date: string; entree: string; plat: string; dessert: string;
  prixMidi: number; prixSoir: number; notes: string;
}

// ── Stock Artisan ──
export interface ProduitStock {
  id: string; nom: string; reference: string; categorie: string;
  quantite: number; quantiteMin: number; unite: string;
  prixAchat: number; prixVente: number; fournisseur: string;
}

export interface CommandeClient {
  id: string; numero: string; clientNom: string; clientEmail: string; clientTel: string;
  lignes: { nom: string; quantite: number; prixUnitaire: number }[];
  montantTotal: number; dateCommande: string; dateLivraison: string;
  status: "en_attente" | "en_preparation" | "expedie" | "livre" | "annule";
  notes: string; emailEnvoye: boolean;
}

// ── Calculs ──
export const calcHT = (l: LigneDevis) => l.quantite * l.prixUnitaireHT;
export const calcTVA = (l: LigneDevis) => calcHT(l) * (l.tva / 100);
export const calcTTC = (l: LigneDevis) => calcHT(l) + calcTVA(l);

export function calcTotaux(lignes: LigneDevis[]) {
  const totalHT = lignes.reduce((s, l) => s + calcHT(l), 0);
  const tvaDetails: Record<number, number> = {};
  lignes.forEach(l => { tvaDetails[l.tva] = (tvaDetails[l.tva] || 0) + calcTVA(l); });
  const totalTVA = Object.values(tvaDetails).reduce((s, v) => s + v, 0);
  return { totalHT, tvaDetails, totalTVA, totalTTC: totalHT + totalTVA };
}

export const fmt = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

export function genNumeroDevis(list: Devis[] = []) {
  const y = new Date().getFullYear(), m = String(new Date().getMonth() + 1).padStart(2, "0");
  const n = list.filter(d => d.dateCreation?.startsWith(String(y))).length + 1;
  return `D-${y}${m}-${String(n).padStart(3, "0")}`;
}

export function creerDevisVide(secteur: SecteurId, list: Devis[] = [], ent?: Partial<Entreprise>): Devis {
  const now = new Date(), val = new Date(now); val.setDate(val.getDate() + 30);
  return {
    id: crypto.randomUUID(), numero: genNumeroDevis(list),
    dateCreation: now.toISOString().split("T")[0], dateValidite: val.toISOString().split("T")[0],
    status: "brouillon", secteur,
    client: { nom: "", prenom: "", societe: "", adresse: "", codePostal: "", ville: "", telephone: "", email: "" },
    objet: "", description: "", adresseChantier: "", lignes: [],
    conditions: {
      validiteDuree: 30,
      conditionsPaiement: ent?.conditionsPaiementDefaut || "Acompte de 30% à la commande. Solde à réception.",
      mentionsLegales: ent?.mentionsLegalesDefaut || "Devis valable 30 jours.",
      acomptePercent: ent?.acompteDefaut || 30,
      echeancier: [
        { id: crypto.randomUUID(), pourcentage: 30, description: "À la commande" },
        { id: crypto.randomUUID(), pourcentage: 40, description: "En cours" },
        { id: crypto.randomUUID(), pourcentage: 30, description: "À la réception" },
      ],
    },
    notes: "", acompteRecu: false, soldeSolde: false,
  };
}

// ── Catégories & Presets ──
export const CATEGORIES_PAR_SECTEUR: Record<SecteurId, string[]> = {
  peinture: ["Peinture intérieure","Peinture extérieure / façade","Ravalement / enduits","Papier peint / revêtements","Sol (carrelage, parquet, résine)","Placo / isolation","Nettoyage haute pression","Main d'œuvre","Transport / déplacement","Fournitures / matériaux","Divers"],
  immobilier: ["Honoraires vente","Honoraires location","Gestion locative","Diagnostics","Frais de dossier","Publicité","Divers"],
  restauration: ["Prestation traiteur","Menu","Boissons","Location matériel","Service","Divers"],
  tourisme: ["Hébergement","Petit-déjeuner","Demi-pension","Pension complète","Activités","Transferts","Extras","Divers"],
  artisan: ["Fournitures","Main d'œuvre","Déplacement","Matériaux","Location outillage","Sous-traitance","Divers"],
};

export const PRESETS: Record<SecteurId, Record<string, { designation: string; unite: Unite; prixUnitaireHT: number; tva: TvaRate }[]>> = {
  peinture: {
    "Peinture intérieure": [
      { designation: "Peinture murs — 2 couches acrylique mat", unite: "m²", prixUnitaireHT: 18, tva: 10 },
      { designation: "Peinture plafond — impression + 2 couches", unite: "m²", prixUnitaireHT: 22, tva: 10 },
      { designation: "Mise en peinture menuiseries intérieures", unite: "u", prixUnitaireHT: 85, tva: 10 },
    ],
    "Peinture extérieure / façade": [
      { designation: "Peinture façade — 2 couches", unite: "m²", prixUnitaireHT: 28, tva: 10 },
      { designation: "Mise en peinture volets bois", unite: "u", prixUnitaireHT: 95, tva: 10 },
    ],
    "Sol (carrelage, parquet, résine)": [
      { designation: "Pose carrelage sol 60x60", unite: "m²", prixUnitaireHT: 55, tva: 10 },
      { designation: "Pose parquet stratifié", unite: "m²", prixUnitaireHT: 38, tva: 10 },
      { designation: "Sol résine époxy", unite: "m²", prixUnitaireHT: 75, tva: 10 },
    ],
    "Placo / isolation": [
      { designation: "Cloison BA13 sur ossature métal", unite: "m²", prixUnitaireHT: 52, tva: 10 },
      { designation: "Isolation combles soufflée R≥7", unite: "m²", prixUnitaireHT: 32, tva: 5.5 },
    ],
    "Nettoyage haute pression": [
      { designation: "Nettoyage façade haute pression", unite: "m²", prixUnitaireHT: 8, tva: 10 },
    ],
    "Main d'œuvre": [
      { designation: "Peintre qualifié", unite: "h", prixUnitaireHT: 42, tva: 10 },
    ],
  },
  immobilier: {
    "Honoraires vente": [{ designation: "Honoraires agence — vente", unite: "forfait", prixUnitaireHT: 8000, tva: 20 }],
    "Honoraires location": [{ designation: "Honoraires location — 1 mois", unite: "forfait", prixUnitaireHT: 800, tva: 20 }],
  },
  restauration: {
    "Prestation traiteur": [
      { designation: "Cocktail dînatoire / personne", unite: "u", prixUnitaireHT: 35, tva: 10 },
      { designation: "Repas assis — formule complète", unite: "u", prixUnitaireHT: 55, tva: 10 },
    ],
  },
  tourisme: {
    "Hébergement": [
      { designation: "Nuit chambre double", unite: "j", prixUnitaireHT: 80, tva: 10 },
      { designation: "Location gîte — semaine", unite: "forfait", prixUnitaireHT: 600, tva: 10 },
    ],
  },
  artisan: {
    "Main d'œuvre": [{ designation: "Main d'œuvre artisan", unite: "h", prixUnitaireHT: 45, tva: 20 }],
    "Fournitures": [{ designation: "Fournitures et matériaux", unite: "forfait", prixUnitaireHT: 200, tva: 20 }],
  },
};
