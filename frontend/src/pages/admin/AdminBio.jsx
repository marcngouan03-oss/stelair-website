import { useEffect, useState } from "react";
import api from "../../api/api";
import MediaUploader from "../../components/MediaUploader";

function emptySection() {
  return {
    title: "",
    text: "",
    image: "",
    imagePublicId: "",
    imagePosition: "right",
    stat: "",
    certification: "",
    spotifyUrl: "",
    order: 0,
  };
}

export default function AdminBio() {
  const [bio, setBio] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(function () {
    api.get("/bio").then(function (r) {
      setBio(r.data);
    });
  }, []);

  function handleChange(name, value) {
    setBio(function (prev) {
      return { ...prev, [name]: value };
    });
  }

  function handleSectionChange(index, field, value) {
    const updated = [...bio.sections];
    updated[index] = { ...updated[index], [field]: value };
    setBio({ ...bio, sections: updated });
  }

  function addSection() {
    const currentSections = bio.sections || [];
    setBio({ ...bio, sections: [...currentSections, emptySection()] });
  }

  function removeSection(index) {
    const updated = [...bio.sections];
    updated.splice(index, 1);
    setBio({ ...bio, sections: updated });
  }

  function moveSection(index, direction) {
    const updated = [...bio.sections];
    const target = index + direction;
    if (target < 0 || target >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setBio({ ...bio, sections: updated });
  }

  function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    api
      .put("/bio", bio)
      .then(function (res) {
        setBio(res.data);
        setMessage("Biographie enregistree avec succes.");
      })
      .catch(function () {
        setMessage("Erreur lors de l'enregistrement.");
      })
      .finally(function () {
        setSaving(false);
      });
  }

  if (!bio) {
    return <div className="loading-screen">Chargement...</div>;
  }

  const sections = bio.sections || [];

  return (
    <div>
      <span className="eyebrow">Contenu</span>
      <h2 className="section-title" style={{ fontSize: "2rem" }}>
        Biographie
      </h2>

      <form className="admin-form" onSubmit={handleSave} style={{ maxWidth: 780 }}>
        <h3 className="admin-form__block-title">En-tete de la page</h3>

        <div className="form-field">
          <label>Titre principal de la page</label>
          <input
            value={bio.pageTitle || ""}
            onChange={function (e) {
              handleChange("pageTitle", e.target.value);
            }}
          />
        </div>

        <div className="form-field">
          <label>Sous-titre</label>
          <input
            value={bio.pageSubtitle || ""}
            onChange={function (e) {
              handleChange("pageSubtitle", e.target.value);
            }}
          />
        </div>

        <div className="form-field">
          <label>Texte d'introduction</label>
          <textarea
            rows={4}
            value={bio.introText || ""}
            onChange={function (e) {
              handleChange("introText", e.target.value);
            }}
          />
        </div>

        <MediaUploader
          label="Grande image d'introduction"
          folder="bio"
          currentUrl={bio.introImage}
          onUploaded={function (url, publicId) {
            handleChange("introImage", url);
            handleChange("introImagePublicId", publicId);
          }}
        />

        <div className="collab-form__row">
          <div className="form-field">
            <label>Nom complet reel</label>
            <input
              value={bio.realName || ""}
              onChange={function (e) {
                handleChange("realName", e.target.value);
              }}
            />
          </div>
          <div className="form-field">
            <label>Date de naissance</label>
            <input
              value={bio.birthDate || ""}
              onChange={function (e) {
                handleChange("birthDate", e.target.value);
              }}
            />
          </div>
        </div>

        <div className="form-field">
          <label>Lieu de naissance</label>
          <input
            value={bio.birthPlace || ""}
            onChange={function (e) {
              handleChange("birthPlace", e.target.value);
            }}
          />
        </div>

        <div className="form-field">
          <label>Citation mise en avant</label>
          <input
            value={bio.musicQuote || ""}
            onChange={function (e) {
              handleChange("musicQuote", e.target.value);
            }}
          />
        </div>

        <hr className="admin-form__divider" />
        <h3 className="admin-form__block-title">Blocs de biographie </h3>
        <p className="admin-form__hint">
          Chaque bloc peut avoir un titre, un texte, une image, des chiffres de vente, une
          certification et un album Spotify integre.
        </p>

        {sections.map(function (s, i) {
          return (
            <div key={i} className="admin-section-block">
              <div className="admin-section-block__header">
                <strong>Bloc {i + 1}</strong>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    className="admin-chip"
                    onClick={function () {
                      moveSection(i, -1);
                    }}
                  >
                    Monter
                  </button>
                  <button
                    type="button"
                    className="admin-chip"
                    onClick={function () {
                      moveSection(i, 1);
                    }}
                  >
                    Descendre
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm btn-danger"
                    onClick={function () {
                      removeSection(i);
                    }}
                  >
                    Supprimer ce bloc
                  </button>
                </div>
              </div>

              <div className="form-field">
                <label>Titre du bloc</label>
                <input
                  value={s.title}
                  onChange={function (e) {
                    handleSectionChange(i, "title", e.target.value);
                  }}
                />
              </div>

              <div className="form-field">
                <label>Texte du bloc</label>
                <textarea
                  rows={4}
                  value={s.text}
                  onChange={function (e) {
                    handleSectionChange(i, "text", e.target.value);
                  }}
                />
              </div>

              <MediaUploader
                label="Image du bloc"
                folder="bio"
                currentUrl={s.image}
                onUploaded={function (url, publicId) {
                  handleSectionChange(i, "image", url);
                  handleSectionChange(i, "imagePublicId", publicId);
                }}
              />

              <div className="form-field">
                <label>Position de l'image</label>
                <select
                  value={s.imagePosition}
                  onChange={function (e) {
                    handleSectionChange(i, "imagePosition", e.target.value);
                  }}
                >
                  <option value="right">A droite</option>
                  <option value="left">A gauche</option>
                </select>
              </div>

              <div className="collab-form__row">
                <div className="form-field">
                  <label>Chiffre (ex: 375 000 ventes)</label>
                  <input
                    value={s.stat}
                    onChange={function (e) {
                      handleSectionChange(i, "stat", e.target.value);
                    }}
                  />
                </div>
                <div className="form-field">
                  <label>Certification (ex: Disque d'or)</label>
                  <input
                    value={s.certification}
                    onChange={function (e) {
                      handleSectionChange(i, "certification", e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Lien Spotify a integrer (optionnel)</label>
                <input
                  value={s.spotifyUrl}
                  placeholder="https://open.spotify.com/..."
                  onChange={function (e) {
                    handleSectionChange(i, "spotifyUrl", e.target.value);
                  }}
                />
              </div>
            </div>
          );
        })}

        <button type="button" className="btn btn-outline" onClick={addSection}>
          + Ajouter un bloc de biographie
        </button>

        {message && <p style={{ color: "var(--c-lime)", fontSize: "0.88rem" }}>{message}</p>}

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Enregistrement..." : "Enregistrer la biographie"}
        </button>
      </form>
    </div>
  );
}