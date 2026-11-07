import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiChevronDown,
  FiFilter,
  FiSearch,
  FiX,
} from "react-icons/fi";

import ProductCard from "../components/Product/ProductCard";
import {
  Button,
  Empty,
  Shell,
  api,
  getError,
  safeArray,
} from "./_pageUtils";
import { productPrice } from "../utils/format";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
  { value: "popular", label: "Most popular" },
  { value: "rating", label: "Top rated" },
];

const SkeletonCard = () => (
  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card">
    <div className="aspect-[4/5] animate-pulse bg-gray-100" />

    <div className="space-y-3 p-4">
      <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
      <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100" />
      <div className="h-4 w-2/5 animate-pulse rounded bg-gray-100" />
      <div className="h-9 w-full animate-pulse rounded-xl bg-gray-100" />
    </div>
  </div>
);

const CategoryOption = ({ active, label, count, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
      active
        ? "bg-primary/10 font-semibold text-primary"
        : "text-gray-600 hover:bg-gray-50"
    }`}
  >
    <span className="truncate">{label}</span>
    <span
      className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        active ? "bg-primary/15 text-primary" : "bg-gray-100 text-gray-500"
      }`}
    >
      {count}
    </span>
  </button>
);

export default function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const query = params.get("q") || "";
  const category = params.get("category") || "all";
  const sort = params.get("sort") || "newest";
  const minPrice = params.get("min") || "";
  const maxPrice = params.get("max") || "";

  const updateParam = (key, value, fallback = "") => {
    const next = new URLSearchParams(params);

    if (!value || value === fallback) {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    setParams(next, { replace: true });
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    setParams(next, { replace: true });
  };

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError("");

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
  }, [reloadKey]);

  const categories = useMemo(() => {
    const counts = new Map();

    products.forEach((product) => {
      const name = product.category || "Uncategorised";
      counts.set(name, (counts.get(name) || 0) + 1);
    });

    return [{ name: "all", label: "All products", count: products.length }].concat(
      [...counts.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, count]) => ({ name, label: name, count }))
    );
  }, [products]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);

    const result = products.filter((product) => {
      if (category !== "all" && product.category !== category) return false;

      if (term) {
        const haystack = `${product.name || ""} ${product.description || ""} ${
          product.category || ""
        } ${product.shop?.name || ""}`.toLowerCase();

        if (!haystack.includes(term)) return false;
      }

      const price = productPrice(product);

      if (min !== null && Number.isFinite(min) && price < min) return false;
      if (max !== null && Number.isFinite(max) && price > max) return false;

      return true;
    });

    switch (sort) {
      case "price-low":
        result.sort((a, b) => productPrice(a) - productPrice(b));
        break;
      case "price-high":
        result.sort((a, b) => productPrice(b) - productPrice(a));
        break;
      case "popular":
        result.sort((a, b) => Number(b.sold_out || 0) - Number(a.sold_out || 0));
        break;
      case "rating":
        result.sort((a, b) => Number(b.ratings || 0) - Number(a.ratings || 0));
        break;
      default:
        result.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
    }

    return result;
  }, [products, category, query, sort, minPrice, maxPrice]);

  const activeFilterCount =
    (category !== "all" ? 1 : 0) +
    (minPrice !== "" ? 1 : 0) +
    (maxPrice !== "" ? 1 : 0);

  const filtersContent = (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-poppins text-sm font-bold text-secondary">
            Category
          </h3>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        <div className="mt-3 space-y-1">
          {categories.map((item) => (
            <CategoryOption
              key={item.name}
              active={category === item.name}
              label={item.label}
              count={item.count}
              onClick={() =>
                updateParam("category", item.name === "all" ? "" : item.name)
              }
            />
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-5">
        <h3 className="font-poppins text-sm font-bold text-secondary">
          Price range
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <label className="flex-1">
            <span className="sr-only">Minimum price</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="Min"
              value={minPrice}
              onChange={(event) => updateParam("min", event.target.value)}
              className="input-field px-3 py-2 text-sm"
            />
          </label>

          <span className="text-gray-400">–</span>

          <label className="flex-1">
            <span className="sr-only">Maximum price</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="Max"
              value={maxPrice}
              onChange={(event) => updateParam("max", event.target.value)}
              className="input-field px-3 py-2 text-sm"
            />
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <Shell
      title="All products"
      subtitle="Discover products from sellers across the marketplace."
    >
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
            {filtersContent}
          </div>
        </aside>

        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="search"
                value={query}
                onChange={(event) => updateParam("q", event.target.value)}
                placeholder="Search products, categories or shops..."
                className="input-field pl-11 pr-11"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => updateParam("q", "")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-secondary transition hover:border-gray-300 lg:hidden"
              >
                <FiFilter size={16} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="relative">
                <select
                  value={sort}
                  onChange={(event) =>
                    updateParam("sort", event.target.value, "newest")
                  }
                  aria-label="Sort products"
                  className="input-field appearance-none py-3 pl-4 pr-10 text-sm sm:w-52"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-gray-500">
              {loading ? (
                "Loading products..."
              ) : (
                <>
                  <span className="font-semibold text-secondary">
                    {filtered.length}
                  </span>{" "}
                  {filtered.length === 1 ? "product" : "products"} found
                </>
              )}
            </p>

            {!loading && (category !== "all" || query) && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>

          {error && !loading && (
            <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-5">
            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <SkeletonCard key={item} />
                ))}
              </div>
            ) : error && !products.length ? (
              <Empty
                title="Products could not be loaded"
                text="The marketplace catalog is unavailable right now. Please try again."
              >
                <Button onClick={() => setReloadKey((key) => key + 1)}>
                  Try again
                </Button>
              </Empty>
            ) : filtered.length ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <Empty
                title="No products match your filters"
                text="Try a different search term, category or price range."
              >
                <Button onClick={clearFilters}>Clear filters</Button>
              </Empty>
            )}
          </div>
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
            className="absolute inset-0 bg-secondary/40 backdrop-blur-sm"
          />

          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-soft">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-poppins text-lg font-bold text-secondary">
                Filters
              </h2>

              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>

            {filtersContent}

            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="mt-7 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Show {filtered.length} {filtered.length === 1 ? "product" : "products"}
            </button>
          </div>
        </div>
      )}
    </Shell>
  );
}
