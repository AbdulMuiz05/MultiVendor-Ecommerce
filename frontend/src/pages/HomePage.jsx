import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPackage,
  FiShield,
  FiShoppingBag,
  FiStar,
  FiTrendingUp,
  FiTruck,
} from "react-icons/fi";

import ProductCard from "../components/Product/ProductCard";
import {
  Card,
  Empty,
  Shell,
  api,
  imageUrl,
  money,
  safeArray,
} from "./_pageUtils";
import { discountPercent, formatDate } from "../utils/format";

const SectionHeader = ({ eyebrow, title, text, actionLabel, actionTo }) => (
  <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
    <div>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}

      <h2 className="section-title mt-1.5">{title}</h2>

      {text && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          {text}
        </p>
      )}
    </div>

    {actionLabel && actionTo && (
      <Link
        to={actionTo}
        className="group inline-flex items-center gap-2 text-sm font-bold text-primary"
      >
        {actionLabel}
        <FiArrowRight
          size={15}
          className="transition group-hover:translate-x-0.5"
        />
      </Link>
    )}
  </div>
);

const serviceItems = [
  {
    icon: FiShoppingBag,
    title: "Multi-vendor catalog",
    text: "Products from independent sellers.",
  },
  {
    icon: FiTruck,
    title: "Order tracking",
    text: "Follow every order status update.",
  },
  {
    icon: FiShield,
    title: "Secure checkout",
    text: "COD and Stripe payment flows.",
  },
  {
    icon: FiPackage,
    title: "Seller storefronts",
    text: "Explore each seller's collection.",
  },
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.allSettled([
      api.get("/product/get-all-products"),
      api.get("/event/get-all-events"),
    ])
      .then(([productResult, eventResult]) => {
        if (!active) return;

        if (productResult.status === "fulfilled") {
          setProducts(safeArray(productResult.value.data.products));
        } else {
          setError("Products could not be loaded right now.");
        }

        if (eventResult.status === "fulfilled") {
          setEvents(safeArray(eventResult.value.data.events));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    const map = new Map();

    products.forEach((product) => {
      if (!product.category) return;

      const current = map.get(product.category) || {
        name: product.category,
        count: 0,
        image: product.images?.[0],
      };

      current.count += 1;

      if (!current.image && product.images?.[0]) {
        current.image = product.images[0];
      }

      map.set(product.category, current);
    });

    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [products]);

  const shops = useMemo(() => {
    const map = new Map();

    products.forEach((product) => {
      if (!product.shopId) return;

      const current = map.get(product.shopId) || {
        id: product.shopId,
        name: product.shop?.name || "Independent seller",
        description: product.shop?.description,
        avatar: product.shop?.avatar,
        address: product.shop?.address,
        count: 0,
        image: product.images?.[0],
      };

      current.count += 1;

      if (!current.image && product.images?.[0]) {
        current.image = product.images[0];
      }

      map.set(product.shopId, current);
    });

    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [products]);

  const bestSelling = useMemo(
    () =>
      [...products]
        .sort(
          (a, b) => Number(b.sold_out || 0) - Number(a.sold_out || 0)
        )
        .slice(0, 8),
    [products]
  );

  const latest = useMemo(
    () =>
      [...products]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        )
        .slice(0, 8),
    [products]
  );

  const offers = useMemo(
    () =>
      [...products]
        .filter((product) => discountPercent(product) > 0)
        .sort((a, b) => discountPercent(b) - discountPercent(a))
        .slice(0, 4),
    [products]
  );

  const testimonials = useMemo(
    () =>
      products
        .flatMap((product) =>
          safeArray(product.reviews).map((review) => ({
            ...review,
            productName: product.name,
            productImage: product.images?.[0],
          }))
        )
        .filter((review) => review.message)
        .slice(0, 3),
    [products]
  );

  const heroImages = products
    .filter((product) => product.images?.[0])
    .slice(0, 3);

  const featuredEvent = events[0];

  if (loading) {
    return (
      <Shell>
        <div className="space-y-8">
          <div className="h-[420px] animate-pulse rounded-[2rem] bg-secondary/10" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="space-y-16 sm:space-y-20">
        {error && (
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-700">
            {error}
          </div>
        )}

        <section className="relative overflow-hidden rounded-[2rem] bg-secondary text-white shadow-soft">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative grid gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
            <div className="rise-in">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white">
                <FiTrendingUp className="text-primary" size={14} />
                Multi-vendor marketplace
              </span>

              <h1 className="mt-6 font-poppins text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                Everything you want,
                <br />
                from sellers you can{" "}
                <span className="text-primary">trust.</span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-gray-300 sm:text-base">
                Browse products across categories, compare real seller
                storefronts, save favourites and track every order — all in
                one marketplace.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:opacity-90"
                >
                  Shop now
                  <FiArrowRight size={17} />
                </Link>

                <Link
                  to="/best-selling"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  Best selling
                </Link>
              </div>

              {products.length > 0 && (
                <div className="mt-9 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
                  <div>
                    <p className="font-poppins text-2xl font-extrabold">
                      {products.length}
                    </p>
                    <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-gray-400">
                      Products
                    </p>
                  </div>

                  <div>
                    <p className="font-poppins text-2xl font-extrabold">
                      {shops.length}
                    </p>
                    <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-gray-400">
                      Sellers
                    </p>
                  </div>

                  <div>
                    <p className="font-poppins text-2xl font-extrabold">
                      {categories.length}
                    </p>
                    <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-gray-400">
                      Categories
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="relative hidden min-h-[380px] lg:block">
              {heroImages.length > 0 ? (
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-4">
                  <Link
                    to={`/product/${heroImages[0]._id}`}
                    className="group relative row-span-2 overflow-hidden rounded-3xl border border-white/10"
                  >
                    <img
                      src={imageUrl(heroImages[0].images[0])}
                      alt={heroImages[0].name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-secondary/90 to-transparent p-5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        Featured
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm font-bold">
                        {heroImages[0].name}
                      </p>
                      <p className="mt-1 text-sm font-extrabold">
                        {money(
                          heroImages[0].discountPrice ||
                            heroImages[0].price
                        )}
                      </p>
                    </div>
                  </Link>

                  {heroImages.slice(1, 3).map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      className="group relative overflow-hidden rounded-3xl border border-white/10"
                    >
                      <img
                        src={imageUrl(product.images[0])}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-secondary/90 to-transparent p-4">
                        <p className="line-clamp-1 text-xs font-bold">
                          {product.name}
                        </p>
                        <p className="mt-1 text-xs font-extrabold text-white/80">
                          {money(product.discountPrice || product.price)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center rounded-3xl border border-white/10 bg-white/5">
                  <FiShoppingBag size={64} className="text-white/20" />
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {serviceItems.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={20} />
              </span>

              <div>
                <h3 className="font-poppins text-sm font-bold text-secondary">
                  {title}
                </h3>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {text}
                </p>
              </div>
            </Card>
          ))}
        </section>

        {categories.length > 0 && (
          <section>
            <SectionHeader
              eyebrow="Explore"
              title="Shop by category"
              text="Browse the categories currently available across seller storefronts."
              actionLabel="All products"
              actionTo="/products"
            />

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.name}
                  to={`/products?category=${encodeURIComponent(
                    category.name
                  )}`}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-100 bg-secondary shadow-card"
                >
                  {category.image ? (
                    <img
                      src={imageUrl(category.image)}
                      alt={category.name}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-poppins text-3xl font-extrabold text-white/30">
                      {category.name[0]}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="line-clamp-1 text-sm font-bold text-white">
                      {category.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-gray-300">
                      {category.count} product
                      {category.count === 1 ? "" : "s"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {products.length === 0 ? (
          <Empty
            title="No products yet"
            text="The marketplace is ready for its first sellers. Create a shop to publish products."
          >
            <Link
              to="/shop-create"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
            >
              Become a seller
              <FiArrowRight size={15} />
            </Link>
          </Empty>
        ) : (
          <>
            {bestSelling.length > 0 && (
              <section>
                <SectionHeader
                  eyebrow="Popular right now"
                  title="Best selling products"
                  text="Ranked by units sold across the marketplace."
                  actionLabel="View best sellers"
                  actionTo="/best-selling"
                />

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {bestSelling.map((product, index) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      rank={index + 1}
                    />
                  ))}
                </div>
              </section>
            )}

            {featuredEvent && (
              <section className="overflow-hidden rounded-[2rem] bg-secondary text-white">
                <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                    <p className="eyebrow">Promotional event</p>

                    <h2 className="mt-3 font-poppins text-3xl font-extrabold leading-tight sm:text-4xl">
                      {featuredEvent.name}
                    </h2>

                    <p className="mt-4 line-clamp-3 max-w-xl text-sm leading-7 text-gray-300">
                      {featuredEvent.description}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-gray-300">
                      <span className="flex items-center gap-2">
                        <FiCalendar className="text-primary" size={16} />
                        {formatDate(featuredEvent.start_Date)} —{" "}
                        {formatDate(featuredEvent.Finish_Date)}
                      </span>

                      <span className="flex items-center gap-2 font-bold text-white">
                        {money(featuredEvent.discountPrice)}
                      </span>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        to="/events"
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
                      >
                        Explore all events
                        <FiArrowRight size={15} />
                      </Link>

                      <Link
                        to={`/shop/${featuredEvent.shopId}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold"
                      >
                        Visit seller
                      </Link>
                    </div>
                  </div>

                  <div className="relative min-h-[260px]">
                    <img
                      src={imageUrl(featuredEvent.images?.[0])}
                      alt={featuredEvent.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                </div>
              </section>
            )}

            {offers.length > 0 && (
              <section>
                <SectionHeader
                  eyebrow="Save more"
                  title="Special offers"
                  text="Products with an active discount from their seller."
                  actionLabel="Browse products"
                  actionTo="/products?sort=price-low"
                />

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {offers.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {latest.length > 0 && (
              <section>
                <SectionHeader
                  eyebrow="Just added"
                  title="Latest arrivals"
                  text="The newest products published by marketplace sellers."
                  actionLabel="View all"
                  actionTo="/products?sort=newest"
                />

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {latest.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {events.length > 0 && (
          <section>
            <SectionHeader
              eyebrow="Limited time"
              title="Events & offers"
              text="Promotional events created by sellers across the marketplace."
              actionLabel="All events"
              actionTo="/events"
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.slice(0, 3).map((event) => {
                const start = new Date(event.start_Date).getTime();
                const finish = new Date(event.Finish_Date).getTime();
                const now = Date.now();

                const status =
                  Number.isFinite(finish) && finish < now
                    ? "Ended"
                    : Number.isFinite(start) && start > now
                    ? "Upcoming"
                    : "Running";

                return (
                  <article
                    key={event._id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-50">
                      <img
                        src={imageUrl(event.images?.[0])}
                        alt={event.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <span
                        className={`absolute left-3 top-3 rounded-lg px-2.5 py-1 text-[10px] font-bold text-white ${
                          status === "Running"
                            ? "bg-emerald-500"
                            : status === "Upcoming"
                            ? "bg-sky-600"
                            : "bg-gray-800"
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        {event.category}
                      </p>

                      <h3 className="mt-1.5 line-clamp-2 font-poppins text-lg font-bold text-secondary">
                        {event.name}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                        {event.description}
                      </p>

                      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <FiClock size={13} />
                          {formatDate(event.Finish_Date)}
                        </span>

                        <span className="font-bold text-secondary">
                          {money(event.discountPrice)}
                        </span>
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                        <span className="truncate text-xs text-gray-400">
                          {event.shop?.name || "Marketplace seller"}
                        </span>

                        <Link
                          to={`/shop/${event.shopId}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary"
                        >
                          Visit shop
                          <FiArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {shops.length > 0 && (
          <section>
            <SectionHeader
              eyebrow="Meet the sellers"
              title="Featured storefronts"
              text="Independent sellers currently publishing products on Eshop."
              actionLabel="Shop products"
              actionTo="/products"
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {shops.slice(0, 4).map((shop) => (
                <Card key={shop.id} className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 font-poppins text-lg font-extrabold text-primary">
                      {shop.avatar ? (
                        <img
                          src={imageUrl(shop.avatar)}
                          alt={shop.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        (shop.name || "S")[0].toUpperCase()
                      )}
                    </span>

                    <div className="min-w-0">
                      <h3 className="truncate font-poppins text-base font-bold text-secondary">
                        {shop.name}
                      </h3>

                      <p className="mt-0.5 text-xs text-gray-500">
                        {shop.count} product
                        {shop.count === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 line-clamp-3 min-h-[60px] text-sm leading-5 text-gray-500">
                    {shop.description ||
                      "Browse this seller's products and discover their latest collection."}
                  </p>

                  {shop.address && (
                    <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
                      <FiMapPin size={13} />
                      <span className="truncate">{shop.address}</span>
                    </p>
                  )}

                  <Link
                    to={`/shop/${shop.id}`}
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-secondary transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                  >
                    Visit storefront
                    <FiArrowRight size={13} />
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        )}

        {testimonials.length > 0 && (
          <section>
            <SectionHeader
              eyebrow="Real feedback"
              title="What customers are saying"
              text="Reviews written by customers on marketplace products."
            />

            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.map((review, index) => (
                <Card key={review._id || index} className="flex flex-col">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        size={15}
                        fill={
                          star <= Number(review.rating || 0)
                            ? "currentColor"
                            : "none"
                        }
                        className={
                          star <= Number(review.rating || 0)
                            ? "text-amber-400"
                            : "text-gray-200"
                        }
                      />
                    ))}
                  </div>

                  <p className="mt-4 flex-1 text-sm leading-7 text-gray-600">
                    “{review.message}”
                  </p>

                  <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {(review.user?.name || "C")[0].toUpperCase()}
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-secondary">
                        {review.user?.name || "Customer"}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {review.productName}
                      </p>
                    </div>

                    <FiCheckCircle
                      className="ml-auto shrink-0 text-emerald-500"
                      size={16}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section className="relative overflow-hidden rounded-[2rem] bg-secondary p-8 text-white sm:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="eyebrow">Sell on Eshop</p>

              <h2 className="mt-3 font-poppins text-3xl font-extrabold leading-tight sm:text-4xl">
                Turn your products into a storefront.
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-300">
                Manage your catalog, orders, events, coupons and payouts from
                one seller workspace. Customer accounts and seller sessions
                stay completely separate.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/shop-create"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white transition hover:opacity-90"
              >
                Create a shop
                <FiArrowRight size={16} />
              </Link>

              <Link
                to="/shop-login"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/15"
              >
                Seller login
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
};

export default HomePage;
