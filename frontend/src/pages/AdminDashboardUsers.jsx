import React, { useEffect, useMemo, useState } from "react";
import {
  api,
  Shell,
  Table,
  SearchBox,
  safeArray,
  getError,
} from "./_pageUtils";

export default function AdminDashboardUsers() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/users")
      .then((response) => setRows(safeArray(response.data.users)))
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
      title="Customers"
      subtitle={`${rows.length} registered customer${
        rows.length === 1 ? "" : "s"
      } on the marketplace.`}
    >
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="mb-5 max-w-sm">
        <SearchBox
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name or email"
        />
      </div>

      <Table
        loading={loading}
        rows={filtered}
        empty="No customers match your search."
        columns={[
          {
            key: "name",
            label: "Customer",
            render: (row) => (
              <span className="font-semibold text-secondary">
                {row.name || "—"}
              </span>
            ),
          },
          {
            key: "email",
            label: "Email",
            render: (row) => row.email || "—",
          },
          {
            key: "role",
            label: "Role",
            render: (row) => row.role || "user",
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
