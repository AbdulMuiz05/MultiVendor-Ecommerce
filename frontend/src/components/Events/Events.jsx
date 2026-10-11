import React from "react";
import EventCard from "./EventCard";

const Events = ({ events = [] }) => {
  if (!events.length) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-gray-500">No events available.</p>
      </div>
    );
  }

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </section>
  );
};

export default Events;