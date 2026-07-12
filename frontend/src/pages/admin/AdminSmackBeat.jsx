import { useEffect, useState } from "react";
import api from "../../api/api";
import MediaUploader from "../../components/MediaUploader";

export default function AdminSmackBeat() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(function () {
    api.get("/smackbeat").then(function (r) {
      setData(r.data);
    });
  }, []);

  function handleChange(name, value) {
    setData(function (prev) {
      return { ...prev, [name]: value };
    });
  }

  function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    api
      .put("/smackbeat", data)
      .then(function (res) {
        setData(res.data);
        setMessage("SmackBeat enregistre avec succes.");
      })
      .catch(function () {
        setMessage("Erreur lors de l'enregistrement.");
      })
      .finally(function () {
        setSaving(false);
      });
  }

  if (!data) {
    return <div className="loading-screen">Chargement...</div>;
  }

  return (
    <div>
      <span className="eyebrow">Contenu</span>
      <h2 className="section-title" style={{ fontSize: "2rem" }}>
        SmackBeat — Challenge du mois
      </h2>

      <form className="admin-form" onSubmit={handleSave} style={{ maxWidth: 780 }}>
        <h3 className="admin-form__block-title">Regles</h3>

        <div className="form-field">
          <label>Texte des regles / presentation du challenge</label>
          <textarea
            rows={4}
            value={data.rulesText || ""}
            onChange={function (e) {
              handleChange("rulesText", e.target.value);
            }}
          />
        </div>

        <hr className="admin-form__divider" />
        <h3 className="admin-form__block-title">Etape 1 — Instrumental</h3>

        <MediaUploader
          label="Instrumental du mois (audio)"
          folder="smackbeat"
          accept="audio/*"
          currentUrl={data.instrumentalUrl}
          onUploaded={function (url, publicId) {
            handleChange("instrumentalUrl", url);
            handleChange("instrumentalPublicId", publicId);
          }}
        />

        <hr className="admin-form__divider" />
        <h3 className="admin-form__block-title">Etape 2 — Studio</h3>

        <div className="collab-form__row">
          <div className="form-field">
            <label>Nom du studio</label>
            <input
              value={data.studioName || ""}
              onChange={function (e) {
                handleChange("studioName", e.target.value);
              }}
            />
          </div>
          <div className="form-field">
            <label>Numero de telephone du studio</label>
            <input
              value={data.studioPhone || ""}
              placeholder="+225 07 00 00 00 00"
              onChange={function (e) {
                handleChange("studioPhone", e.target.value);
              }}
            />
          </div>
        </div>

        <hr className="admin-form__divider" />
        <h3 className="admin-form__block-title">Etape 3 — TikTok</h3>

        <div className="form-field">
          <label>Instructions pour le challenge TikTok</label>
          <textarea
            rows={3}
            value={data.tiktokInstructions || ""}
            onChange={function (e) {
              handleChange("tiktokInstructions", e.target.value);
            }}
          />
        </div>

        <hr className="admin-form__divider" />
        <h3 className="admin-form__block-title">Prix a gagner (change chaque mois)</h3>

        <div className="form-field">
          <label>Texte des prix / recompenses</label>
          <textarea
            rows={3}
            value={data.prizeText || ""}
            onChange={function (e) {
              handleChange("prizeText", e.target.value);
            }}
          />
        </div>

        {message && <p style={{ color: "var(--c-lime)", fontSize: "0.88rem" }}>{message}</p>}

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Enregistrement..." : "Enregistrer le SmackBeat"}
        </button>
      </form>
    </div>
  );
}