import AdminResourceManager from "../../components/AdminResourceManager";

const fieldsConfig = [
  { name: "title", label: "Titre", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea" },
  { name: "coverImage", label: "Pochette", type: "image", folder: "beats" },
  { name: "zipUrl", label: "Fichier ZIP", type: "file", folder: "beats" },
  { name: "previewAudioUrl", label: "Extrait audio", type: "audio", folder: "beats" },
  { name: "price", label: "Prix (EUR)", type: "number" },
  { name: "isPopular", label: "Populaire", type: "checkbox" },
  { name: "order", label: "Ordre d'affichage", type: "number" },
  { name: "isActive", label: "En vente", type: "checkbox" },
];

export default function AdminBeats() {
  return (
    <AdminResourceManager
      endpoint="beats"
      title="Boutique — Catalogue"
      fieldsConfig={fieldsConfig}
      displayField="title"
      emptyDefaults={{ price: 55, order: 0, isActive: true, isPopular: false }}
    />
  );
}
