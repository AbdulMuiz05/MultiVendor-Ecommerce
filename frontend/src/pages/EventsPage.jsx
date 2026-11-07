import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiPackage,
  FiTag,
  FiX,
} from "react-icons/fi";

import {
  Empty,
  Shell,
  api,
  getError,
  imageUrl,
  money,
  safeArray,
} from "./_pageUtils";
import { discountPercent, formatDate } from "../utils/format";

const eventStatus = (event) => {
  const now = Date.now();
  const start = new Date(event.start_Date).getTime();
  const end = new Date(event.Finish_Date).getTime();

  if (Number.isFinite(end) && end < now) return "Ended";
  if (Number.isFinite(start) && start > now) return "Upcoming";

  return event.status || "Running";
};

const daysLeft = (event) => {
  const end = new Date(event.Finish_Date).getTime();

  if (!Number.isFinite(end)) return null;

  return Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24));
};

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let active = true;

    api
      .get("/event/get-all-events")
      .then((response) => {
        if (active) setEvents(safeArray(response.data.events));
      })
      .catch((requestError) => {
        if (active) setError(getError(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selected) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setSelected(null);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [selected]);

  const counts = useMemo(() => {
    const result = { all: events.length, live: 0, upcoming: 0, ended: 0 };

    events.forEach((event) => {
      const status = eventStatus(event);

      if (status === "Ended") result.ended += 1;
      else if (status === "Upcoming") result.upcoming += 1;
      else result.live += 1;
    });

    return result;
  }, [events]);

  const filtered = useMemo(() => {
    if (filter === "all") return events;

    return events.filter((event) => {
      const status = eventStatus(event);

      if (filter === "live") return status === "Running";
      if (filter === "upcoming") return status === "Upcoming";

      return status === "Ended";
    });
  }, [events, filter]);

  return (
    <Shell>
      <section className="relative overflow-hidden rounded-[2rem] bg-secondary px-6 py-12 text-white shadow-soft sm:px-10">
        <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
            <FiTag size={14} />
            Events & offers
          </span>

          <h1 className="mt-5 font-poppins text-3xl font-extrabold sm:text-5xl">
            Limited-time deals from sellers
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-gray-300 sm:text-base">
            Browse seasonal campaigns and special offers. Event availability
            and dates are set by each seller.
          </p>

          <Link
            to="/products"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold transition hover:opacity-90"
          >
            Shop all products
            <FiArrowRight />
          </Link>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {[
          ["all", "All events", counts.all],
          ["live", "Live now", counts.live],
          ["upcoming", "Upcoming", counts.upcoming],
          ["ended", "Ended", counts.ended],
        ].map(([value, label, count]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === value
                ? "bg-secondary text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            {label}
            <span
              className={`ml-2 rounded-full px-1.5 py-0.5 text-[11px] ${
                filter === value
                  ? "bg-white/15 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card"
              >
                <div className="h-52 animate-pulse bg-gray-100" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
                  <div className="h-5 w-3/4 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <Empty title="Couldn't load events" text={error}>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </Empty>
        ) : filtered.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => {
              const status = eventStatus(event);
              const discount = discountPercent(event);

              return (
                <article
                  key={event._id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft"
                >
                  <div className="relative h-52 overflow-hidden bg-gray-50">
                    <img
                      src={imageUrl(event.images?.[0])}
                      alt={event.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />

                    <span
                      className={`absolute left-3 top-3 rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                        status === "Ended"
                          ? "bg-gray-900/80 text-white"
                          : status === "Upcoming"
                          ? "bg-amber-500 text-white"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      {status === "Running" ? "Live now" : status}
                    </span>

                    {discount > 0 && (
                      <span className="absolute bottom-3 left-3 rounded-lg bg-primary px-2.5 py-1 text-[11px] font-bold text-white">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                      {event.category}
                    </p>

                    <h2 className="mt-2 line-clamp-2 font-poppins text-lg font-bold text-secondary">
                      {event.name}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                      {event.description}
                    </p>

                    <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
                      <FiCalendar size={13} />
                      {formatDate(event.start_Date)} –{" "}
                      {formatDate(event.Finish_Date)}
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                      <div>
                        <p className="font-poppins text-lg font-extrabold text-secondary">
                          {money(event.discountPrice)}
                        </p>

                        {Number(event.originalPrice) >
                          Number(event.discountPrice) && (
                          <p className="text-xs text-gray-400 line-through">
                            {money(event.originalPrice)}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelected(event)}
                        className="inline-flex items-center gap-1 rounded-xl bg-secondary px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-primary"
                      >
                        View deal
                        <FiArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <Empty
            title="No events in this view"
            text="Try another filter, or check back when sellers publish new offers."
          />
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-5">
          <button
            type="button"
            aria-label="Close event details"
            onClick={() => setSelected(null)}
            className="absolute inset-0 bg-secondary/50 backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={selected.name}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-soft sm:rounded-3xl"
          >
            <div className="relative h-56 bg-gray-50 sm:h-64">
              <img
                src={imageUrl(selected.images?.[0])}
                alt={selected.name}
                className="h-full w-full object-cover"
              />

              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow-sm transition hover:text-primary"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                  {selected.category}
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                  {eventStatus(selected) === "Running"
                    ? "Live now"
                    : eventStatus(selected)}
                </span>
              </div>

              <h2 className="mt-3 font-poppins text-2xl font-extrabold text-secondary">
                {selected.name}
              </h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
                {selected.description}
              </p>

              <div className="mt-5 flex flex-wrap items-end gap-3">
                <span className="font-poppins text-2xl font-extrabold text-secondary">
                  {money(selected.discountPrice)}
                </span>

                {Number(selected.originalPrice) >
                  Number(selected.discountPrice) && (
                  <del className="text-gray-400">
                    {money(selected.originalPrice)}
                  </del>
                )}

                {discountPercent(selected) > 0 && (
                  <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    {discountPercent(selected)}% off
                  </span>
                )}
              </div>

              <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 px-4 py-3">
                  <dt className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                    <FiClock size={13} />
                    Event window
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-secondary">
                    {formatDate(selected.start_Date)} –{" "}
                    {formatDate(selected.Finish_Date)}
                  </dd>
                </div>

                <div className="rounded-xl bg-gray-50 px-4 py-3">
                  <dt className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                    <FiPackage size={13} />
                    Availability
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-secondary">
                    {Number(selected.stock) > 0
                      ? `${selected.stock} units listed`
                      : "Currently unavailable"}
                    {daysLeft(selected) > 0
                      ? ` · ${daysLeft(selected)} day${
                          daysLeft(selected) === 1 ? "" : "s"
                        } left`
                      : ""}
                  </dd>
                </div>
              </dl>

              {selected.shop?.name && (
                <p className="mt-5 text-sm text-gray-500">
                  Offered by{" "}
                  <Link
                    to={`/shop/${selected.shopId}`}
                    onClick={() => setSelected(null)}
                    className="font-semibold text-primary hover:underline"
                  >
                    {selected.shop.name}
                  </Link>
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to={`/products?category=${encodeURIComponent(
                    selected.category
                  )}`}
                  onClick={() => setSelected(null)}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Shop {selected.category}
                  <FiArrowRight />
                </Link>

                {selected.shopId && (
                  <Link
                    to={`/shop/${selected.shopId}`}
                    onClick={() => setSelected(null)}
                    className="inline-flex items-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-secondary transition hover:border-primary hover:text-primary"
                  >
                    Visit seller
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}
