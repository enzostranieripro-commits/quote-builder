// src/hooks/useStore.ts
import { useState, useEffect, useCallback } from "react";
import type { Devis, Entreprise, Chantier, Mandat, Visite, Reservation, ReservationResto, CommandeFournisseur, MenuDuJour, ProduitStock, CommandeClient } from "@/types";
import { DEFAULT_ENTREPRISE } from "@/types";

const K = {
  devis: "dp_devis_v2", entreprise: "dp_ent_v2", chantiers: "dp_chantiers_v2",
  mandats: "dp_mandats_v2", visites: "dp_visites_v2", reservations: "dp_resa_v2",
  resaResto: "dp_resa_resto_v2", cmdFourn: "dp_cmd_fourn_v2", menus: "dp_menus_v2",
  stock: "dp_stock_v2", cmdClients: "dp_cmd_clients_v2",
};

function load<T>(key: string, fb: T): T {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fb; }
  catch { return fb; }
}
const save = <T>(key: string, data: T) => localStorage.setItem(key, JSON.stringify(data));

function makeHook<T extends { id: string }>(key: string) {
  return function useHook() {
    const [list, setList] = useState<T[]>(() => load(key, []));
    useEffect(() => { save(key, list); }, [list]);
    const add = useCallback((item: T) => setList(p => [item, ...p]), []);
    const update = useCallback((item: T) => setList(p => p.map(x => x.id === item.id ? item : x)), []);
    const remove = useCallback((id: string) => setList(p => p.filter(x => x.id !== id)), []);
    const get = useCallback((id: string) => list.find(x => x.id === id) ?? null, [list]);
    return { list, add, update, remove, get };
  };
}

export const useDevis = makeHook<Devis>(K.devis);
export const useChantiers = makeHook<Chantier>(K.chantiers);
export const useMandats = makeHook<Mandat>(K.mandats);
export const useVisites = makeHook<Visite>(K.visites);
export const useReservations = makeHook<Reservation>(K.reservations);
export const useReservationsResto = makeHook<ReservationResto>(K.resaResto);
export const useCommandesFournisseurs = makeHook<CommandeFournisseur>(K.cmdFourn);
export const useMenusDuJour = makeHook<MenuDuJour>(K.menus);
export const useCommandesClients = makeHook<CommandeClient>(K.cmdClients);

export function useEntreprise() {
  const [entreprise, setRaw] = useState<Entreprise>(() => load(K.entreprise, DEFAULT_ENTREPRISE));
  const setEntreprise = useCallback((e: Entreprise) => { setRaw(e); save(K.entreprise, e); }, []);
  return { entreprise, setEntreprise };
}

export function useStock() {
  const [list, setList] = useState<ProduitStock[]>(() => load(K.stock, []));
  useEffect(() => { save(K.stock, list); }, [list]);
  const add = useCallback((p: ProduitStock) => setList(prev => [p, ...prev]), []);
  const update = useCallback((p: ProduitStock) => setList(prev => prev.map(x => x.id === p.id ? p : x)), []);
  const remove = useCallback((id: string) => setList(prev => prev.filter(x => x.id !== id)), []);
  const alertes = list.filter(p => p.quantite <= p.quantiteMin);
  return { list, add, update, remove, alertes };
}
