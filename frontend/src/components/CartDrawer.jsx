import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/cart-drawer.css";

const formatEUR = (n) => `${Number(n || 0).toFixed(0)} €`;

// Tiroir panier glissant depuis la droite (style Nike) : s'ouvre automatiquement
// des qu'un article est ajoute, sans quitter la page en cours de navigation.
export default function CartDrawer() {
  const cart = useCart();
  if (!cart) return null;
  const { items, removeItem, total, isOpen, closeDrawer } = cart;

  return (
    <>
      <div className={`cart-drawer__backdrop ${isOpen ? "cart-drawer__backdrop--open" : ""}`} onClick={closeDrawer} />
      <aside className={`cart-drawer ${isOpen ? "cart-drawer--open" : ""}`} aria-hidden={!isOpen}>
        <div className="cart-drawer__header">
          <h2>Votre panier {items.length > 0 && `(${items.length})`}</h2>
          <button className="cart-drawer__close" onClick={closeDrawer} aria-label="Fermer le panier">
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <p>Votre panier est vide.</p>
            <Link to="/boutique" className="btn btn-outline" onClick={closeDrawer}>
              Voir la boutique
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {items.map((item) => (
                <div key={item._id} className="cart-drawer__item">
                  <div className="cart-drawer__thumb">
                    {item.coverImage && <img src={item.coverImage} alt="" />}
                  </div>
                  <div className="cart-drawer__info">
                    <strong>{item.title}</strong>
                    <span>{formatEUR(item.price)}</span>
                  </div>
                  <button
                    className="cart-drawer__remove"
                    onClick={() => removeItem(item._id)}
                    aria-label={`Retirer ${item.title}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__total">
                <span>Total</span>
                <span>{formatEUR(total)}</span>
              </div>
              <Link to="/panier" className="btn btn-primary cart-drawer__checkout" onClick={closeDrawer}>
                Voir mon panier et payer
              </Link>
              <button className="cart-drawer__continue" onClick={closeDrawer}>
                Continuer mes achats
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
