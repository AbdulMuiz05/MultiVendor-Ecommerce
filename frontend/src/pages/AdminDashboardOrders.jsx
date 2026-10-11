import React, { useEffect, useState } from "react";
import {
  api,
  Shell,
  Table,
  safeArray,
  getError,
  money,
  Button,
} from "./_pageUtils";

export default function AdminDashboardOrders() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  const load = () => {
    api
      .get("/admin/orders")
      .then((response) => setRows(safeArray(response.data.orders)))
      .catch((requestError) => setError(getError(requestError)));
  };

  useEffect(() => {
    load();
  }, []);

  const refund = async (id, decision) => {
    setError("");

    try {
      await api.put(`/admin/orders/${id}/refund`, { decision });
      load();
    } catch (requestError) {
      setError(getError(requestError));
    }
  };

  return (
    <Shell title="Orders" subtitle="Manage marketplace orders and refunds.">
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <Table
        rows={rows}
        columns={[
          {
            key: "id",
            label: "Order",
            render: (row) => `#${row._id?.slice(-8)}`,
          },
          {
            key: "customer",
            label: "Customer",
            render: (row) =>
              row.user?.name || row.user?.email || "—",
          },
          {
            key: "createdAt",
            label: "Created",
            render: (row) =>
              row.createdAt
                ? new Date(row.createdAt).toLocaleDateString()
                : "—",
          },
          {
            key: "total",
            label: "Total",
            render: (row) => money(row.totalPrice),
          },
          {
            key: "status",
            label: "Status",
            render: (row) => row.status,
          },
          {
            key: "refund",
            label: "Refund",
            render: (row) =>
              row.refundStatus === "Requested" ? (
                <div className="flex gap-2">
                  <Button
                    className="px-3 py-2 text-xs"
                    onClick={() => refund(row._id, "approve")}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    className="px-3 py-2 text-xs"
                    onClick={() => refund(row._id, "reject")}
                  >
                    Reject
                  </Button>
                </div>
              ) : (
                row.refundStatus || "None"
              ),
          },
        ]}
      />
    </Shell>
  );
}
