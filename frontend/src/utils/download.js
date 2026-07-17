import api from "../api/api";

// Declenche le telechargement d'un achat via le proxy securise du backend
// (le vrai lien Cloudinary ne transite jamais dans le navigateur du client).
export async function downloadPurchase({ email, accessCode, orderId, filename }) {
  const { data } = await api.post(
    "/orders/download",
    { email, accessCode, orderId },
    { responseType: "blob" }
  );

  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename || "pack"}.zip`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
