import React, { useEffect, useState } from "react";
import { api, Shell, Table, safeArray, getError, money } from "../_pageUtils";

export default function ShopAllRefunds() {
  const shop = JSON.parse(localStorage.getItem("seller") || "{}");
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!shop._id) return;

    api
      .get(`/order/get-all-orders-shop/${shop._id}`)
      .then((response) =>
        setRows(
          safeArray(response.data.orders).filter(
            (order) => order.refundStatus && order.refundStatus !== "None"
          )
        )
      )
      .catch((requestError) => setError(getError(requestError)));
  }, [shop._id]);

  return (
    <Shell title="Refund Requests">
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
            key: "total",
            label: "Amount",
            render: (row) => money(row.totalPrice),
          },
          {
            key: "status",
            label: "Refund",
            render: (row) => row.refundStatus,
          },
          {
            key: "reason",
            label: "Reason",
            render: (row) => row.refundReason || "—",
          },
        ]}
      />
    </Shell>
  );
}
