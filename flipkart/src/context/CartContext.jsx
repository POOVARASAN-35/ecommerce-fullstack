import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

// 🔗 Backend API
const WISHLIST_API = "http://localhost:5000/api/wishlist";

// ⚠️ TEMP USER ID (replace with JWT later)
const USER_ID = "65a9c9a4f0b2c1a123456789";

export const CartProvider = ({ children }) => {
  /* ================= CART STATE ================= */
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  /* ================= WISHLIST STATE ================= */
  const [wishlist, setWishlist] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);

  /* ================= LOAD WISHLIST FROM DB ================= */
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const res = await axios.get(`${WISHLIST_API}/${USER_ID}`);
        setWishlist(res.data || []);
      } catch (err) {
        console.error("Wishlist load failed", err);
      } finally {
        setLoadingWishlist(false);
      }
    };
    loadWishlist();
  }, []);

  /* ================= SAVE CART TO LOCAL STORAGE ================= */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* ================= CART FUNCTIONS ================= */

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  /* ================= WISHLIST FUNCTIONS ================= */

  const addToWishlist = async (product) => {
    try {
      const res = await axios.post(`${WISHLIST_API}/add`, {
        userId: USER_ID,
        product
      });

      setWishlist((prev) => {
        const exists = prev.find(
          (item) => item.productId === product.id
        );
        if (exists) return prev;
        return [...prev, res.data];
      });
    } catch (err) {
      console.error("Add wishlist failed", err);
    }
  };

  const removeFromWishlist = async (wishlistId) => {
    try {
      await axios.delete(`${WISHLIST_API}/${wishlistId}`);
      setWishlist((prev) =>
        prev.filter((item) => item._id !== wishlistId)
      );
    } catch (err) {
      console.error("Remove wishlist failed", err);
    }
  };

  const moveToCart = (item) => {
    addToCart({
      id: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      stock: item.stock
    });

    removeFromWishlist(item._id);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        loadingWishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        moveToCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
