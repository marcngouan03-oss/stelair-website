import { useState } from "react";
import api from "../api/api";
import "../styles/forms.css";

const projectTypes = [
  { value: "featuring", label: "Featuring / Collaboration musicale" },
  { value: "booking_concert", label: "Booking concert / evenement" },
  { value: "production", label: "Production / Beat" },
  { value: "partenariat", label: "Partenariat / Marque" },
  { value: "presse", label: "Presse / Media" },
  { value: "autre", label: "Autre" },
];

const initialState = {
  fullName: "",
  email: "",
  phone: "",
  projectType: "autre",
  company: "",
  message: "",
  linkToWork: "",
};

export default function CollabForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      await api.post("/collab", form);
      setStatus("success");
      setForm(initialState);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err?.response?.data?.message || "Une erreur est survenue, reessayez.");
    }
  };

  if (status === "success") {
    return (
      <div className="form-success">
        <span className="eq"><span /><span /><span /><span /></span>
        <h3>Message envoye !</h3>
        <p>Merci pour votre proposition, l&apos;equipe de STELAIR reviendra vers vous rapidement.</p>
        <button className="btn btn-outline" onClick={() => setStatus("idle")}>
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form className="collab-form" onSubmit={handleSubmit}>
      <div className="collab-form__row">
        <div className="form-field">
          <label htmlFor="fullName">Nom complet *</label>
          <input id="fullName" name="fullName" required value={form.fullName} onChange={handleChange} placeholder="Votre nom" />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email *</label>
          <input id="email" type="email" name="email" required value={form.email} onChange={handleChange} placeholder="vous@exemple.com" />
        </div>
      </div>

      <div className="collab-form__row">
        <div className="form-field">
          <label htmlFor="phone">Telephone</label>
          <input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+225 ..." />
        </div>
        <div className="form-field">
          <label htmlFor="company">Structure / Label</label>
          <input id="company" name="company" value={form.company} onChange={handleChange} placeholder="Nom de votre structure (optionnel)" />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="projectType">Type de demande *</label>
        <select id="projectType" name="projectType" value={form.projectType} onChange={handleChange}>
          {projectTypes.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="linkToWork">Lien vers un extrait / portfolio</label>
        <input id="linkToWork" name="linkToWork" value={form.linkToWork} onChange={handleChange} placeholder="https://..." />
      </div>

      <div className="form-field">
        <label htmlFor="message">Message *</label>
        <textarea id="message" name="message" required rows={5} value={form.message} onChange={handleChange} placeholder="Decrivez votre projet..." />
      </div>

      {status === "error" && <p className="form-error">{errorMsg}</p>}

      <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
        {status === "sending" ? "Envoi en cours..." : "Envoyer la demande"}
      </button>
    </form>
  );
}
