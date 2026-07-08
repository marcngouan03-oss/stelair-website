import AdminResourceManager from "../../components/AdminResourceManager";

const fieldsConfig = [
  {
    name: "platform",
    label: "Reseau",
    type: "select",
    options: [
      { value: "whatsapp", label: "WhatsApp" },
      { value: "instagram", label: "Instagram" },
      { value: "facebook", label: "Facebook" },
      { value: "tiktok", label: "TikTok" },
      { value: "x", label: "X (Twitter)" },
      { value: "youtube", label: "YouTube" },
      { value: "snapchat", label: "Snapchat" },
      { value: "other", label: "Autre" },
    ],
  },
  { name: "label", label: "Nom affiche (optionnel)", type: "text" },
  { name: "url", label: "Lien du profil", type: "url" },
  { name: "image", label: "Logo (image)", type: "image" },
  { name: "order", label: "Ordre d'affichage", type: "number" },
  { name: "isActive", label: "Actif sur le site", type: "checkbox" },
];

export default function AdminSocials() {
  return (
    <AdminResourceManager
      endpoint="socials"
      title="Reseaux sociaux"
      fieldsConfig={fieldsConfig}
      displayField="platform"
      emptyDefaults={{ platform: "whatsapp", order: 0, isActive: true }}
    />
  );
}