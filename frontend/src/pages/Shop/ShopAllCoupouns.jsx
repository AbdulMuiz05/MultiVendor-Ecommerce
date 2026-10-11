import React, { useEffect, useState } from "react";
import {
  api,
  Button,
  Card,
  Field,
  Shell,
  Table,
  safeArray,
  getError,
  money,
} from "../_pageUtils";

export default function ShopAllCoupouns() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({
    name: "",
    value: "",
    minAmount: "",
    maxAmount: "",
  });
  const [error, setError] = useState("");

  const load = () => {
    api
      .get("/coupon/get-all-coupons")
      .then((response) => {
        setRows(safeArray(response.data.coupons));
      })
      .catch((error) => {
        setError(getError(error));
      });
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/coupon/create-coupon-code", form);

      setForm({
        name: "",
        value: "",
        minAmount: "",
        maxAmount: "",
      });

      load();
    } catch (error) {
      setError(getError(error));
    }
  };

  return (
    <Shell title="Coupons">
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card>
          <h2 className="font-poppins text-xl font-bold">
            Create coupon
          </h2>

          <form onSubmit={create} className="mt-5 space-y-4">
            <Field
              label="Code"
              required
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <Field
              label="Discount value"
              type="number"
              required
              value={form.value}
              onChange={(e) =>
                setForm({
                  ...form,
                  value: e.target.value,
                })
              }
            />

            <Field
              label="Minimum amount"
              type="number"
              value={form.minAmount}
              onChange={(e) =>
                setForm({
                  ...form,
                  minAmount: e.target.value,
                })
              }
            />

            <Field
              label="Maximum amount"
              type="number"
              value={form.maxAmount}
              onChange={(e) =>
                setForm({
                  ...form,
                  maxAmount: e.target.value,
                })
              }
            />

            <Button>Create Coupon</Button>
          </form>
        </Card>

        <div>
          {error && (
            <p className="mb-4 text-sm text-red-600">
              {error}
            </p>
          )}

          <Table
            rows={rows}
            columns={[
              {
                key: "name",
                label: "Code",
                render: (row) => (
                  <span className="font-bold text-primary">
                    {row.name}
                  </span>
                ),
              },
              {
                key: "value",
                label: "Value",
                render: (row) => money(row.value),
              },
              {
                key: "minAmount",
                label: "Min",
                render: (row) => money(row.minAmount),
              },
              {
                key: "maxAmount",
                label: "Max",
                render: (row) => money(row.maxAmount),
              },
              {
                key: "action",
                label: "Action",
                render: (row) => (
                  <Button
                    variant="danger"
                    className="px-3 py-2 text-xs"
                    onClick={async () => {
                      try {
                        await api.delete(`/coupon/delete-coupon-code/${row._id}`);
                        load();
                      } catch (requestError) {
                        setError(getError(requestError));
                      }
                    }}
                  >
                    Delete
                  </Button>
                ),
              },
            ]}
          />
        </div>
      </div>
    </Shell>
  );
}