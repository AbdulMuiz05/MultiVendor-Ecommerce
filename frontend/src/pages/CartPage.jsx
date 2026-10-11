import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Empty, Shell, imageUrl, money } from "./_pageUtils";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  const load = () => {
    try {
      setCart(JSON.parse(localStorage.getItem("eshop_cart") || "[]"));
    } catch {
      setCart([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const persist = (next) => {
    setCart(next);
    localStorage.setItem("eshop_cart", JSON.stringify(next));
  };

  const updateQuantity = (id, qty) => {
    const next = cart.map((item) =>
      item._id === id ? { ...item, qty } : item
    );
    persist(next);
  };

  const remove = (id) => persist(cart.filter((item) => item._id !== id));

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.discountPrice || item.price || 0) *
        Number(item.qty || 1),
    0
  );

  return (
    <Shell title="Shopping Cart" subtitle="Review your items before checkout.">
      {!cart.length ? (
        <Empty
          title="Your cart is empty"
          text="Add products to your cart before checking out."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card>
            <div className="space-y-5">
              {cart.map((item) => {
                const qty = Number(item.qty) || 1;
                const stock = Number(item.stock);
                const price = Number(item.discountPrice || item.price || 0);

                return (
                  <div
                    key={item._id}
                    className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center"
                  >
                    <img
                      src={imageUrl(item.images?.[0])}
                      alt={item.name}
                      className="h-24 w-24 rounded-xl object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/product/${item._id}`}
                        className="font-semibold text-secondary"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm text-gray-500">
                        {money(price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        onClick={() =>
                          updateQuantity(item._id, Math.max(1, qty - 1))
                        }
                      >
                        −
                      </Button>
                      <span className="w-8 text-center font-semibold">
                        {qty}
                      </span>
                      <Button
                        variant="secondary"
                        disabled={Number.isFinite(stock) && qty >= stock}
                        onClick={() =>
                          updateQuantity(item._id, qty + 1)
                        }
                      >
                        +
                      </Button>
                    </div>

                    <Button
                      variant="danger"
                      onClick={() => remove(item._id)}
                    >
                      Remove
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="h-fit">
            <h2 className="font-poppins text-xl font-bold text-secondary">
              Summary
            </h2>

            <div className="mt-5 flex justify-between border-t pt-5 font-bold">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>

            <Link to="/checkout" className="mt-5 block">
              <Button className="w-full">Proceed to Checkout</Button>
            </Link>

            <button
              type="button"
              onClick={() => persist([])}
              className="mt-3 w-full text-sm font-semibold text-red-600"
            >
              Clear cart
            </button>
          </Card>
        </div>
      )}
    </Shell>
  );
}
