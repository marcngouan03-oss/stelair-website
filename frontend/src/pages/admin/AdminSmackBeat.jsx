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

  function handleStudioChange(field, value) {
    setData(function (prev) {
      const studios = prev.studios && prev.studios.length > 0
        ? [...prev.studios]
        : [{ name: "", contact: "" }];
      studios[0] = { ...studios[0], [field]: value };
      return { ...prev, studios: studios };
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

  const studio = (data.studios && data.studios[0]) || { name: "", contact: "" };

  return (
    <div>
      <span className="eyebrow">Contenu</span>
      <h2 className="section-title" style={{ fontSize: "2rem" }}>
        SmackBeat &mdash; Challenge du mois
      </h2>

      <form className="admin-form" onSubmit={handleSave} style={{ maxWidth: 780 }}>
        <h3 className="admin-form__block-title">Presentation</h3>

        <MediaUploader
          label="Image du hero (fond sombre en haut de la page SmackBeat)"
          folder="smackbeat"
          accept="image/*"
          currentUrl={data.heroImage}
          onUploaded={function (url, publicId) {
            handleChange("heroImage", url);
            handleChange("heroImagePublicId", publicId);
          }}
        />

        <div className="form-field">
          <label>Phrase d'accroche (tagline)</label>
          <input
            value={data.tagline || ""}
            onChange={function (e) {
              handleChange("tagline", e.target.value);
            }}
          />
        </div>

        <div className="form-field">
          <label>Conditions du challenge (une condition par ligne)</label>
          <textarea
            rows={5}
            placeholder="telecharge l'instrumental&#10;fait un titre sur l'instrumental en studio&#10;cree un challenge sur tiktok..."
            value={data.rulesText || ""}
            onChange={function (e) {
              handleChange("rulesText", e.target.value);
            }}
          />
        </div>

        <hr className="admin-form__divider" />
        <h3 className="admin-form__block-title">Etape 1 &mdash; Instrumental</h3>

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
        <h3 className="admin-form__block-title">Etape 2 &mdash; Studio</h3>

        <div className="collab-form__row">
          <div className="form-field">
            <label>Nom du studio</label>
            <input
              value={studio.name || ""}
              onChange={function (e) {
                handleStudioChange("name", e.target.value);
              }}
            />
          </div>
          <div className="form-field">
            <label>Numero de telephone du studio</label>
            <input
              value={studio.contact || ""}
              placeholder="+225 07 00 00 00 00"
              onChange={function (e) {
                handleStudioChange("contact", e.target.value);
              }}
            />
          </div>
        </div>

        <hr className="admin-form__divider" />
        <h3 className="admin-form__block-title">Etape 3 &mdash; TikTok</h3>

        <div className="form-field">
          <label>Objectif de reprises TikTok (ex: 4000)</label>
          <input
            type="number"
            value={data.reprisesGoal != null ? data.reprisesGoal : 4000}
            onChange={function (e) {
              handleChange("reprisesGoal", Number(e.target.value));
            }}
          />
        </div>

        <MediaUploader
          label="Icone TikTok (affichee a cote de chaque vainqueur dans le classement)"
          folder="smackbeat"
          accept="image/*"
          currentUrl={data.tiktokIcon}
          onUploaded={function (url, publicId) {
            handleChange("tiktokIcon", url);
            handleChange("tiktokIconPublicId", publicId);
          }}
        />

        <hr className="admin-form__divider" />
        <h3 className="admin-form__block-title">Prix a Gagner (change chaque mois)</h3>

        <div className="collab-form__row">
          <div className="form-field">
            <label>Montant de la recompense (ex: 200 000)</label>
            <input
              value={data.prizeAmount || ""}
              onChange={function (e) {
                handleChange("prizeAmount", e.target.value);
              }}
            />
          </div>
          <div className="form-field">
            <label>Credit du clip (ex: un clip produit par KUMA.group)</label>
            <input
              value={data.clipCredit || ""}
              onChange={function (e) {
                handleChange("clipCredit", e.target.value);
              }}
            />
          </div>
        </div>

        {message && <p style={{ color: "var(--c-lime)", fontSize: "0.88rem" }}>{message}</p>}

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Enregistrement..." : "Enregistrer le SmackBeat"}
        </button>
      </form>
    </div>
  );
}