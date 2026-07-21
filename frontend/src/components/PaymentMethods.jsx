import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/payment-methods.css";

// Logos des moyens de paiement geres depuis l'admin (Boutique - Logos de
// paiement). Rien ne s'affiche tant que l'artiste n'a pas ajoute de logo.
export default function PaymentMethods({ className = "", style }) {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    api.get("/payment-logos").then((r) => setLogos(r.data)).catch(() => {});
  }, []);

  if (logos.length === 0) return null;

  return (
    <div className={`payment-methods ${className}`} style={style}>
      {logos.map((logo) => (
        <span key={logo._id} className="payment-methods__badge" title={logo.label}>
          <img src={logo.image} alt={logo.label} />
        </span>
      ))}
    </div>
  );
}
