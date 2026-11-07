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

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "—";

export default function AdminDashboardEvents() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/events")
      .then((response) => setRows(safeArray(response.data.events)))
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
      title="Events"
      subtitle={`${rows.length} event${
        rows.length === 1 ? "" : "s"
      } created by marketplace sellers.`}
    >
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="mb-5 max-w-sm">
        <SearchBox
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search event, category, or shop"
        />
      </div>

      <Table
        loading={loading}
        rows={filtered}
        empty="No events match your search."
        columns={[
          {
            key: "name",
            label: "Event",
            render: (row) => (
              <span className="font-semibold text-secondary">
                {row.name || "—"}
              </span>
            ),
          },
          {
            key: "shop",
            label: "Shop",
            render: (row) => row.shop?.name || "—",
          },
          {
            key: "dates",
            label: "Runs",
            render: (row) =>
              `${formatDate(row.start_Date)} – ${formatDate(
                row.Finish_Date
              )}`,
          },
          {
            key: "price",
            label: "Price",
            render: (row) => money(row.discountPrice),
          },
          {
            key: "stock",
            label: "Stock",
            render: (row) => row.stock ?? "—",
          },
          {
            key: "status",
            label: "Status",
            render: (row) => row.status || "Running",
          },
        ]}
      />
    </Shell>
  );
}
