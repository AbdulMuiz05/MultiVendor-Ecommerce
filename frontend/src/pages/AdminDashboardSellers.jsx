import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  api,
  Shell,
  Table,
  SearchBox,
  safeArray,
  getError,
} from "./_pageUtils";

export default function AdminDashboardSellers() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/sellers")
      .then((response) => setRows(safeArray(response.data.sellers)))
      .catch((requestError) => setError(getError(requestError)))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) return rows;

    return rows.filter((row) =>
      [row.name, row.email].some((value) =>
        String(value || "").toLowerCase().includes(term)
      )
    );
  }, [rows, query]);

  return (
    <Shell
      title="Sellers"
      subtitle={`${rows.length} shop${
        rows.length === 1 ? "" : "s"
      } registered on the marketplace.`}
    >
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="mb-5 max-w-sm">
        <SearchBox
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search shop or email"
        />
      </div>

      <Table
        loading={loading}
        rows={filtered}
        empty="No sellers match your search."
        columns={[
          {
            key: "name",
            label: "Shop",
            render: (row) => (
              <Link
                to={`/shop/${row._id}`}
                className="font-semibold text-secondary hover:text-primary"
              >
                {row.name || "—"}
              </Link>
            ),
          },
          {
            key: "email",
            label: "Email",
            render: (row) => row.email || "—",
          },
          {
            key: "phoneNumber",
            label: "Phone",
            render: (row) => row.phoneNumber || "—",
          },
          {
            key: "active",
            label: "Status",
            render: (row) =>
              row.isActive === false ? "Inactive" : "Active",
          },
          {
            key: "createdAt",
            label: "Joined",
            render: (row) =>
              row.createdAt
                ? new Date(row.createdAt).toLocaleDateString()
                : "—",
          },
        ]}
      />
    </Shell>
  );
}
