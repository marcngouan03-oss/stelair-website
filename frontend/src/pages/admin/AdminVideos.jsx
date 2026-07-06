import AdminResourceManager from "../../components/AdminResourceManager";

const fieldsConfig = [
  { name: "title", label: "Titre du clip", type: "text" },
  { name: "youtubeUrl", label: "Lien YouTube (colle depuis l'app/site)", type: "url" },
  { name: "thumbnail", label: "Vignette personnalisee (optionnel)", type: "image", folder: "videos" },
  { name: "description", label: "Description courte", type: "textarea" },
  { name: "featured", label: "Mettre en avant", type: "checkbox" },
  { name: "order", label: "Ordre d'affichage", type: "number" },
  { name: "isActive", label: "Actif sur le site", type: "checkbox" },
];

export default function AdminVideos() {
  return (
    <AdminResourceManager
      endpoint="videos"
      title="Videos"
      fieldsConfig={fieldsConfig}
      displayField="title"
      emptyDefaults={{ order: 0, isActive: true, featured: false }}
    />
  );
}
