import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiTrendingUp } from "react-icons/fi";

import ProductCard from "../components/Product/ProductCard";
import {
  Button,
  Empty,
  Shell,
  api,
  getError,
  safeArray,
} from "./_pageUtils";

export default function BestSellingPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    api
      .get("/product/get-all-products")
      .then((response) => {
        if (active) setProducts(safeArray(response.data.products));
      })
      .catch((requestError) => {
        if (active) {
          setProducts([]);
          setError(getError(requestError));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const ranked = useMemo(
    () =>
      [...products]
        .filter((product) => Number(product.sold_out || 0) > 0)
        .sort(
          (a, b) => Number(b.sold_out || 0) - Number(a.sold_out || 0)
        ),
    [products]
  );

  const fallback = useMemo(
    () =>
      [...products].sort(
        (a, b) => Number(b.ratings || 0) - Number(a.ratings || 0)
      ),
    [products]
  );

  const items = ranked.length ? ranked : fallback.slice(0, 20);

  return (
    <Shell>
      <section className="relative overflow-hidden rounded-[2rem] bg-secondary px-6 py-12 text-white shadow-soft sm:px-10 sm:py-14">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
            <FiTrendingUp size={14} />
            Customer favourites
          </span>

          <h1 className="mt-5 font-poppins text-3xl font-extrabold sm:text-5xl">
            Best selling products
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-gray-300 sm:text-base">
            {ranked.length
              ? "Ranked by the number of units sold across the marketplace."
              : "Popular products from across the marketplace."}
          </p>

          <Link
            to="/products"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold transition hover:opacity-90"
          >
            Browse all products
            <FiArrowRight />
          </Link>
        </div>
      </section>

      <div className="mt-10">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card"
              >
                <div className="aspect-[4/5] animate-pulse bg-gray-100" />

                <div className="space-y-3 p-4">
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100" />
                  <div className="h-9 w-full animate-pulse rounded-xl bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <Empty
            title="Couldn't load best sellers"
            text={error}
          >
            <Button onClick={() => window.location.reload()}>Try again</Button>
          </Empty>
        ) : items.length ? (
          <>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="eyebrow">Leaderboard</p>

                <h2 className="section-title mt-1">Top picks right now</h2>
              </div>

              <Link
                to="/products"
                className="text-sm font-semibold text-primary hover:underline"
              >
                View all products
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {items.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  rank={ranked.length ? index + 1 : undefined}
                />
              ))}
            </div>
          </>
        ) : (
          <Empty
            title="No products available yet"
            text="Products will appear here once sellers add them to the marketplace."
          >
            <Link
              to="/shop-create"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Become a seller
              <FiArrowRight />
            </Link>
          </Empty>
        )}
      </div>
    </Shell>
  );
}
