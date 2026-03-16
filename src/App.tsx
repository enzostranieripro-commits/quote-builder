// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { isAuthenticated } from "@/lib/auth";

import Login from "./pages/Login.tsx";
import Welcome from "./pages/Welcome.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import DevisEditor from "./pages/DevisEditor.tsx";
import DevisList from "./pages/DevisList.tsx";
import Chantiers from "./pages/Chantiers.tsx";
import Mandats from "./pages/Mandats.tsx";
import Reservations from "./pages/Reservations.tsx";
import Stock from "./pages/Stock.tsx";
import Clients from "./pages/Clients.tsx";
import Alertes from "./pages/Alertes.tsx";
import { Parametres } from "./pages/Parametres.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const Guard = ({ children }: { children: React.ReactNode }) =>
  isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/"           element={<Guard><Welcome /></Guard>} />
          <Route path="/dashboard"  element={<Guard><Dashboard /></Guard>} />
          <Route path="/devis"      element={<Guard><DevisList /></Guard>} />
          <Route path="/devis/nouveau" element={<Guard><DevisEditor /></Guard>} />
          <Route path="/devis/:id"  element={<Guard><DevisEditor /></Guard>} />
          <Route path="/chantiers"  element={<Guard><Chantiers /></Guard>} />
          <Route path="/mandats"    element={<Guard><Mandats /></Guard>} />
          <Route path="/visites"    element={<Guard><Mandats /></Guard>} />
          <Route path="/reservations" element={<Guard><Reservations /></Guard>} />
          <Route path="/stock"      element={<Guard><Stock /></Guard>} />
          <Route path="/clients"    element={<Guard><Clients /></Guard>} />
          <Route path="/alertes"    element={<Guard><Alertes /></Guard>} />
          <Route path="/parametres" element={<Guard><Parametres /></Guard>} />
          <Route path="*"           element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
