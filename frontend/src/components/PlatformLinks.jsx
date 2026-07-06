import { useEffect, useState } from "react";
import { createElement as h } from "react";
import api from "../api/api";
import "../styles/platforms.css";

const labels = {
  spotify: "Spotify",
  apple: "Apple Music",
  soundcloud: "SoundCloud",
  deezer: "Deezer",
  youtubemusic: "YouTube Music",
  tidal: "Tidal",
  other: "Ecouter",
};

export default function PlatformLinks() {
  const [platforms, setPlatforms] = useState([]);

  useEffect(function () {
    api.get("/platforms")
      .then(function (r) {
        setPlatforms(r.data);
      })
      .catch(function () {});
  }, []);

  if (platforms.length === 0) {
    return null;
  }

  const badges = platforms.map(function (p) {
    const name = p.label || labels[p.platform] || p.platform;

    if (p.logo) {
      const logoImg = h("img", { src: p.logo, alt: name });
      return h(
        "a",
        {
          key: p._id,
          href: p.url,
          target: "_blank",
          rel: "noreferrer",
          className: "platform-logo-badge",
          "aria-label": name,
          title: name,
        },
        logoImg
      );
    }

    return h(
      "a",
      {
        key: p._id,
        href: p.url,
        target: "_blank",
        rel: "noreferrer",
        className: "platform-badge platform-badge--" + p.platform,
      },
      name
    );
  });

  return h("div", { className: "platform-links" }, badges);
}