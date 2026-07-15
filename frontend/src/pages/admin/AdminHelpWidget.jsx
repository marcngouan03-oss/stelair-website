import { useEffect, useState } from "react";
import api from "../../api/api";

function emptyItem() {
  return { text: "", link: "", linkLabel: "" };
}

export default function AdminHelpWidget() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(function () {
    api.get("/help-widget").then(function (r) {
      setData(r.data);
    });
  }, []);

  function handleChange(name, value) {
    setData(function (prev) {
      return { ...prev, [name]: value };
    });
  }

  function handleItemChange(index, field, value) {
    const updated = [...data.items];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, items: updated });
  }

  function addItem() {
    const currentItems = data.items || [];
    setData({ ...data, items: [...currentItems, emptyItem()] });
  }

  function removeItem(index) {
    const updated = [...data.items];
    updated.splice(index, 1);
    setData({ ...data, items: updated });
  }

  function moveItem(index, direction) {
    const updated = [...data.items];
    const target = index + direction;
    if (target < 0 || target >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setData({ ...data, items: updated });
  }

  function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    api
      .put("/help-widget", data)
      .then(function (res) {
        setData(res.data);
        setMessage("Bouton d'aide enregistre avec succes.");
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

  const items = data.items || [];

  return (
    <div>
      <span className="eyebrow">Contenu</span>
      <h2 className="section-title" style={{ fontSize: "2rem" }}>
        Bouton d&apos;aide &amp; actualites
      </h2>
      <p className="admin-form__hint" style={{ maxWidth: 640, marginBottom: 20 }}>
        Un bouton flottant affiche sur la page d&apos;accueil. Au clic, il deroule les actualites
        que vous ajoutez ci-dessous (ex : "Nouveau concours SmackBeat dans 2 mois" avec un lien
        vers la page SmackBeat, ou "Contactez l'equipe" avec un lien vers Contact).
      </p>

      <form className="admin-form" onSubmit={handleSave} style={{ maxWidth: 780 }}>
        <div className="form-field form-field--checkbox">
          <label>
            <input
              type="checkbox"
              checked={!!data.isActive}
              onChange={function (e) {
                handleChange("isActive", e.target.checked);
              }}
            />
            Afficher le bouton sur le site (activable a tout moment)
          </label>
        </div>

        <div className="form-field">
          <label>Texte affiche sur le bouton</label>
          <input
            value={data.buttonLabel || ""}
            placeholder="Besoin d'aide ?"
            onChange={function (e) {
              handleChange("buttonLabel", e.target.value);
            }}
          />
        </div>

        <hr className="admin-form__divider" />
        <h3 className="admin-form__block-title">Actualites affichees a l&apos;ouverture</h3>

        {items.map(function (item, i) {
          return (
            <div key={i} className="admin-section-block">
              <div className="admin-section-block__header">
                <strong>Actualite {i + 1}</strong>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    className="admin-chip"
                    onClick={function () {
                      moveItem(i, -1);
                    }}
                  >
                    Monter
                  </button>
                  <button
                    type="button"
                    className="admin-chip"
                    onClick={function () {
                      moveItem(i, 1);
                    }}
                  >
                    Descendre
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm btn-danger"
                    onClick={function () {
                      removeItem(i);
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              <div className="form-field">
                <label>Texte de l&apos;actualite</label>
                <textarea
                  rows={3}
                  placeholder="Ex : Un nouveau concours SmackBeat arrive dans 2 mois, prepare-toi !"
                  value={item.text}
                  onChange={function (e) {
                    handleItemChange(i, "text", e.target.value);
                  }}
                />
              </div>

              <div className="collab-form__row">
                <div className="form-field">
                  <label>Lien (optionnel)</label>
                  <input
                    placeholder="/smackbeat ou https://..."
                    value={item.link}
                    onChange={function (e) {
                      handleItemChange(i, "link", e.target.value);
                    }}
                  />
                </div>
                <div className="form-field">
                  <label>Texte du lien</label>
                  <input
                    placeholder="Voir SmackBeat"
                    value={item.linkLabel}
                    onChange={function (e) {
                      handleItemChange(i, "linkLabel", e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        <button type="button" className="btn btn-outline" onClick={addItem}>
          + Ajouter une actualite
        </button>

        {message && <p style={{ color: "var(--c-lime)", fontSize: "0.88rem" }}>{message}</p>}

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}
