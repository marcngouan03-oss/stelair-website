import AdminResourceManager from "../../components/AdminResourceManager";

const pageOptions = [
  { value: "home", label: "Accueil" },
  { value: "music", label: "Musique" },
  { value: "videos", label: "Videos" },
  { value: "biography", label: "Biographie" },
  { value: "contact", label: "Contact" },
  { value: "shop", label: "Boutique" },
];

const fieldsConfig = [
  { name: "page", label: "Page concernee", type: "select", options: pageOptions },
  { name: "title", label: "Titre affiche", type: "text" },
  { name: "subtitle", label: "Sous-titre", type: "textarea" },
  {
    name: "mediaType",
    label: "Type de media",
    type: "select",
    options: [
      { value: "image", label: "Image" },
      { value: "video", label: "Video" },
    ],
  },
  { name: "mediaUrl", label: "Image ou video de fond", type: "image", folder: "heroes", accept: "image/*,video/*" },
  { name: "ctaLabel", label: "Texte du bouton (optionnel)", type: "text" },
  { name: "ctaLink", label: "Lien du bouton (optionnel)", type: "url" },
  { name: "order", label: "Ordre d'affichage", type: "number" },
  { name: "isActive", label: "Actif sur le site", type: "checkbox" },
];

export default function AdminHeroes() {
  return (
    <AdminResourceManager
      endpoint="heroes"
      title="Heros / Bannieres"
      fieldsConfig={fieldsConfig}
      displayField="title"
      emptyDefaults={{ page: "home", mediaType: "image", order: 0, isActive: true }}
    />
  );
}
