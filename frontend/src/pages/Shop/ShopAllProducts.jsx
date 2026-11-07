import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiExternalLink,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";

import {
  Shell,
  Table,
  api,
  getError,
  imageUrl,
  money,
  safeArray,
} from "../_pageUtils";
import { notify } from "../../components/UI/Toaster";

const stockBadge = (stock) => {
  const value = Number(stock);

  if (value <= 0) {
    return (
      <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600">
        Out of stock
      </span>
    );
  }

  if (value <= 5) {
    return (
      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
        Low · {value}
      </span>
    );
  }

  return (
    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
      {value} in stock
    </span>
  );
};

export default function ShopAllProducts() {
  const shop = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("seller") || "{}");
    } catch {
      return {};
    }
  }, []);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [deleting, setDeleting] = useState("");

  const load = () => {
    if (!shop._id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    api
      .get(`/product/get-all-products-shop/${shop._id}`)
      .then((response) => setRows(safeArray(response.data.products)))
      .catch((requestError) => setError(getError(requestError)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shop._id]);

  const deleteProduct = async (product) => {
    if (
      !window.confirm(
        `Delete "${product.name}" from your catalog? This cannot be undone.`
      )
    ) {
      return;
    }

    setDeleting(product._id);
    setError("");

    try {
      await api.delete(`/product/delete-shop-product/${product._id}`);
      notify(`${product.name} deleted.`, "info");
      setRows((current) =>
        current.filter((item) => item._id !== product._id)
      );
    } catch (requestError) {
      setError(getError(requestError));
    } finally {
      setDeleting("");
    }
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return rows.filter((product) => {
      if (term) {
        const haystack = `${product.name} ${product.category}`.toLowerCase();

        if (!haystack.includes(term)) return false;
      }

      const stock = Number(product.stock);

      if (stockFilter === "low") return stock > 0 && stock <= 5;
      if (stockFilter === "out") return stock <= 0;

      return true;
    });
  }, [rows, search, stockFilter]);

  const totalSold = rows.reduce(
    (sum, product) => sum + Number(product.sold_out || 0),
    0
  );

  const columns = [
    {
      key: "name",
      label: "Product",
      render: (product) => (
        <div className="flex items-center gap-3">
          <img
            src={imageUrl(product.images?.[0])}
            alt={product.name}
            className="h-11 w-11 shrink-0 rounded-lg object-cover"
          />

          <div className="min-w-0">
            <p className="line-clamp-1 max-w-[220px] font-semibold text-secondary">
              {product.name}
            </p>
            <p className="text-xs text-gray-400">{product.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      render: (product) => stockBadge(product.stock),
    },
    {
      key: "price",
      label: "Price",
      render: (product) => (
        <span className="font-semibold text-secondary">
          {money(product.discountPrice)}
        </span>
      ),
    },
    {
      key: "sold",
      label: "Sold",
      render: (product) => (
        <span className="text-gray-600">{Number(product.sold_out || 0)}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (product) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/product/${product._id}`}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-primary hover:text-primary"
          >
            <FiExternalLink size={13} />
            View
          </Link>

          <button
            type="button"
            onClick={() => deleteProduct(product)}
            disabled={deleting === product._id}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          >
            <FiTrash2 size={13} />
            {deleting === product._id ? "Deleting..." : "Delete"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <Shell>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1 className="mt-1 font-poppins text-3xl font-extrabold text-secondary sm:text-4xl">
            Products
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {rows.length} product{rows.length === 1 ? "" : "s"} ·{" "}
            {totalSold} unit{totalSold === 1 ? "" : "s"} sold
          </p>
        </div>

        <Link
          to={`/shop/${shop._id}/create-product`}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <FiPlus />
          Add product
        </Link>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            className="input-field pl-11"
          />
        </div>

        <select
          value={stockFilter}
          onChange={(event) => setStockFilter(event.target.value)}
          className="input-field sm:w-48"
          aria-label="Filter by stock"
        >
          <option value="all">All stock levels</option>
          <option value="low">Low stock (1–5)</option>
          <option value="out">Out of stock</option>
        </select>
      </div>

      {!loading && !rows.length ? (
        <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center shadow-card">
          <p className="font-poppins text-lg font-bold text-secondary">
            Your catalog is empty
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Publish your first product to start selling.
          </p>
          <Link
            to={`/shop/${shop._id}/create-product`}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <FiPlus />
            Add product
          </Link>
        </div>
      ) : (
        <Table
          columns={columns}
          rows={filtered}
          loading={loading}
          empty="No products match your search or filter."
        />
      )}

      {!loading && filtered.length > 0 && (
        <p className="mt-3 text-xs text-gray-400">
          Showing {filtered.length} of {rows.length} products.
        </p>
      )}
    </Shell>
  );
}
