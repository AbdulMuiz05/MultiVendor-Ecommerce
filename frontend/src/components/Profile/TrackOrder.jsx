import React from "react";

const TrackOrder = ({ order }) => {
  const statuses = [
    "Processing",
    "Transferred to delivery partner",
    "Shipping",
    "Received",
  ];

  const currentStatus = order?.status || "Processing";
  const currentIndex = statuses.findIndex(
    (status) => status.toLowerCase() === currentStatus.toLowerCase()
  );

  return (
    <div className="w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
      <h2 className="font-poppins text-2xl font-bold text-secondary">
        Track Order
      </h2>

      {!order ? (
        <p className="mt-6 text-center text-gray-500">
          No order information available.
        </p>
      ) : (
        <div className="mt-8">
          <div className="mb-8">
            <p className="text-sm text-gray-400">Order ID</p>
            <p className="mt-1 font-semibold text-secondary">
              #{order._id}
            </p>
          </div>

          <div className="space-y-5">
            {statuses.map((status, index) => (
              <div key={status} className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold ${
                    index <= currentIndex
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>

                <span
                  className={`text-sm font-medium ${
                    index <= currentIndex
                      ? "text-secondary"
                      : "text-gray-400"
                  }`}
                >
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;