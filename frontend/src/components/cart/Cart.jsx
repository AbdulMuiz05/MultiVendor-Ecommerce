import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/actions/cart";
import { imageUrl, money } from "../../pages/_pageUtils";

const Cart = ({ setOpenCart }) => {
  const { cart = [] } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const totalPrice = cart.reduce(
    (total, item) =>
      total +
      Number(item.discountPrice || item.price || 0) * Number(item.qty || 1),
    0
  );

  const removeFromCartHandler = (item) => {
    dispatch(removeFromCart(item._id));
  };

  const quantityChangeHandler = (item) => {
    dispatch(addToCart(item));
  };

  return (
    <div className="fixed inset-0 z-50 h-screen w-full bg-black/30">
      <div className="fixed right-0 top-0 flex h-full w-[90%] flex-col justify-between overflow-y-auto bg-white shadow-lg sm:w-[500px]">
        {cart.length === 0 ? (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <div className="fixed right-5 top-5">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>

            <IoBagHandleOutline size={60} className="mb-4 text-gray-400" />
            <h5 className="text-lg font-medium text-gray-600">
              Cart Items are empty!
            </h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end p-5">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenCart(false)}
                />
              </div>

              <div className="flex items-center px-5 pb-4">
                <IoBagHandleOutline size={25} />
                <h5 className="pl-2 text-xl font-medium">
                  {cart.length} {cart.length === 1 ? "item" : "items"}
                </h5>
              </div>

              <div className="w-full border-t">
                {cart.map((item) => (
                  <CartSingle
                    key={item._id}
                    data={item}
                    quantityChangeHandler={quantityChangeHandler}
                    removeFromCartHandler={removeFromCartHandler}
                  />
                ))}
              </div>
            </div>

            <div className="px-5 pb-5">
              <Link to="/checkout" onClick={() => setOpenCart(false)}>
                <div className="flex h-[50px] w-full items-center justify-center rounded-md bg-red-500">
                  <h1 className="text-lg font-semibold text-white">
                    Checkout Now ({money(totalPrice)})
                  </h1>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({
  data,
  quantityChangeHandler,
  removeFromCartHandler,
}) => {
  const [value, setValue] = useState(Number(data.qty) || 1);

  const price = Number(data.discountPrice || data.price || 0);
  const totalPrice = price * value;
  const stock = Number(data.stock);

  const increment = () => {
    if (Number.isFinite(stock) && value >= stock) {
      return;
    }

    const newQuantity = value + 1;
    setValue(newQuantity);

    quantityChangeHandler({
      ...data,
      qty: newQuantity,
    });
  };

  const decrement = () => {
    if (value <= 1) {
      return;
    }

    const newQuantity = value - 1;
    setValue(newQuantity);

    quantityChangeHandler({
      ...data,
      qty: newQuantity,
    });
  };

  const image =
    Array.isArray(data.images) && data.images.length > 0
      ? data.images[0]?.url || data.images[0]
      : "";

  return (
    <div className="border-b p-4">
      <div className="flex w-full items-center gap-3">
        <div className="flex flex-col items-center">
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white"
            onClick={increment}
          >
            <HiPlus size={17} />
          </button>

          <span className="py-1 text-sm font-medium">{value}</span>

          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200"
            onClick={decrement}
          >
            <HiOutlineMinus size={15} />
          </button>
        </div>

        <img
          src={imageUrl(image)}
          alt={data.name || "Product"}
          className="h-20 w-20 rounded-md object-cover"
        />

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-medium">{data.name}</h1>

          <p className="text-sm text-gray-500">
            {money(price)} × {value}
          </p>

          <p className="pt-1 text-base font-semibold text-red-600">
            {money(totalPrice)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => removeFromCartHandler(data)}
          className="shrink-0"
        >
          <RxCross1 className="cursor-pointer" size={18} />
        </button>
      </div>
    </div>
  );
};

export default Cart;