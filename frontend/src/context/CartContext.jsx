import { createContext, useContext, useState, useCallback, useEffect } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "stelair_cart";

// Panier de la boutique : liste de packs (Beat) choisis avant paiement,
// persiste en local pour survivre a un rechargement de page. Un pack ne
// peut etre present qu'une seule fois (produit numerique, pas de quantite).
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Ajouter un article ouvre automatiquement le tiroir (comme sur Nike.com) :
  // on reste sur la page courante, le panier glisse pour confirmer l'ajout.
  const addItem = useCallback((beat) => {
    setItems((prev) => {
      if (prev.some((i) => i._id === beat._id)) return prev;
      return [...prev, { _id: beat._id, title: beat.title, price: beat.price, coverImage: beat.coverImage }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((beatId) => {
    setItems((prev) => prev.filter((i) => i._id !== beatId));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openDrawer = useCallback(() => setIsOpen(true), []);
  const closeDrawer = useCallback(() => setIsOpen(false), []);

  const total = items.reduce((sum, i) => sum + Number(i.price || 0), 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clear, total, isOpen, openDrawer, closeDrawer }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
