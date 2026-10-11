import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  api,
  Button,
  Field,
  TextArea,
  Shell,
  getError,
} from "../_pageUtils";

export default function ShopCreateProduct() {
  const shop = JSON.parse(localStorage.getItem("seller") || "{}");

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    originalPrice: "",
    discountPrice: "",
    stock: "",
  });

  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (!shop._id) {
      setError("Seller information not found. Please login again.");
      return;
    }

    if (images.length === 0) {
      setError("Please select at least one product image.");
      return;
    }

    setError("");
    setBusy(true);

    try {
      const formData = new FormData();

      formData.append("shopId", shop._id);
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("originalPrice", form.originalPrice);
      formData.append("discountPrice", form.discountPrice);
      formData.append("stock", form.stock);

      images.forEach((image) => {
        formData.append("images", image);
      });

      await api.post("/product/create-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate(`/shop/${shop._id}/products`);
    } catch (error) {
      setError(getError(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell title="Create Product" back>
      <form
        onSubmit={submit}
        className="mx-auto max-w-3xl rounded-3xl border border-gray-100 bg-white p-7 shadow-card"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Product name"
            required
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <Field
            label="Category"
            required
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          />

          <TextArea
            label="Description"
            required
            className="sm:col-span-2"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <Field
            label="Original price"
            type="number"
            min="0"
            value={form.originalPrice}
            onChange={(e) =>
              setForm({
                ...form,
                originalPrice: e.target.value,
              })
            }
          />

          <Field
            label="Discount price"
            required
            type="number"
            min="0"
            value={form.discountPrice}
            onChange={(e) =>
              setForm({
                ...form,
                discountPrice: e.target.value,
              })
            }
          />

          <Field
            label="Stock"
            required
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) =>
              setForm({
                ...form,
                stock: e.target.value,
              })
            }
          />

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-700">
              Product images
            </span>

            <input
              type="file"
              accept="image/*"
              multiple
              required
              onChange={(e) =>
                setImages(Array.from(e.target.files || []))
              }
              className="block w-full rounded-xl border border-gray-200 bg-white p-3 text-sm"
            />

            {images.length > 0 && (
              <p className="mt-2 text-xs text-gray-500">
                {images.length} image
                {images.length > 1 ? "s" : ""} selected
              </p>
            )}
          </label>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        <Button disabled={busy} className="mt-6">
          {busy ? "Creating..." : "Create Product"}
        </Button>
      </form>
    </Shell>
  );
}