import React from "react";

const AllEvents = ({ events = [] }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">All Events</h2>
      </div>

      {events.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No events found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3">Title</th>
                <th className="text-left px-5 py-3">Shop</th>
                <th className="text-left px-5 py-3">Price</th>
                <th className="text-left px-5 py-3">Stock</th>
                <th className="text-left px-5 py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="border-t border-gray-200">
                  <td className="px-5 py-4">{event.name}</td>
                  <td className="px-5 py-4">
                    {event.shop?.name || event.shop?.shopName || "-"}
                  </td>
                  <td className="px-5 py-4">
                    {event.discountPrice || event.originalPrice || "-"}
                  </td>
                  <td className="px-5 py-4">{event.stock ?? "-"}</td>
                  <td className="px-5 py-4">
                    {event.status || "Active"}
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