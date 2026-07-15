import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadGoogleAnalytics } from "../utils/analytics";
import "../styles/cookie-consent.css";

const STORAGE_KEY = "stelair_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "accepted") {
      loadGoogleAnalytics();
    } else if (saved !== "rejected") {
      // Aucun choix enregistre : on demande, et on ne charge rien tant que
      // l'utilisateur n'a pas repondu.
      setVisible(true);
    }
  }, []);

  // Tant qu'aucun choix n'est fait, on bloque le defilement et les clics
  // derriere le bandeau : impossible d'utiliser le site sans choisir.
  useEffect(() => {
    if (!visible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  const acceptAll = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    loadGoogleAnalytics();
    setVisible(false);
  };

  const rejectAll = () => {
    localStorage.setItem(STORAGE_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      <div className="cookie-consent__backdrop" />
      <div className="cookie-consent" role="dialog" aria-modal="true" aria-label="Consentement aux cookies">
        <div className="cookie-consent__text">
          <strong>Ce site utilise des cookies</strong>
          <p>
            Le site officiel de STELAIR utilise des cookies afin de mesurer son audience et de
            comprendre comment il est utilise, dans le but de l&apos;ameliorer au fil du temps.
            Ces cookies sont geres par Google Analytics et ne sont deposes sur votre appareil que
            si vous les acceptez explicitement : tant que vous n&apos;avez pas fait de choix,
            aucun cookie de mesure d&apos;audience n&apos;est charge.
          </p>
          <p>
            Si vous cliquez sur « Tout accepter », vous nous autorisez a utiliser ces cookies
            pendant votre visite. Si vous cliquez sur « Tout refuser », aucun cookie de ce type ne
            sera utilise et votre navigation ne sera pas mesuree. Dans les deux cas, votre choix
            est enregistre sur cet appareil et vous pourrez le modifier a tout moment depuis notre
            page <Link to="/politique-confidentialite">Politique de confidentialite</Link>, ou
            vous trouverez le detail complet des donnees collectees et de vos droits.
          </p>
        </div>
        <div className="cookie-consent__actions">
          <button className="cookie-consent__btn cookie-consent__btn--reject" onClick={rejectAll}>
            Tout refuser
          </button>
          <button className="cookie-consent__btn cookie-consent__btn--accept" onClick={acceptAll}>
            Tout accepter
          </button>
        </div>
      </div>
    </>
  );
}
