import AdminResourceManager from "../../components/AdminResourceManager";

const fieldsConfig = [
  { name: "name", label: "Nom", type: "text" },
  { name: "role", label: "Role (ex: Booking, Management, Presse)", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "phone", label: "Telephone (optionnel)", type: "text" },
  { name: "photo", label: "Photo (optionnel)", type: "image", folder: "agents" },
  { name: "order", label: "Ordre d'affichage", type: "number" },
  { name: "isActive", label: "Actif sur le site", type: "checkbox" },
];

export default function AdminAgents() {
  return (
    <AdminResourceManager
      endpoint="agents"
      title="Agents / Contacts"
      fieldsConfig={fieldsConfig}
      displayField="name"
      emptyDefaults={{ role: "Agent", order: 0, isActive: true }}
    />
  );
}
