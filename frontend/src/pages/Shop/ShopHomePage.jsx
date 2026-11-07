import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiCalendar,
  FiMessageCircle,
  FiPackage,
  FiShoppingBag,
  FiStar,
  FiX,
} from "react-icons/fi";

import ProductCard from "../../components/Product/ProductCard";
import {
  Button,
  Card,
  Empty,
  Shell,
  api,
  getError,
  imageUrl,
  money,
  safeArray,
} from "../_pageUtils";
import { formatDate, initials } from "../../utils/format";
import { notify } from "../../components/UI/Toaster";

const readOwnSeller = (id) => {
  try {
    const seller = JSON.parse(localStorage.getItem("seller") || "{}");
    return seller?._id === id ? seller : {};
  } catch {
    return {};
  }
};

export default function ShopHomePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state) => state.user.isAuthenticated
  );

  const [products, setProducts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contactBusy, setContactBusy] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError("");

    Promise.allSettled([
      api.get(`/product/get-all-products-shop/${id}`),
      api.get(`/event/get-all-events-shop/${id}`),
    ])
      .then(([productResult, eventResult]) => {
        if (!active) return;

        if (productResult.status === "fulfilled") {
          setProducts(safeArray(productResult.value.data.products));
        }

        if (eventResult.status === "fulfilled") {
          setEvents(safeArray(eventResult.value.data.events));
        }

        if (
          productResult.status === "rejected" &&
          eventResult.status === "rejected"
        ) {
          setError(
            getError(
              productResult.reason || eventResult.reason
            )
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const shop = useMemo(() => {
    const fromData = products[0]?.shop || events[0]?.shop;

    if (fromData) return fromData;

    return readOwnSeller(id);
  }, [products, events, id]);

  const unitsSold = useMemo(
    () =>
      products.reduce(
        (sum, product) => sum + Number(product.sold_out || 0),
        0
      ),
    [products]
  );

  const averageRating = useMemo(() => {
    const rated = products.filter(
      (product) => Number(product.ratings || 0) > 0
    );

    if (!rated.length) return 0;

    return (
      rated.reduce(
        (sum, product) => sum + Number(product.ratings || 0),
        0
      ) / rated.length
    );
  }, [products]);

  const liveEvents = events.filter(
    (event) => new Date(event.Finish_Date).getTime() >= Date.now()
  );

  const contactSeller = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/shop/${id}` } });
      return;
    }

    setContactBusy(true);

    try {
      const response = await api.post(
        "/conversation/create-new-conversation",
        {
          sellerId: id,
          groupTitle: `Chat with ${shop.name || "seller"}`,
        }
      );

      navigate(
        `/inbox?conversation=${response.data.conversation?._id || ""}`
      );
    } catch (requestError) {
      notify(getError(requestError), "error");
    } finally {
      setContactBusy(false);
    }
  };

  return (
    <Shell>
      {loading ? (
        <div className="space-y-6">
          <div className="h-64 animate-pulse rounded-[2rem] bg-white" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="aspect-[3/4] animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <section className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-card">
            <div className="h-32 bg-secondary sm:h-40" />

            <div className="px-6 pb-6 sm:px-8">
              <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-end gap-4">
                  {shop.avatar ? (
                    <img
                      src={imageUrl(shop.avatar)}
                      alt={shop.name || "Shop"}
                      className="h-24 w-24 rounded-3xl border-4 border-white object-cover shadow-sm sm:h-28 sm:w-28"
                    />
                  ) : (
                    <span className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-primary/10 font-poppins text-3xl font-extrabold text-primary shadow-sm sm:h-28 sm:w-28">
                      {initials(shop.name)}
                    </span>
                  )}

                  <div className="pb-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">
                      Seller shop
                    </p>

                    <h1 className="mt-1 font-poppins text-2xl font-extrabold text-secondary sm:text-3xl">
                      {shop.name || "Seller shop"}
                    </h1>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  className="shrink-0 px-4 py-2.5 text-xs"
                  disabled={contactBusy || !id}
                  onClick={contactSeller}
                >
                  <FiMessageCircle className="mr-2" size={15} />
                  {contactBusy ? "Opening chat..." : "Contact seller"}
                </Button>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-600">
                {shop.description ||
                  "This seller has not added a shop description yet."}
              </p>

              <div className="mt-5 flex flex-wrap gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 font-semibold text-gray-600">
                  <FiPackage size={13} className="text-primary" />
                  {products.length} product
                  {products.length === 1 ? "" : "s"}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 font-semibold text-gray-600">
                  <FiShoppingBag size={13} className="text-primary" />
                  {unitsSold} unit{unitsSold === 1 ? "" : "s"} sold
                </span>

                {averageRating > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 font-semibold text-gray-600">
                    <FiStar
                      size={13}
                      className="text-amber-400"
                      fill="currentColor"
                    />
                    {averageRating.toFixed(1)} average rating
                  </span>
                )}

                {shop.createdAt && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 font-semibold text-gray-600">
                    <FiCalendar size={13} className="text-primary" />
                    Joined {formatDate(shop.createdAt)}
                  </span>
                )}
              </div>
            </div>
          </section>

          {error && (
            <Card className="mt-6 border-red-100 bg-red-50 text-sm text-red-600">
              {error}
            </Card>
          )}

          <section className="mt-10">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="eyebrow">Shop catalog</p>
                <h2 className="section-title mt-1">Products</h2>
              </div>

              <span className="text-sm text-gray-400">
                {products.length} item{products.length === 1 ? "" : "s"}
              </span>
            </div>

            {products.length ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <Empty
                title="No products listed yet"
                text="This seller has not published any products. Check back soon or explore the marketplace."
              >
                <Link
                  to="/products"
                  className="inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Browse marketplace
                </Link>
              </Empty>
            )}
          </section>

          {liveEvents.length > 0 && (
            <section className="mt-12">
              <div className="mb-6 flex items-end justify-between gap-3">
                <div>
                  <p className="eyebrow">Promotions</p>
                  <h2 className="section-title mt-1">Shop events</h2>
                </div>

                <Link
                  to="/events"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  All events
                </Link>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {liveEvents.map((event) => (
                  <button
                    key={event._id}
                    type="button"
                    onClick={() => setSelectedEvent(event)}
                    className="group flex overflow-hidden rounded-2xl border border-gray-100 bg-white text-left shadow-card transition hover:-translate-y-1 hover:shadow-soft"
                  >
                    <img
                      src={imageUrl(event.images?.[0])}
                      alt={event.name}
                      className="h-28 w-28 shrink-0 object-cover"
                    />

                    <div className="min-w-0 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        {event.category}
                      </p>
                      <p className="mt-1 line-clamp-2 font-poppins text-sm font-bold text-secondary">
                        {event.name}
                      </p>
                      <p className="mt-2 text-sm font-extrabold text-secondary">
                        {money(event.discountPrice)}
                      </p>
                      <p className="mt-1 text-[11px] text-gray-400">
                        Ends {formatDate(event.Finish_Date)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close event"
            onClick={() => setSelectedEvent(null)}
            className="absolute inset-0 bg-secondary/50 backdrop-blur-sm"
          />

          <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-soft">
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
            >
              <FiX size={18} />
            </button>

            <img
              src={imageUrl(selectedEvent.images?.[0])}
              alt={selectedEvent.name}
              className="h-48 w-full rounded-2xl object-cover"
            />

            <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-primary">
              {selectedEvent.category}
            </p>

            <h2 className="mt-1 font-poppins text-xl font-bold text-secondary">
              {selectedEvent.name}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {selectedEvent.description}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <span className="font-poppins text-xl font-extrabold text-secondary">
                {money(selectedEvent.discountPrice)}
              </span>

              {Number(selectedEvent.originalPrice) >
                Number(selectedEvent.discountPrice) && (
                <del className="text-sm text-gray-400">
                  {money(selectedEvent.originalPrice)}
                </del>
              )}
            </div>

            <p className="mt-2 text-xs text-gray-400">
              {formatDate(selectedEvent.start_Date)} –{" "}
              {formatDate(selectedEvent.Finish_Date)}
            </p>

            <Link
              to={`/products?category=${encodeURIComponent(
                selectedEvent.category
              )}`}
              onClick={() => setSelectedEvent(null)}
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Browse {selectedEvent.category}
            </Link>
          </div>
        </div>
      )}
    </Shell>
  );
}
