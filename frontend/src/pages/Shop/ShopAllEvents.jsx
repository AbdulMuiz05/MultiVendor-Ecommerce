import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

import {
  api,
  Shell,
  Table,
  SearchBox,
  safeArray,
  getError,
  money,
} from "../_pageUtils";

const readShop = () => {
  try {
    return JSON.parse(localStorage.getItem("seller") || "{}");
  } catch {
    return {};
  }
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "—";

const statusOf = (event) => {
  if (event.status) return event.status;

  const now = Date.now();
  const start = new Date(event.start_Date).getTime();
  const end = new Date(event.Finish_Date).getTime();

  if (start > now) return "Upcoming";
  if (end < now) return "Ended";

  return "Running";
};

export default function ShopAllEvents() {
  const { id } = useParams();
  const [shop] = useState(readShop);
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const shopId = id || shop._id;

  useEffect(() => {
    if (!shopId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    api
      .get(`/event/get-all-events-shop/${shopId}`)
      .then((response) => setRows(safeArray(response.data.events)))
      .catch((requestError) => setError(getError(requestError)))
      .finally(() => setLoading(false));
  }, [shopId]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) return rows;

    return rows.filter((row) =>
      [row.name, row.category, row.status].some((value) =>
        String(value || "").toLowerCase().includes(term)
      )
    );
  }, [rows, query]);

  return (
    <Shell
      title="Events"
      subtitle="Promotional events and limited-time offers from your shop."
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <SearchBox
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search events"
          />
        </div>

        <Link
          to={`/shop/${shopId}/create-event`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <FiPlus size={16} />
          Create event
        </Link>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <Table
        loading={loading}
        rows={filtered}
        empty={
          rows.length
            ? "No events match your search."
            : "You have not created any events yet."
        }
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
            key: "category",
            label: "Category",
            render: (row) => row.category || "—",
          },
          {
            key: "price",
            label: "Price",
            render: (row) => money(row.discountPrice),
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
            key: "stock",
            label: "Stock",
            render: (row) => row.stock ?? "—",
          },
          {
            key: "status",
            label: "Status",
            render: (row) => {
              const status = statusOf(row);

              return (
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    status === "Running"
                      ? "bg-green-50 text-green-700"
                      : status === "Upcoming"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {status}
                </span>
              );
            },
          },
        ]}
      />
    </Shell>
  );
}
