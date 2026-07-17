import { useEffect, useRef } from "react";
import api from "../api/api";

let sdkLoadingPromise = null;

function loadPayPalSdk(clientId) {
  if (window.paypal) return Promise.resolve(window.paypal);
  if (sdkLoadingPromise) return sdkLoadingPromise;

  sdkLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR&intent=capture`;
    script.onload = () => resolve(window.paypal);
    script.onerror = () => reject(new Error("Impossible de charger PayPal."));
    document.body.appendChild(script);
  });
  return sdkLoadingPromise;
}

// Bouton de paiement PayPal (SDK charge via une simple balise <script>, pas de
// dependance npm supplementaire). Le montant n'est JAMAIS envoye par le
// navigateur : createOrder ne transmet que les id des sons du panier, le prix
// vient uniquement des Beat en base cote serveur.
export default function PayPalButton({ beatIds, buyerEmail, onSuccess, onError }) {
  const containerRef = useRef(null);
  // Refs pour que les callbacks PayPal (definis une seule fois au montage)
  // lisent toujours les valeurs les plus recentes, sans re-render du bouton.
  const beatIdsRef = useRef(beatIds);
  const emailRef = useRef(buyerEmail);

  useEffect(() => {
    beatIdsRef.current = beatIds;
    emailRef.current = buyerEmail;
  }, [beatIds, buyerEmail]);

  useEffect(() => {
    let cancelled = false;
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

    loadPayPalSdk(clientId)
      .then((paypal) => {
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = "";

        paypal
          .Buttons({
            style: { layout: "vertical", color: "gold", label: "paypal" },
            createOrder: async () => {
              const { data } = await api.post("/orders/create-paypal-order", {
                beatIds: beatIdsRef.current,
                buyerEmail: emailRef.current,
              });
              return data.paypalOrderId;
            },
            onApprove: async (data) => {
              try {
                const { data: result } = await api.post("/orders/capture-paypal-order", {
                  paypalOrderId: data.orderID,
                });
                onSuccess?.(result);
              } catch (err) {
                onError?.(err?.response?.data?.message || "Le paiement n'a pas pu etre confirme.");
              }
            },
            onError: () => {
              onError?.("Une erreur est survenue avec PayPal. Reessayez.");
            },
          })
          .render(containerRef.current);
      })
      .catch(() => {
        onError?.("Impossible de charger le module de paiement PayPal.");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className="paypal-button-container" />;
}
