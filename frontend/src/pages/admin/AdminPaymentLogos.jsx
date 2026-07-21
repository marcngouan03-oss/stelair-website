import AdminResourceManager from "../../components/AdminResourceManager";

const fieldsConfig = [
  { name: "label", label: "Nom (ex: Visa, Apple Pay, Wave...)", type: "text", required: true },
  { name: "image", label: "Logo (image)", type: "image", folder: "payment-logos" },
  { name: "order", label: "Ordre d'affichage", type: "number" },
  { name: "isActive", label: "Affiche sur le site", type: "checkbox" },
];

export default function AdminPaymentLogos() {
  return (
    <AdminResourceManager
      endpoint="payment-logos"
      title="Logos des moyens de paiement"
      fieldsConfig={fieldsConfig}
      displayField="label"
      emptyDefaults={{ label: "", order: 0, isActive: true }}
    />
  );
}
