import React from "react";
import { Link } from "react-router-dom";
import CountDown from "./CountDown";

const EventCard = ({ event }) => {
  if (!event) return null;

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition">
      <Link to={`/event/${event._id}`}>
        <div className="w-full h-56 bg-gray-100">
          <img
            src={event.images?.[0]?.url || event.image}
            alt={event.name || "Event"}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {event.name}
        </h3>

        <div className="flex items-center gap-3 mt-2">
          <span className="text-lg font-bold text-gray-900">
            ${event.discountPrice ?? event.price ?? 0}
          </span>

          {event.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${event.originalPrice}
            </span>
          )}
        </div>

        {event.end_Date && (
          <div className="mt-3">
            <CountDown endDate={event.end_Date} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;