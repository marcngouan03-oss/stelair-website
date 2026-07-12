import AdminResourceManager from "../../components/AdminResourceManager";

const fieldsConfig = [
  { name: "month", label: "Mois (ex: Juillet 2026)", type: "text", required: true },
  { name: "winnerName", label: "Nom du gagnant", type: "text", required: true },
  { name: "tiktokUrl", label: "Lien du compte / de la video TikTok", type: "url" },
  { name: "description", label: "Description / presentation", type: "textarea" },
  { name: "image", label: "Photo (optionnel)", type: "image" },
  { name: "order", label: "Ordre d'affichage", type: "number" },
  { name: "isActive", label: "Visible sur le site", type: "checkbox" },
];

export default function AdminSmackBeatWinners() {
  return (
    <AdminResourceManager
      endpoint="smackbeat-winners"
      title="SmackBeat — Gagnants"
      fieldsConfig={fieldsConfig}
      displayField="winnerName"
      emptyDefaults={{ month: "", winnerName: "", order: 0, isActive: true }}
    />
  );
}