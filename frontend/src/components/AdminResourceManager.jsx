import { useEffect, useState } from "react";
import api from "../api/api";
import MediaUploader from "./MediaUploader";
import "../styles/admin.css";

// Gestionnaire CRUD generique utilise par toutes les sections simples de l'admin
// (heros, titres, videos, reseaux sociaux, plateformes, agents). On lui donne juste
// la config des champs et il affiche la liste + le formulaire de creation/edition.
//
// fieldsConfig: [{ name, label, type, options?, folder?, accept? }]
// types geres: text | textarea | number | checkbox | select | image | video | url
export default function AdminResourceManager({
  endpoint,
  title,
  fieldsConfig,
  displayField = "title",
  emptyDefaults = {},
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = liste, {} = nouveau, {...} = edition
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api
      .get(`/${endpoint}/all`)
      .then((r) => setItems(r.data))
      .catch(() => setError("Impossible de charger les donnees."))
      .finally(() => setLoading(false));
  };

  useEffect(load, [endpoint]);

  const startCreate = () => setEditing({ ...emptyDefaults });
  const startEdit = (item) => setEditing({ ...item });
  const cancel = () => {
    setEditing(null);
    setError("");
  };

  const handleChange = (name, value) => {
    setEditing((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing._id) {
        await api.put(`/${endpoint}/${editing._id}`, editing);
      } else {
        await api.post(`/${endpoint}`, editing);
      }
      setEditing(null);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer definitivement cet element ?")) return;
    try {
      await api.delete(`/${endpoint}/${id}`);
      load();
    } catch {
      setError("Suppression impossible.");
    }
  };

  const toggleActive = async (item) => {
    try {
      await api.put(`/${endpoint}/${item._id}`, { isActive: !item.isActive });
      load();
    } catch {
      setError("Impossible de changer le statut.");
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <h2>{title}</h2>
        {!editing && (
          <button className="btn btn-primary" onClick={startCreate}>
            + Ajouter
          </button>
        )}
      </div>

      {error && <p className="form-error">{error}</p>}

      {editing ? (
        <form className="admin-form" onSubmit={handleSave}>
          {fieldsConfig.map((field) => (
            <AdminField key={field.name} field={field} value={editing[field.name]} onChange={handleChange} />
          ))}

          <div className="admin-form__actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button type="button" className="btn btn-outline" onClick={cancel}>
              Annuler
            </button>
          </div>
        </form>
      ) : loading ? (
        <div className="loading-screen">Chargement...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">Aucun element pour le moment. Cliquez sur "+ Ajouter".</div>
      ) : (
        <div className="admin-list">
          {items.map((item) => (
            <div key={item._id} className={`admin-list__row ${item.isActive === false ? "admin-list__row--inactive" : ""}`}>
              <span className="admin-list__title">{item[displayField] || item.platform || item.name || "(sans titre)"}</span>
              <div className="admin-list__actions">
                {"isActive" in item && (
                  <button className="admin-chip" onClick={() => toggleActive(item)}>
                    {item.isActive ? "Actif" : "Inactif"}
                  </button>
                )}
                <button className="btn btn-outline btn-sm" onClick={() => startEdit(item)}>
                  Modifier
                </button>
                <button className="btn btn-outline btn-sm btn-danger" onClick={() => handleDelete(item._id)}>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminField({ field, value, onChange }) {
  const { name, label, type, options, folder, accept, required } = field;

  if (type === "textarea") {
    return (
      <div className="form-field">
        <label>{label}{required && " *"}</label>
        <textarea required={required} rows={4} value={value || ""} onChange={(e) => onChange(name, e.target.value)} />
      </div>
    );
  }

  if (type === "checkbox") {
    return (
      <div className="form-field form-field--checkbox">
        <label>
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(name, e.target.checked)} />
          {label}
        </label>
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className="form-field">
        <label>{label}{required && " *"}</label>
        <select value={value || ""} onChange={(e) => onChange(name, e.target.value)}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === "image" || type === "video") {
    const publicIdField = `${name}PublicId`;
    return (
      <MediaUploader
        label={label}
        folder={folder || "misc"}
        accept={accept || (type === "video" ? "video/*" : "image/*")}
        currentUrl={value}
        onUploaded={(url, publicId) => {
          onChange(name, url);
          onChange(publicIdField, publicId);
        }}
      />
    );
  }

  if (type === "number") {
    return (
      <div className="form-field">
        <label>{label}</label>
        <input type="number" value={value ?? 0} onChange={(e) => onChange(name, Number(e.target.value))} />
      </div>
    );
  }

  return (
    <div className="form-field">
      <label>{label}{required && " *"}</label>
      <input required={required} type="text" value={value || ""} onChange={(e) => onChange(name, e.target.value)} />
    </div>
  );
}