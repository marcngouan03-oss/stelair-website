import AdminResourceManager from "../../components/AdminResourceManager";

const fieldsConfig = [
  { name: "title", label: "Titre", type: "text" },
  {
    name: "type",
    label: "Type",
    type: "select",
    options: [
      { value: "track", label: "Titre / Single" },
      { value: "album", label: "Album" },
      { value: "playlist", label: "Playlist" },
      { value: "artist", label: "Page artiste" },
    ],
  },
  {
    name: "platform",
    label: "Plateforme",
    type: "select",
    options: [
      { value: "spotify", label: "Spotify" },
      { value: "deezer", label: "Deezer" },
      { value: "soundcloud", label: "SoundCloud" },
      { value: "apple", label: "Apple Music" },
      { value: "other", label: "Autre" },
    ],
  },
  { name: "sourceUrl", label: "Lien colle (Spotify / Deezer / SoundCloud)", type: "url" },
  { name: "coverImage", label: "Image de couverture", type: "image", folder: "tracks" },
  { name: "description", label: "Description courte", type: "textarea" },
  { name: "featured", label: "Mettre en avant (grand lecteur sur l'accueil)", type: "checkbox" },
  { name: "order", label: "Ordre d'affichage", type: "number" },
  { name: "isActive", label: "Actif sur le site", type: "checkbox" },
];

export default function AdminTracks() {
  return (
    <AdminResourceManager
      endpoint="tracks"
      title="Musique"
      fieldsConfig={fieldsConfig}
      displayField="title"
      emptyDefaults={{ type: "track", platform: "spotify", order: 0, isActive: true, featured: false }}
    />
  );
}
