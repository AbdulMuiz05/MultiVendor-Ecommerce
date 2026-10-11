import React from "react";
import { Link } from "react-router-dom";
import { Shell, Card } from "../_pageUtils";

export default function ShopHomePage() {
  const shop = JSON.parse(localStorage.getItem("seller") || "{}");

  const items = [
    ["Products", "Manage your catalog", `/shop/${shop._id}/products`],
    ["Orders", "View and process orders", `/shop/${shop._id}/orders`],
    ["Create Product", "Add a new product", `/shop/${shop._id}/create-product`],
    ["Events", "Manage promotional events", `/shop/${shop._id}/events`],
    ["Coupons", "Create discount codes", `/shop/${shop._id}/coupons`],
    ["Settings", "Update shop information", `/shop/${shop._id}/settings`],
  ];

  return (
    <Shell title={shop.name || "Shop"} subtitle="Your seller workspace.">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(([title, description, url]) => (
          <Card key={url}>
            <h2 className="font-poppins text-xl font-bold text-secondary">
              {title}
            </h2>
            <p className="mt-2 text-sm text-gray-500">{description}</p>
            <Link
              to={url}
              className="mt-5 inline-block text-sm font-semibold text-primary"
            >
              Open →
            </Link>
          </Card>
        ))}
      </div>
    </Shell>
  );
}
