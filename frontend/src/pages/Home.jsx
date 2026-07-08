import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import HeroSection from "../components/HeroSection";
import "../styles/pages.css";

export default function Home() {
  const [bio, setBio] = useState(null);

  useEffect(function () {
    api.get("/bio").then(function (r) {
      setBio(r.data);
    }).catch(function () {});
  }, []);

  let bioImageBlock = <div className="bio-teaser__placeholder" />;
  if (bio && bio.introImage) {
    bioImageBlock = <img src={bio.introImage} alt="STELAIR" />;
  }

  return (
    <>
      <HeroSection
        page="home"
        fallbackTitle="STELAIR"
        fallbackSubtitle="Artiste, auteur, compositeur ivoirien. Cameleon musical entre afrobeat, drill et flows rap percutants."
      />

      <section className="section section--alt">
        <div className="container bio-teaser">
          <div className="bio-teaser__image">{bioImageBlock}</div>
          <div className="bio-teaser__text">
            <span className="eyebrow">Qui est STELAIR</span>
            <h2 className="section-title">Un cameleon musical</h2>
            <p className="section-lede">
              Ne le 31 juillet 1993 a Treichville, STELAIR fusionne afrobeat, drill et flows rap
              percutants pour offrir une palette musicale riche et un talent indeniable.
            </p>
            <Link to="/biographie" className="btn btn-primary" style={{ marginTop: 20 }}>
              Decouvrir sa biographie
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}