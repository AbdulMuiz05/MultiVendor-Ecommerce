import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiChevronRight,
  FiHeart,
  FiLoader,
  FiMessageCircle,
  FiMinus,
  FiPlus,
  FiShield,
  FiShoppingCart,
  FiStar,
  FiTruck,
} from "react-icons/fi";

import ProductCard from "../components/Product/ProductCard";
import {
  Button,
  Card,
  Shell,
  TextArea,
  api,
  getError,
  imageUrl,
  money,
  safeArray,
} from "./_pageUtils";
import { addToCart } from "../redux/actions/cart";
import { toggleWishlist } from "../redux/actions/wishlist";
import {
  discountPercent,
  formatDate,
  initials,
  productPrice,
} from "../utils/format";
import { notify } from "../components/UI/Toaster";

const DetailSkeleton = () => (
  <div className="grid gap-8 lg:grid-cols-2">
    <div className="aspect-square animate-pulse rounded-3xl bg-white" />

    <div className="space-y-4 py-4">
      <div className="h-4 w-24 animate-pulse rounded bg-white" />
      <div className="h-10 w-4/5 animate-pulse rounded bg-white" />
      <div className="h-6 w-40 animate-pulse rounded bg-white" />
      <div className="h-24 w-full animate-pulse rounded bg-white" />
      <div className="h-12 w-full animate-pulse rounded-xl bg-white" />
    </div>
  </div>
);

const Stars = ({ value = 0, size = 15 }) => (
  <span className="flex items-center gap-0.5 text-amber-400">
    {[1, 2, 3, 4, 5].map((star) => (
      <FiStar
        key={star}
        size={size}
        fill={star <= Math.round(value) ? "currentColor" : "none"}
        className={star <= Math.round(value) ? "" : "text-gray-300"}
      />
    ))}
  </span>
);

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart.cart);
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [contactBusy, setContactBusy] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewBusy, setReviewBusy] = useState(false);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError("");
    setProduct(null);
    setActiveImage(0);
    setQty(1);

    api
      .get(`/product/get-product/${id}`)
      .then((response) => {
        if (active) setProduct(response.data.product || null);
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
  }, [id]);

  useEffect(() => {
    let active = true;

    if (!product?.category) {
      setRelated([]);
      return undefined;
    }

    setRelatedLoading(true);

    api
      .get(
        `/product/get-all-products?category=${encodeURIComponent(
          product.category
        )}`
      )
      .then((response) => {
        if (active) {
          setRelated(
            safeArray(response.data.products)
              .filter((item) => item._id !== product._id)
              .slice(0, 4)
          );
        }
      })
      .catch(() => {
        if (active) setRelated([]);
      })
      .finally(() => {
        if (active) setRelatedLoading(false);
      });

    return () => {
      active = false;
    };
  }, [product]);

  const images = useMemo(
    () =>
      safeArray(product?.images).filter(Boolean).length
        ? safeArray(product.images).filter(Boolean)
        : [product?.images?.[0]].filter(Boolean),
    [product]
  );

  if (loading) {
    return (
      <Shell back>
        <DetailSkeleton />
      </Shell>
    );
  }

  if (error || !product) {
    return (
      <Shell back>
        <Card className="py-16 text-center">
          <h1 className="font-poppins text-xl font-bold text-secondary">
            Product unavailable
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {error || "This product could not be found."}
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Browse products
          </Link>
        </Card>
      </Shell>
    );
  }

  const price = productPrice(product);
  const original = Number(product.originalPrice);
  const discount = discountPercent(product);
  const stock = Number(product.stock || 0);
  const outOfStock = stock <= 0;
  const rating = Number(product.ratings || 0);
  const reviews = safeArray(product.reviews);
  const wished = wishlist.some((item) => item._id === product._id);
  const alreadyReviewed =
    isAuthenticated &&
    reviews.some(
      (review) => String(review.user?._id) === String(user?._id)
    );
  const shop = product.shop || {};
  const shopId = product.shopId || shop._id;

  const inCartQty =
    cart.find((item) => item._id === product._id)?.qty || 0;

  const handleAddToCart = (redirect = false) => {
    if (outOfStock) return;

    if (inCartQty + qty > stock) {
      notify(
        `Only ${stock} unit${stock === 1 ? "" : "s"} available.`,
        "error"
      );
      return;
    }

    dispatch(addToCart({ ...product, qty }));
    notify(`${product.name} added to cart.`);

    if (redirect) navigate("/checkout");
  };

  const handleWishlist = () => {
    const added = dispatch(toggleWishlist(product));
    notify(
      added ? "Saved to your wishlist." : "Removed from your wishlist.",
      added ? "success" : "info"
    );
  };

  const handleContactSeller = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/product/${product._id}` } });
      return;
    }

    setContactBusy(true);

    try {
      const response = await api.post(
        "/conversation/create-new-conversation",
        {
          sellerId: shopId,
          groupTitle: `Chat about ${product.name}`,
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

  const submitReview = async (event) => {
    event.preventDefault();

    if (!reviewMessage.trim()) return;

    setReviewBusy(true);
    setReviewError("");

    try {
      const response = await api.post(
        `/product/add-review/${product._id}`,
        { rating: reviewRating, message: reviewMessage.trim() }
      );

      setProduct(response.data.product);
      setReviewMessage("");
      setReviewRating(5);
      notify("Thanks for sharing your review.");
    } catch (requestError) {
      setReviewError(getError(requestError));
    } finally {
      setReviewBusy(false);
    }
  };

  return (
    <Shell>
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-gray-400">
        <Link to="/" className="transition hover:text-primary">
          Home
        </Link>
        <FiChevronRight size={12} />
        <Link to="/products" className="transition hover:text-primary">
          Products
        </Link>
        <FiChevronRight size={12} />
        <Link
          to={`/products?category=${encodeURIComponent(product.category)}`}
          className="transition hover:text-primary"
        >
          {product.category}
        </Link>
        <FiChevronRight size={12} />
        <span className="truncate text-gray-500">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-3 shadow-card">
            <img
              src={imageUrl(images[activeImage] || images[0])}
              alt={product.name}
              className="aspect-square w-full rounded-2xl object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    activeImage === index
                      ? "border-primary"
                      : "border-transparent hover:border-gray-200"
                  }`}
                >
                  <img
                    src={imageUrl(image)}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="py-1">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/products?category=${encodeURIComponent(product.category)}`}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary"
            >
              {product.category}
            </Link>

            {rating > 0 && (
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <Stars value={rating} />
                <span className="font-semibold text-secondary">
                  {rating.toFixed(1)}
                </span>
                <span>({reviews.length})</span>
              </span>
            )}
          </div>

          <h1 className="mt-4 font-poppins text-3xl font-extrabold leading-tight text-secondary sm:text-4xl">
            {product.name}
          </h1>

          {shop.name && (
            <p className="mt-3 text-sm text-gray-500">
              Sold by{" "}
              <Link
                to={`/shop/${shopId}`}
                className="font-semibold text-primary hover:underline"
              >
                {shop.name}
              </Link>
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-end gap-3">
            <span className="font-poppins text-3xl font-extrabold text-secondary">
              {money(price)}
            </span>

            {original > price && (
              <del className="text-lg text-gray-400">{money(original)}</del>
            )}

            {discount > 0 && (
              <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                {discount}% off
              </span>
            )}
          </div>

          <p className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-600">
            {product.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
            {outOfStock ? (
              <span className="font-semibold text-red-600">Out of stock</span>
            ) : stock <= 5 ? (
              <span className="font-semibold text-amber-600">
                Only {stock} left in stock
              </span>
            ) : (
              <span className="font-semibold text-emerald-600">In stock</span>
            )}

            {!outOfStock && (
              <span className="text-gray-400">
                · Ships from {shop.name || "the seller"}
              </span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-xl border border-gray-200 bg-white">
              <button
                type="button"
                onClick={() => setQty((current) => Math.max(1, current - 1))}
                disabled={qty <= 1 || outOfStock}
                aria-label="Decrease quantity"
                className="flex h-12 w-12 items-center justify-center text-gray-500 transition hover:text-secondary disabled:opacity-40"
              >
                <FiMinus size={16} />
              </button>

              <span className="w-10 text-center font-semibold text-secondary">
                {qty}
              </span>

              <button
                type="button"
                onClick={() =>
                  setQty((current) => Math.min(stock || 1, current + 1))
                }
                disabled={outOfStock || qty >= stock}
                aria-label="Increase quantity"
                className="flex h-12 w-12 items-center justify-center text-gray-500 transition hover:text-secondary disabled:opacity-40"
              >
                <FiPlus size={16} />
              </button>
            </div>

            <Button
              className="min-w-[150px] flex-1"
              disabled={outOfStock}
              onClick={() => handleAddToCart(false)}
            >
              <FiShoppingCart className="mr-2" />
              {outOfStock ? "Out of stock" : "Add to cart"}
            </Button>

            <Button
              className="min-w-[130px] flex-1 bg-secondary text-white hover:bg-primary"
              disabled={outOfStock}
              onClick={() => handleAddToCart(true)}
            >
              Buy now
            </Button>
          </div>

          {inCartQty > 0 && !outOfStock && (
            <p className="mt-3 text-xs text-gray-500">
              You already have {inCartQty} in your{" "}
              <Link to="/cart" className="font-semibold text-primary">
                cart
              </Link>
              .
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleWishlist}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                wished
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <FiHeart size={16} fill={wished ? "currentColor" : "none"} />
              {wished ? "Saved" : "Wishlist"}
            </button>

            <button
              type="button"
              onClick={handleContactSeller}
              disabled={contactBusy || !shopId}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-gray-300 disabled:opacity-50"
            >
              {contactBusy ? (
                <FiLoader className="animate-spin" size={16} />
              ) : (
                <FiMessageCircle size={16} />
              )}
              Ask the seller
            </button>
          </div>

          <div className="mt-8 grid gap-3 border-t border-gray-100 pt-6 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <FiTruck className="mt-0.5 shrink-0 text-primary" size={19} />
              <div>
                <p className="text-sm font-semibold text-secondary">
                  Delivery
                </p>
                <p className="text-xs text-gray-500">
                  Shipping calculated at checkout.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiShield className="mt-0.5 shrink-0 text-primary" size={19} />
              <div>
                <p className="text-sm font-semibold text-secondary">
                  Buyer protection
                </p>
                <p className="text-xs text-gray-500">
                  Secure checkout with order tracking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {shop.name && (
        <section className="mt-12">
          <Card className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {shop.avatar ? (
                <img
                  src={imageUrl(shop.avatar)}
                  alt={shop.name}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 font-poppins text-xl font-bold text-primary">
                  {initials(shop.name)}
                </span>
              )}

              <div>
                <p className="eyebrow">Seller</p>
                <h2 className="font-poppins text-lg font-bold text-secondary">
                  {shop.name}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {shop.description || "Visit the shop to see more products."}
                </p>
              </div>
            </div>

            {shopId && (
              <Link
                to={`/shop/${shopId}`}
                className="inline-flex shrink-0 items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-secondary transition hover:border-primary hover:text-primary"
              >
                Visit shop
              </Link>
            )}
          </Card>
        </section>
      )}

      <section className="mt-12">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-poppins text-xl font-bold text-secondary">
                Customer reviews
              </h2>

              {reviews.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Stars value={rating} />
                  <span className="font-semibold text-secondary">
                    {rating.toFixed(1)}
                  </span>
                  <span>out of 5</span>
                </div>
              )}
            </div>

            {reviews.length ? (
              <div className="mt-6 space-y-5">
                {[...reviews].reverse().map((review, index) => (
                  <article
                    key={review._id || index}
                    className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      {review.user?.avatar ? (
                        <img
                          src={imageUrl(review.user.avatar)}
                          alt={review.user.name || "Customer"}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500">
                          {initials(review.user?.name)}
                        </span>
                      )}

                      <div>
                        <p className="text-sm font-semibold text-secondary">
                          {review.user?.name || "Customer"}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <Stars
                            value={Number(review.rating || 0)}
                            size={12}
                          />
                          {review.createdAt && (
                            <span className="text-[11px] text-gray-400">
                              {formatDate(review.createdAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {review.message}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                No reviews yet. Be the first to review this product.
              </p>
            )}
          </Card>

          <Card className="h-fit">
            <h2 className="font-poppins text-xl font-bold text-secondary">
              Write a review
            </h2>

            {!isAuthenticated ? (
              <div className="mt-5 rounded-xl bg-gray-50 p-5 text-sm text-gray-600">
                <p>Sign in to share your experience with this product.</p>
                <Link
                  to="/login"
                  state={{ from: `/product/${product._id}` }}
                  className="mt-4 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Sign in to review
                </Link>
              </div>
            ) : alreadyReviewed ? (
              <p className="mt-5 rounded-xl bg-emerald-50 px-4 py-5 text-sm text-emerald-700">
                You have already reviewed this product. Thank you for your
                feedback.
              </p>
            ) : (
              <form onSubmit={submitReview} className="mt-5">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      aria-label={`${star} star${star === 1 ? "" : "s"}`}
                      className="p-0.5"
                    >
                      <FiStar
                        size={24}
                        fill={
                          star <= reviewRating ? "currentColor" : "none"
                        }
                        className={
                          star <= reviewRating
                            ? "text-amber-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>

                <TextArea
                  className="mt-4"
                  value={reviewMessage}
                  onChange={(event) => setReviewMessage(event.target.value)}
                  placeholder="What did you like or dislike about this product?"
                  maxLength={1000}
                  required
                />

                {reviewError && (
                  <p className="mt-3 text-sm text-red-600">{reviewError}</p>
                )}

                <Button
                  className="mt-4 w-full"
                  disabled={reviewBusy || !reviewMessage.trim()}
                >
                  {reviewBusy ? "Submitting..." : "Submit review"}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </section>

      {(related.length > 0 || relatedLoading) && (
        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between gap-3">
            <div>
              <p className="eyebrow">More in {product.category}</p>
              <h2 className="section-title mt-1">You may also like</h2>
            </div>

            <Link
              to={`/products?category=${encodeURIComponent(product.category)}`}
              className="text-sm font-semibold text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {relatedLoading
              ? [1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="aspect-[3/4] animate-pulse rounded-2xl bg-white"
                  />
                ))
              : related.map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
          </div>
        </section>
      )}
    </Shell>
  );
}
