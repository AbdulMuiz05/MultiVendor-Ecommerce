import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiArrowRight,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiTrash2,
} from "react-icons/fi";

import {
  Button,
  Card,
  Empty,
  Shell,
  imageUrl,
  money,
} from "./_pageUtils";
import {
  clearCart,
  removeFromCart,
  updateCartQuantity,
} from "../redux/actions/cart";
import { productPrice } from "../utils/format";
import { notify } from "../components/UI/Toaster";

export default function CartPage() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);

  const total = cart.reduce(
    (sum, item) => sum + productPrice(item) * Number(item.qty || 1),
    0
  );

  const itemCount = cart.reduce(
    (sum, item) => sum + Number(item.qty || 1),
    0
  );

  const handleClear = () => {
    dispatch(clearCart());
    notify("Cart cleared.", "info");
  };

  return (
    <Shell
      title="Shopping cart"
      subtitle={
        cart.length
          ? `${itemCount} item${itemCount === 1 ? "" : "s"} ready for checkout.`
          : "Your cart is waiting to be filled."
      }
    >
      {!cart.length ? (
        <Empty
          title="Your cart is empty"
          text="Browse the marketplace and add products you would like to order."
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <FiShoppingBag />
            Start shopping
          </Link>
        </Empty>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card className="p-0">
            <ul className="divide-y divide-gray-100">
              {cart.map((item) => {
                const qty = Number(item.qty) || 1;
                const stock = Number(item.stock);
                const hasStock = Number.isFinite(stock);
                const outOfStock = hasStock && stock <= 0;
                const maxed = hasStock && qty >= stock;

                return (
                  <li
                    key={item._id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
                  >
                    <Link
                      to={`/product/${item._id}`}
                      className="shrink-0 overflow-hidden rounded-xl bg-gray-50"
                    >
                      <img
                        src={imageUrl(item.images?.[0])}
                        alt={item.name}
                        className="h-24 w-24 object-cover"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      {item.shop?.name && (
                        <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                          {item.shop.name}
                        </p>
                      )}

                      <Link
                        to={`/product/${item._id}`}
                        className="mt-1 line-clamp-2 font-semibold text-secondary transition hover:text-primary"
                      >
                        {item.name}
                      </Link>

                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-semibold text-secondary">
                          {money(productPrice(item))}
                        </span>

                        {Number(item.originalPrice) >
                          productPrice(item) && (
                          <del className="text-xs text-gray-400">
                            {money(item.originalPrice)}
                          </del>
                        )}

                        {outOfStock ? (
                          <span className="text-xs font-semibold text-red-600">
                            Out of stock
                          </span>
                        ) : hasStock && stock <= 5 ? (
                          <span className="text-xs font-semibold text-amber-600">
                            Only {stock} left
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="flex items-center rounded-xl border border-gray-200">
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              updateCartQuantity(item._id, qty - 1)
                            )
                          }
                          disabled={qty <= 1}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="flex h-10 w-10 items-center justify-center text-gray-500 transition hover:text-secondary disabled:opacity-40"
                        >
                          <FiMinus size={14} />
                        </button>

                        <span className="w-8 text-center text-sm font-semibold text-secondary">
                          {qty}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              updateCartQuantity(item._id, qty + 1)
                            )
                          }
                          disabled={maxed}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="flex h-10 w-10 items-center justify-center text-gray-500 transition hover:text-secondary disabled:opacity-40"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>

                      <p className="w-24 text-right font-poppins font-bold text-secondary">
                        {money(productPrice(item) * qty)}
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          dispatch(removeFromCart(item._id));
                          notify(`${item.name} removed from cart.`, "info");
                        }}
                        aria-label={`Remove ${item.name} from cart`}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>

          <div className="lg:sticky lg:top-28 lg:h-fit">
            <Card>
              <h2 className="font-poppins text-xl font-bold text-secondary">
                Order summary
              </h2>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">
                    Subtotal ({itemCount} item{itemCount === 1 ? "" : "s"})
                  </dt>
                  <dd className="font-semibold text-secondary">
                    {money(total)}
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-gray-500">Delivery</dt>
                  <dd className="font-medium text-gray-500">
                    Calculated at fulfillment
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex justify-between border-t border-gray-100 pt-5 font-poppins text-lg font-bold text-secondary">
                <span>Total</span>
                <span>{money(total)}</span>
              </div>

              <Link to="/checkout" className="mt-5 block">
                <Button className="w-full">
                  Proceed to checkout
                  <FiArrowRight className="ml-2" />
                </Button>
              </Link>

              <Link
                to="/products"
                className="mt-3 block text-center text-sm font-semibold text-primary hover:underline"
              >
                Continue shopping
              </Link>

              <button
                type="button"
                onClick={handleClear}
                className="mt-4 w-full text-center text-xs font-semibold text-gray-400 transition hover:text-red-600"
              >
                Clear cart
              </button>
            </Card>
          </div>
        </div>
      )}
    </Shell>
  );
}
