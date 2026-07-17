import { useEffect, useState } from "react";
import api from "../../api/api";
import MediaUploader from "../../components/MediaUploader";

export default function AdminShopSettings() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/shop-settings").then((r) => setData(r.data));
  }, []);

  const handleChange = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    api
      .put("/shop-settings", data)
      .then((r) => {
        setData(r.data);
        setMessage("Reglages enregistres avec succes.");
      })
      .catch(() => setMessage("Erreur lors de l'enregistrement."))
      .finally(() => setSaving(false));
  };

  if (!data) return <div className="loading-screen">Chargement...</div>;

  return (
    <div>
      <span className="eyebrow">Boutique</span>
      <h2 className="section-title" style={{ fontSize: "2rem" }}>
        Reglages
      </h2>

      <form className="admin-form" onSubmit={handleSave} style={{ maxWidth: 480 }}>
        <p style={{ color: "var(--c-grey)", fontSize: "0.88rem", marginBottom: 6 }}>
          Sans logo, le badge PayPal officiel s&apos;affiche par defaut.
        </p>

        <MediaUploader
          label="Logo de paiement (optionnel)"
          folder="shop"
          accept="image/*"
          currentUrl={data.paymentLogo}
          onUploaded={(url, publicId) => {
            handleChange("paymentLogo", url);
            handleChange("paymentLogoPublicId", publicId);
          }}
        />

        {message && <p style={{ color: "var(--c-lime)", fontSize: "0.88rem" }}>{message}</p>}

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}
