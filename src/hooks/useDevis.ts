import { useState, useEffect, useCallback } from "react";
import type { Devis, Entreprise } from "@/types/devis";

const DEVIS_KEY = "devispro_devis";
const ENTREPRISE_KEY = "devispro_entreprise";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ---- Devis Hook ----
export function useDevisList() {
  const [devisList, setDevisList] = useState<Devis[]>(() =>
    loadFromStorage<Devis[]>(DEVIS_KEY, [])
  );

  useEffect(() => {
    saveToStorage(DEVIS_KEY, devisList);
  }, [devisList]);

  const addDevis = useCallback((devis: Devis) => {
    setDevisList((prev) => [devis, ...prev]);
  }, []);

  const updateDevis = useCallback((devis: Devis) => {
    setDevisList((prev) => prev.map((d) => (d.id === devis.id ? devis : d)));
  }, []);

  const deleteDevis = useCallback((id: string) => {
    setDevisList((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const getDevis = useCallback(
    (id: string) => devisList.find((d) => d.id === id) || null,
    [devisList]
  );

  return { devisList, addDevis, updateDevis, deleteDevis, getDevis };
}

// ---- Entreprise Hook ----
const DEFAULT_ENTREPRISE: Entreprise = {
  raisonSociale: "",
  siret: "",
  adresse: "",
  codePostal: "",
  ville: "",
  telephone: "",
  email: "",
  tvaIntracom: "",
  assuranceDecennale: "",
  rcs: "",
};

export function useEntreprise() {
  const [entreprise, setEntreprise] = useState<Entreprise>(() =>
    loadFromStorage<Entreprise>(ENTREPRISE_KEY, DEFAULT_ENTREPRISE)
  );

  useEffect(() => {
    saveToStorage(ENTREPRISE_KEY, entreprise);
  }, [entreprise]);

  return { entreprise, setEntreprise };
}
