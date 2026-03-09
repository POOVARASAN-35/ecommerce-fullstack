import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

// Backend API
const WISHLIST_API = "https://ecommerce-fullstack-0vqh.onrender.com/api/wishlist";

// Temporary user ID
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

  /* ================= LOAD WISHLIST ================= */

  useEffect(() => {
    const loadWishlist = async () => {
      try {

        const res = await axios.get(`${WISHLIST_API}/${USER_ID}`);
        setWishlist(res.data || []);

      } catch (err) {

        console.error("Wishlist load failed:", err);

      } finally {

        setLoadingWishlist(false);

      }
    };

    loadWishlist();
  }, []);

  /* ================= SAVE CART ================= */

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

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          stock: product.stock,
          qty: 1
        }
      ];

    });
  };

  const removeFromCart = (id) => {

    setCart((prev) =>
      prev.filter((item) => item.id !== id)
    );

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

      const exists = wishlist.find(
        (item) => item.productId === String(product.id)
      );

      if (exists) {
        console.log("Already in wishlist");
        return;
      }

      const res = await axios.post(`${WISHLIST_API}/add`, {
        userId: USER_ID,
        productId: product.id,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice,
        image: product.image,
        category: product.category,
        stock: product.stock,
        rating: product.rating
      });

      setWishlist((prev) => [...prev, res.data]);

    } catch (err) {

      console.error("Add wishlist failed:", err);

    }

  };

  const removeFromWishlist = async (wishlistId) => {

    try {

      await axios.delete(`${WISHLIST_API}/${wishlistId}`);

      setWishlist((prev) =>
        prev.filter((item) => item._id !== wishlistId)
      );

    } catch (err) {

      console.error("Remove wishlist failed:", err);

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

  /* ================= PROVIDER ================= */

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