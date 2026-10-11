import React from "react";

const AllEvents = ({ events = [], onDelete }) => {
  return (
    <div className="rounded-lg border bg-white">
      <div className="border-b px-5 py-4">
        <h2 className="text-xl font-semibold">All Events</h2>
      </div>

      {events.length === 0 ? (
        <p className="p-8 text-center text-gray-500">No events found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left">Event</th>
                <th className="px-5 py-3 text-left">Price</th>
                <th className="px-5 py-3 text-left">Stock</th>
                <th className="px-5 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="border-t">
                  <td className="px-5 py-4">{event.name}</td>
                  <td className="px-5 py-4">
                    {event.discountPrice ?? event.originalPrice ?? "-"}
                  </td>
                  <td className="px-5 py-4">{event.stock ?? "-"}</td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => onDelete?.(event._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllEvents;