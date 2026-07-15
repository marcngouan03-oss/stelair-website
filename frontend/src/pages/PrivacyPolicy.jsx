import { Link } from "react-router-dom";
import "../styles/pages.css";

const CONSENT_KEY = "stelair_cookie_consent";

export default function PrivacyPolicy() {
  const resetCookieChoice = () => {
    localStorage.removeItem(CONSENT_KEY);
    window.location.reload();
  };

  return (
    <section className="section" style={{ paddingTop: 140 }}>
      <div className="container legal-page">
        <span className="eyebrow">Informations legales</span>
        <h1 className="section-title" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
          Politique de confidentialite
        </h1>
        <p className="section-lede" style={{ maxWidth: 720 }}>
          Cette page explique simplement quelles donnees le site officiel de STELAIR collecte,
          pourquoi, et comment vous pouvez garder le controle dessus. Derniere mise a jour :
          juillet 2026.
        </p>

        <div className="legal-page__body">
          <h2>Qui gere ce site</h2>
          <p>
            Le site officiel de l&apos;artiste STELAIR est edite et gere par l&apos;equipe de
            STELAIR. Pour toute question relative a vos donnees personnelles ou a cette politique,
            vous pouvez nous ecrire directement depuis la <Link to="/contact">page Contact</Link>{" "}
            du site.
          </p>

          <h2>Les donnees que nous collectons</h2>
          <p>
            Lorsque vous remplissez le formulaire de contact ou de collaboration, nous recevons
            votre nom complet, votre adresse electronique, votre numero de telephone si vous
            choisissez de le renseigner, le nom de votre structure ou de votre label si vous en
            avez un, le type de demande que vous faites, le message que vous ecrivez, et un lien
            vers un extrait ou un portfolio si vous en fournissez un. Ces informations nous sont
            transmises pour que nous puissions traiter votre demande de booking, de collaboration
            musicale ou de partenariat.
          </p>
          <p>
            Lorsque vous naviguez sur le site et que vous acceptez les cookies de mesure
            d&apos;audience, nous recevons egalement des informations techniques anonymisees sur
            votre visite, comme les pages que vous consultez, la duree de votre visite et le type
            d&apos;appareil que vous utilisez, par l&apos;intermediaire de Google Analytics.
          </p>
          <p>
            Nous ne demandons jamais de mot de passe, de donnees bancaires ou de piece
            d&apos;identite aux visiteurs du site.
          </p>

          <h2>Pourquoi nous utilisons ces donnees</h2>
          <p>
            Nous utilisons les informations que vous nous transmettez pour repondre a vos demandes
            de collaboration, de booking ou de presse, pour comprendre comment le site est utilise
            afin de continuer a l&apos;ameliorer, et pour assurer le bon fonctionnement des
            differentes parties du site, comme le concours SmackBeat ou la gestion du contenu
            publie.
          </p>

          <h2>Les cookies utilises sur ce site</h2>
          <p>
            Un cookie est un petit fichier depose sur votre appareil lors de votre visite. Sur ce
            site, nous utilisons uniquement les cookies de Google Analytics, qui nous permettent
            de reconnaitre un visiteur au fil de sa navigation et de mesurer la frequentation
            globale du site de maniere anonymisee. Ces cookies restent presents sur votre appareil
            pendant treize mois au maximum, puis disparaissent automatiquement. Nous deposons
            egalement un cookie qui sert uniquement a memoriser votre choix d&apos;avoir accepte
            ou refuse les cookies, afin de ne pas vous redemander votre avis a chaque visite ; ce
            cookie reste actif jusqu&apos;a ce que vous le modifiiez vous-meme.
          </p>
          <p>
            Tant que vous n&apos;avez pas accepte les cookies de mesure d&apos;audience, Google
            Analytics n&apos;est pas charge sur votre navigateur et aucun de ces cookies, hormis
            celui qui memorise votre choix, n&apos;est depose sur votre appareil.
          </p>

          <h2>Gerer votre choix a tout moment</h2>
          <p>
            Vous pouvez changer d&apos;avis quand vous le souhaitez. Le bouton ci-dessous efface
            votre choix actuel et fait reapparaitre le bandeau de consentement pour que vous
            puissiez choisir a nouveau.
          </p>
          <button type="button" className="btn btn-outline" onClick={resetCookieChoice}>
            Modifier mon choix de cookies
          </button>
          <p style={{ marginTop: 16 }}>
            Vous pouvez egalement supprimer les cookies directement depuis les reglages de votre
            navigateur a tout moment.
          </p>

          <h2>Avec qui nous partageons vos donnees</h2>
          <p>
            Nous ne vendons ni ne louons jamais vos donnees a qui que ce soit. Elles peuvent
            uniquement etre transmises aux prestataires techniques qui nous permettent de faire
            fonctionner le site : Google Analytics pour la mesure d&apos;audience, uniquement si
            vous avez accepte les cookies, Cloudinary pour l&apos;hebergement des images, des
            videos et des musiques affichees sur le site, ainsi que notre hebergeur technique, qui
            fait fonctionner le site et sa base de donnees.
          </p>

          <h2>Combien de temps nous conservons vos donnees</h2>
          <p>
            Les demandes de collaboration que vous nous envoyez sont conservees le temps
            necessaire a leur traitement, puis archivees ou supprimees. Les donnees de mesure
            d&apos;audience sont conservees selon la duree par defaut appliquee par Google
            Analytics, soit treize mois au maximum.
          </p>

          <h2>Vos droits</h2>
          <p>
            Conformement a la reglementation sur la protection des donnees personnelles, vous
            disposez du droit de consulter les donnees que nous detenons sur vous, de les faire
            corriger si elles sont inexactes, de demander leur suppression, et de vous opposer a
            leur utilisation. Pour exercer l&apos;un de ces droits, contactez-nous via la{" "}
            <Link to="/contact">page Contact</Link> en precisant clairement votre demande.
          </p>

          <h2>Securite de vos donnees</h2>
          <p>
            Vos donnees sont stockees sur une base de donnees securisee, dont l&apos;acces
            reserve a l&apos;administration du site est protege par une authentification. Nous
            faisons notre possible pour proteger vos informations contre tout acces non autorise.
          </p>

          <h2>Modifications de cette politique</h2>
          <p>
            Cette politique peut evoluer dans le temps, par exemple si de nouveaux outils sont
            ajoutes au site. La date de mise a jour indiquee en haut de cette page est actualisee
            a chaque changement important.
          </p>
        </div>
      </div>
    </section>
  );
}
