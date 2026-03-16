import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Client } from "@/types/devis";

interface ClientFormProps {
  client: Client;
  onChange: (client: Client) => void;
}

const ClientForm = ({ client, onChange }: ClientFormProps) => {
  const update = (field: keyof Client, value: string) => {
    onChange({ ...client, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
        Informations client
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="client-societe" className="text-xs text-muted-foreground">Société</Label>
          <Input id="client-societe" placeholder="Nom de la société" value={client.societe} onChange={(e) => update("societe", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="client-nom" className="text-xs text-muted-foreground">Nom</Label>
          <Input id="client-nom" placeholder="Dupont" value={client.nom} onChange={(e) => update("nom", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="client-prenom" className="text-xs text-muted-foreground">Prénom</Label>
          <Input id="client-prenom" placeholder="Jean" value={client.prenom} onChange={(e) => update("prenom", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="client-email" className="text-xs text-muted-foreground">Email</Label>
          <Input id="client-email" type="email" placeholder="jean@exemple.fr" value={client.email} onChange={(e) => update("email", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="client-tel" className="text-xs text-muted-foreground">Téléphone</Label>
          <Input id="client-tel" placeholder="06 12 34 56 78" value={client.telephone} onChange={(e) => update("telephone", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="client-adresse" className="text-xs text-muted-foreground">Adresse</Label>
          <Input id="client-adresse" placeholder="12 rue des Lilas" value={client.adresse} onChange={(e) => update("adresse", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="client-cp" className="text-xs text-muted-foreground">Code postal</Label>
          <Input id="client-cp" placeholder="75001" value={client.codePostal} onChange={(e) => update("codePostal", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="client-ville" className="text-xs text-muted-foreground">Ville</Label>
          <Input id="client-ville" placeholder="Paris" value={client.ville} onChange={(e) => update("ville", e.target.value)} />
        </div>
      </div>
    </div>
  );
};

export default ClientForm;
