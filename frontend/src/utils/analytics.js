const GA_ID = "G-9QF6WZ939L";

// Charge Google Analytics dynamiquement. Appele uniquement si l'utilisateur
// a reellement accepte les cookies (jamais au chargement de la page par defaut).
export function loadGoogleAnalytics() {
  if (document.getElementById("ga-script")) return;

  const script = document.createElement("script");
  script.id = "ga-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_ID);
}
