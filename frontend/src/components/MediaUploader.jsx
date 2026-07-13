import { useRef, useState } from "react";
import api from "../api/api";

// Composant d'upload reutilisable : envoie le fichier au backend (-> Cloudinary)
// et remonte { url, publicId } au formulaire parent via onUploaded.
// C'est le seul endroit ou l'upload est gere, pour que TOUTES les images/videos/audios
// du site passent par Cloudinary et ne soient jamais perdues apres deploiement.
export default function MediaUploader({ label, folder = "misc", accept = "image/*", currentUrl, onUploaded }) {
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(currentUrl || "");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post(`/upload?folder=${folder}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPreview(data.url);
      onUploaded(data.url, data.publicId);
    } catch (err) {
      setError(err?.response?.data?.message || "Echec de l'upload.");
    } finally {
      setUploading(false);
    }
  };

  const isVideo = accept.includes("video");
  const isAudio = accept.includes("audio");

  return (
    <div className="media-uploader">
      {label && <label>{label}</label>}
      <div className="media-uploader__preview">
        {preview ? (
          isAudio ? (
            <audio src={preview} controls style={{ width: "100%" }} />
          ) : isVideo ? (
            <video src={preview} controls />
          ) : (
            <img src={preview} alt="Apercu" />
          )
        ) : (
          <span className="media-uploader__empty">Aucun fichier</span>
        )}
      </div>
      <input ref={inputRef} type="file" accept={accept} onChange={handleFile} hidden />
      <button type="button" className="btn btn-outline" onClick={() => inputRef.current.click()} disabled={uploading}>
        {uploading ? "Envoi en cours..." : preview ? "Remplacer le fichier" : "Choisir un fichier"}
      </button>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}