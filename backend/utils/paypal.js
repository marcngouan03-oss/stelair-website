// Integration PayPal via l'API REST directe (fetch natif de Node 18+), sans SDK,
// pour rester coherent avec le style "dependances minimales" du projet.
// Utilise les identifiants API PayPal Business de L'ARTISTE (PAYPAL_CLIENT_ID /
// PAYPAL_CLIENT_SECRET) : l'argent des ventes tombe donc directement sur son
// compte, sans systeme de split automatique.

const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

let cachedToken = null; // { token, expiresAt }

async function getAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const credentials = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error("Impossible d'obtenir un jeton d'acces PayPal.");
  }

  const data = await res.json();
  // On rafraichit 60s avant l'expiration reelle par securite.
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.token;
}

// amountEUR = montant total du panier (peut regrouper plusieurs packs en un
// seul paiement). requestId sert uniquement a l'idempotence PayPal.
async function createPaypalOrder({ amountEUR, description, requestId }) {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      // Idempotence : evite de creer deux commandes PayPal si la requete est rejouee.
      "PayPal-Request-Id": String(requestId),
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          description: (description || "Achat STELAIR").slice(0, 127),
          amount: {
            currency_code: "EUR",
            value: amountEUR.toFixed(2),
          },
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Echec de creation de la commande PayPal.");
  }
  return data;
}

async function capturePaypalOrder(paypalOrderId, requestId) {
  const token = await getAccessToken();

  const res = await fetch(
    `${PAYPAL_API_BASE}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `${requestId}-capture`,
      },
    }
  );

  const data = await res.json();
  // Pas de "throw" ici sur !res.ok : l'appelant doit pouvoir lire data.details
  // (ex: paiement refuse) sans perdre l'information.
  return { ok: res.ok, status: res.status, data };
}

// Verifie la signature d'un evenement webhook PayPal aupres de PayPal lui-meme
// (jamais de confiance aveugle dans le contenu recu, meme s'il "a l'air" valide).
async function verifyWebhookSignature(headers, rawBody) {
  const token = await getAccessToken();

  const res = await fetch(
    `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transmission_id: headers["paypal-transmission-id"],
        transmission_time: headers["paypal-transmission-time"],
        cert_url: headers["paypal-cert-url"],
        auth_algo: headers["paypal-auth-algo"],
        transmission_sig: headers["paypal-transmission-sig"],
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: rawBody,
      }),
    }
  );

  if (!res.ok) return false;
  const data = await res.json();
  return data.verification_status === "SUCCESS";
}

module.exports = {
  getAccessToken,
  createPaypalOrder,
  capturePaypalOrder,
  verifyWebhookSignature,
};
