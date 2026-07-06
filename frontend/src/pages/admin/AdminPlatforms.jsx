import AdminResourceManager from "../../components/AdminResourceManager";

const fieldsConfig = [
  {
    name: "platform",
    label: "Plateforme",
    type: "select",
    options: [
      { value: "spotify", label: "Spotify" },
      { value: "apple", label: "Apple Music" },
      { value: "soundcloud", label: "SoundCloud" },
      { value: "deezer", label: "Deezer" },
      { value: "youtubemusic", label: "YouTube Music" },
      { value: "tidal", label: "Tidal" },
      { value: "other", label: "Autre" },
    ],
  },
  { name: "label", label: "Nom affiche (optionnel)", type: "text" },
  { name: "url", label: "Lien de la page artiste", type: "url", required: true },
  { name: "logo", label: "Logo de la plateforme", type: "image", folder: "platforms" },
  { name: "order", label: "Ordre d'affichage", type: "number" },
  { name: "isActive", label: "Actif sur le site", type: "checkbox" },
];

export default function AdminPlatforms() {
  return (
    <AdminResourceManager
      endpoint="platforms"
      title="Plateformes de streaming"
      fieldsConfig={fieldsConfig}
      displayField="platform"
      emptyDefaults={{ platform: "spotify", order: 0, isActive: true }}
    />
  );
}