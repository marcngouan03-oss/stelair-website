// Transforme un lien "normal" colle par l'admin (Spotify, YouTube, Deezer, SoundCloud)
// en URL d'embed prete a etre mise dans un <iframe>. Comme ca, STELAIR n'a qu'a coller
// le lien qu'il copie depuis l'app Spotify / YouTube, sans rien configurer de plus.

export function getSpotifyEmbedUrl(url) {
  try {
    const clean = url.split("?")[0];
    const match = clean.match(/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
    if (!match) return null;
    const [, type, id] = match;
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
  } catch {
    return null;
  }
}

export function getYoutubeEmbedUrl(url) {
  try {
    let videoId = null;
    const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    const watch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    const embed = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    const shorts = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
    if (short) videoId = short[1];
    else if (watch) videoId = watch[1];
    else if (embed) videoId = embed[1];
    else if (shorts) videoId = shorts[1];
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
}

export function getYoutubeThumbnail(url) {
  const embedUrl = getYoutubeEmbedUrl(url);
  if (!embedUrl) return null;
  const id = embedUrl.split("/embed/")[1];
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

export function getDeezerEmbedUrl(url) {
  try {
    const match = url.match(/deezer\.com\/[a-z]{2}\/(track|album|playlist|artist)\/(\d+)/);
    if (!match) return null;
    const [, type, id] = match;
    return `https://widget.deezer.com/widget/dark/${type}/${id}`;
  } catch {
    return null;
  }
}

export function getSoundCloudEmbedUrl(url) {
  const encoded = encodeURIComponent(url);
  return `https://w.soundcloud.com/player/?url=${encoded}&color=%23ff5a1f&auto_play=false&show_teaser=false&visual=true`;
}

// Fonction generique utilisee par le lecteur du site : detecte automatiquement
// la plateforme a partir de l'URL source stockee en base.
export function getEmbedUrl(sourceUrl, platform) {
  switch (platform) {
    case "spotify":
      return getSpotifyEmbedUrl(sourceUrl);
    case "deezer":
      return getDeezerEmbedUrl(sourceUrl);
    case "soundcloud":
      return getSoundCloudEmbedUrl(sourceUrl);
    default:
      return getSpotifyEmbedUrl(sourceUrl) || sourceUrl;
  }
}
