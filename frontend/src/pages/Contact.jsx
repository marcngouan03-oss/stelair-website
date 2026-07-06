import { useEffect, useState } from "react";
import api from "../api/api";
import HeroSection from "../components/HeroSection";
import CollabForm from "../components/CollabForm";
import "../styles/pages.css";

export default function Contact() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    api.get("/agents").then((r) => setAgents(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <HeroSection page="contact" fallbackTitle="Contact" fallbackSubtitle="Booking, presse, collaborations : parlons de votre projet." />

      <section className="section">
        <div className="container contact-grid">
          <div>
            <span className="eyebrow">Une idee de projet ?</span>
            <h2 className="section-title">Proposer une collaboration</h2>
            <p className="section-lede">
              Featuring, booking, production ou partenariat : remplissez le formulaire et
              l&apos;equipe de STELAIR vous repondra rapidement.
            </p>
            <CollabForm />
          </div>

          <aside className="contact-agents">
            <span className="eyebrow">Contacts</span>
            <h3>Agents &amp; management</h3>
            {agents.length === 0 && <div className="empty-state">Contacts a venir.</div>}
            {agents.map((a) => (
              <div key={a._id} className="agent-card">
                {a.photo && <img src={a.photo} alt={a.name} className="agent-card__photo" />}
                <div>
                  <strong>{a.name}</strong>
                  <span className="agent-card__role">{a.role}</span>
                  <a href={`mailto:${a.email}`} className="agent-card__email">
                    {a.email}
                  </a>
                  {a.phone && <span className="agent-card__phone">{a.phone}</span>}
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>
    </>
  );
}
