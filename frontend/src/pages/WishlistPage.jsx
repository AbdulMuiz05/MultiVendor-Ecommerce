import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  Empty,
  Shell,
  imageUrl,
  money,
} from "./_pageUtils";

const KEY = "eshop_wishlist";

export default function WishlistPage() {
  const [items, setItems] = useState([]);

  const load = () => {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || "[]");
      setItems(Array.isArray(value) ? value : []);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = (id) => {
    const next = items.filter((item) => item._id !== id);
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("eshop_cart") || "[]");
    const existing = cart.find((cartItem) => cartItem._id === item._id);

    const nextCart = existing
      ? cart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, qty: (cartItem.qty || 0) + 1 }
            : cartItem
        )
      : [...cart, { ...item, qty: 1 }];

    localStorage.setItem("eshop_cart", JSON.stringify(nextCart));
  };

  return (
    <Shell title="Wishlist" subtitle="Products you want to keep for later.">
      {!items.length ? (
        <Empty
          title="Your wishlist is empty"
          text="Save products here and come back to them later."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <Card key={item._id} className="overflow-hidden p-0">
              <Link to={`/product/${item._id}`}>
                <img
                  src={imageUrl(item.images?.[0])}
                  alt={item.name}
                  className="h-56 w-full object-cover"
                />
              </Link>

              <div className="p-4">
                <Link
                  to={`/product/${item._id}`}
                  className="line-clamp-2 font-semibold text-secondary"
                >
                  {item.name}
                </Link>

                <p className="mt-2 font-bold text-secondary">
                  {money(item.discountPrice)}
                </p>

                <div className="mt-4 flex gap-2">
                  <Button
                    className="flex-1 px-3 py-2 text-xs"
                    onClick={() => addToCart(item)}
                  >
                    Add to Cart
                  </Button>

                  <Button
                    variant="danger"
                    className="px-3 py-2 text-xs"
                    onClick={() => remove(item._id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Shell>
  );
}
