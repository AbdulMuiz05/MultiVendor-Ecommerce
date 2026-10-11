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

export default function AdminDashboardWithdraw() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  const load = () => {
    api
      .get("/admin/withdraws")
      .then((response) => setRows(safeArray(response.data.withdraws)))
      .catch((requestError) => setError(getError(requestError)));
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    setError("");

    try {
      await api.put(`/admin/withdraws/${id}`, { status });
      load();
    } catch (requestError) {
      setError(getError(requestError));
    }
  };

  return (
    <Shell title="Withdrawals" subtitle="Review seller withdrawal requests.">
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <Table
        rows={rows}
        columns={[
          {
            key: "seller",
            label: "Seller",
            render: (row) =>
              row.seller?.name || row.seller?.email || "—",
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
            key: "amount",
            label: "Amount",
            render: (row) => money(row.amount),
          },
          {
            key: "status",
            label: "Status",
            render: (row) => row.status,
          },
          {
            key: "action",
            label: "Action",
            render: (row) =>
              row.status === "Processing" ? (
                <div className="flex gap-2">
                  <Button
                    className="px-3 py-2 text-xs"
                    onClick={() =>
                      updateStatus(row._id, "Approved")
                    }
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    className="px-3 py-2 text-xs"
                    onClick={() =>
                      updateStatus(row._id, "Rejected")
                    }
                  >
                    Reject
                  </Button>
                </div>
              ) : (
                "—"
              ),
          },
        ]}
      />
    </Shell>
  );
}
