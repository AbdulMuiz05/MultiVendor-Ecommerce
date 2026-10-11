import React, { useState } from "react";

const ProductGallery = ({ images = [], name = "Product" }) => {
  const fallback = "https://via.placeholder.com/800x800?text=Product";
  const gallery = images.length ? images : [fallback];
  const [activeImage, setActiveImage] = useState(gallery[0]);

  return (
    <div className="space-y-4">
      <div className="aspect-square overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-card">
        <img
          src={activeImage}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      {gallery.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {gallery.slice(0, 5).map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveImage(image)}
              className={`aspect-square overflow-hidden rounded-xl border-2 bg-white transition ${
                activeImage === image
                  ? "border-primary"
                  : "border-transparent hover:border-gray-200"
              }`}
            >
              <img
                src={image}
                alt={`${name} ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;