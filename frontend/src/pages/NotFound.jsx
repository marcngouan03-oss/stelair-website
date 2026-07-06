import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="section" style={{ minHeight: "70vh", display: "flex", alignItems: "center" }}>
      <div className="container" style={{ textAlign: "center" }}>
        <span className="eyebrow">404</span>
        <h1 className="section-title">Page introuvable</h1>
        <p className="section-lede" style={{ margin: "0 auto 30px" }}>
          Ce lien n&apos;existe pas ou plus.
        </p>
        <Link to="/" className="btn btn-primary">
          Retour a l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
