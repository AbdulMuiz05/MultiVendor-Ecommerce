import React, { useEffect, useMemo, useState } from "react";
import {
  api,
  Shell,
  Table,
  SearchBox,
  safeArray,
  getError,
  money,
} from "./_pageUtils";

export default function AdminDashboardProducts() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/products")
      .then((response) => setRows(safeArray(response.data.products)))
      .catch((requestError) => setError(getError(requestError)))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) return rows;

    return rows.filter((row) =>
      [row.name, row.category, row.shop?.name].some((value) =>
        String(value || "").toLowerCase().includes(term)
      )
    );
  }, [rows, query]);

  return (
    <Shell
      title="Products"
      subtitle={`${rows.length} product${
        rows.length === 1 ? "" : "s"
      } listed across all shops.`}
    >
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="mb-5 max-w-sm">
        <SearchBox
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search product, category, or shop"
        />
      </div>

      <Table
        loading={loading}
        rows={filtered}
        empty="No products match your search."
        columns={[
          {
            key: "name",
            label: "Product",
            render: (row) => (
              <span className="font-semibold text-secondary">
                {row.name || "—"}
              </span>
            ),
          },
          {
            key: "category",
            label: "Category",
            render: (row) => row.category || "—",
          },
          {
            key: "shop",
            label: "Shop",
            render: (row) => row.shop?.name || "—",
          },
          {
            key: "price",
            label: "Price",
            render: (row) => money(row.discountPrice),
          },
          {
            key: "stock",
            label: "Stock",
            render: (row) => (
              <span
                className={
                  Number(row.stock) > 0 ? "text-gray-700" : "text-red-600"
                }
              >
                {Number(row.stock) > 0 ? row.stock : "Out of stock"}
              </span>
            ),
          },
          {
            key: "sold_out",
            label: "Sold",
            render: (row) => row.sold_out || 0,
          },
        ]}
      />
    </Shell>
  );
}
