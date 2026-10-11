import React from "react";
import { Link, useParams } from "react-router-dom";

const DashboardMessages = ({ messages = [] }) => {
  const { id } = useParams();

  return (
    <div className="rounded-lg border bg-white">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <h2 className="text-xl font-semibold">Messages</h2>

        <Link
          to={`/shop/${id}/inbox`}
          className="text-sm text-blue-600 hover:underline"
        >
          View All
        </Link>
      </div>

      {messages.length === 0 ? (
        <p className="p-8 text-center text-gray-500">No messages.</p>
      ) : (
        <div>
          {messages.slice(0, 5).map((message) => (
            <div key={message._id} className="border-b px-5 py-4 last:border-0">
              <p className="font-medium text-gray-800">
                {message.sender || "User"}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {message.text || message.message || "New message"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardMessages;