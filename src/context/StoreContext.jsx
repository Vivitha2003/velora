import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { getProductById } from '../data/products';
import { SHIPPING, STORAGE_KEYS } from '../config';

const StoreContext = createContext(null);

export const MAX_QUANTITY = 10;

// A cart line is unique per product + size + colour.
const makeLineKey = (productId, size, color) => [productId, size || '-', color || '-'].join('|');
const asArray = (value) => (Array.isArray(value) ? value : []);

export function StoreProvider({ children }) {
  const [rawCart, setCartItems] = useLocalStorage(STORAGE_KEYS.cart, []);
  const [rawWishlist, setWishlistIds] = useLocalStorage(STORAGE_KEYS.wishlist, []);
  const [rawOrders, setOrders] = useLocalStorage(STORAGE_KEYS.orders, []);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const cartItems = asArray(rawCart);
  const wishlistIds = asArray(rawWishlist);
  const orders = asArray(rawOrders);

  const showToast = useCallback((message) => {
    clearTimeout(toastTimer.current);
    setToast({ message, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  // ---- Cart ----------------------------------------------------------------
  const addToCart = useCallback(
    (product, { quantity = 1, size = null, color = null } = {}) => {
      const key = makeLineKey(product.id, size, color);
      setCartItems((previous) => {
        const list = asArray(previous);
        const existing = list.find((item) => item.key === key);
        if (existing) {
          return list.map((item) =>
            item.key === key ? { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity + quantity) } : item
          );
        }
        return [...list, { key, productId: product.id, quantity: Math.min(MAX_QUANTITY, quantity), size, color }];
      });
      showToast(`${product.name} added to cart`);
    },
    [setCartItems, showToast]
  );

  const updateQuantity = useCallback(
    (key, quantity) => {
      const safeQuantity = Math.max(1, Math.min(MAX_QUANTITY, quantity));
      setCartItems((previous) =>
        asArray(previous).map((item) => (item.key === key ? { ...item, quantity: safeQuantity } : item))
      );
    },
    [setCartItems]
  );

  const removeFromCart = useCallback(
    (key) => {
      setCartItems((previous) => asArray(previous).filter((item) => item.key !== key));
      showToast('Item removed from cart');
    },
    [setCartItems, showToast]
  );

  const clearCart = useCallback(() => setCartItems([]), [setCartItems]);

  // ---- Wishlist ------------------------------------------------------------
  const isInWishlist = useCallback((id) => wishlistIds.includes(id), [wishlistIds]);

  const toggleWishlist = useCallback(
    (product) => {
      const alreadySaved = wishlistIds.includes(product.id);
      setWishlistIds((previous) => {
        const list = asArray(previous);
        return list.includes(product.id) ? list.filter((id) => id !== product.id) : [...list, product.id];
      });
      showToast(alreadySaved ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`);
    },
    [wishlistIds, setWishlistIds, showToast]
  );

  // ---- Derived cart values -------------------------------------------------
  const cartLines = useMemo(
    () =>
      cartItems
        .map((item) => ({ ...item, product: getProductById(item.productId) }))
        .filter((line) => line.product),
    [cartItems]
  );

  const cartCount = useMemo(() => cartLines.reduce((sum, line) => sum + line.quantity, 0), [cartLines]);
  const subtotal = useMemo(
    () => cartLines.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
    [cartLines]
  );
  const shipping = subtotal === 0 || subtotal >= SHIPPING.freeAbove ? 0 : SHIPPING.flatRate;
  const total = subtotal + shipping;

  // ---- Demo orders ---------------------------------------------------------
  const placeOrder = useCallback(
    (customer) => {
      const id = `VEL-${Date.now().toString().slice(-8)}`;
      const order = {
        id,
        placedAt: new Date().toISOString(),
        customer,
        items: cartLines.map((line) => ({
          productId: line.product.id,
          name: line.product.name,
          image: line.product.image,
          price: line.product.price,
          quantity: line.quantity,
          size: line.size,
          color: line.color,
        })),
        subtotal,
        shipping,
        total,
      };
      setOrders((previous) => [order, ...asArray(previous)]);
      setCartItems([]);
      return id;
    },
    [cartLines, subtotal, shipping, total, setOrders, setCartItems]
  );

  const resetAllData = useCallback(() => {
    setCartItems([]);
    setWishlistIds([]);
    setOrders([]);
    showToast('Saved cart, wishlist and orders cleared');
  }, [setCartItems, setWishlistIds, setOrders, showToast]);

  const value = {
    cartLines,
    cartCount,
    subtotal,
    shipping,
    total,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    wishlistIds,
    isInWishlist,
    toggleWishlist,
    orders,
    placeOrder,
    resetAllData,
    toast,
    showToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used inside <StoreProvider>');
  return context;
}
