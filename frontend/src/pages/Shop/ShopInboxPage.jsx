import React, { useEffect, useState } from "react";
import { api, Card, Shell, safeArray, getError } from "../_pageUtils";
import ChatPanel from "../../components/Chat/ChatPanel";

export default function ShopInboxPage() {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/conversation/get-all-conversations")
      .then((response) => {
        const conversations = safeArray(response.data.conversations);
        setRows(conversations);
        setSelected(conversations[0]?._id || "");
      })
      .catch((requestError) => setError(getError(requestError)));
  }, []);

  return (
    <Shell title="Inbox" subtitle="Customer conversations.">
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="space-y-3">
          {rows.length ? (
            rows.map((conversation) => (
              <button
                key={conversation._id}
                type="button"
                onClick={() => setSelected(conversation._id)}
                className={`w-full rounded-2xl border bg-white p-4 text-left shadow-card ${
                  selected === conversation._id
                    ? "border-primary"
                    : "border-gray-100"
                }`}
              >
                <p className="font-semibold text-secondary">
                  {conversation.groupTitle || "Customer Conversation"}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {conversation.lastMessage || "No messages yet."}
                </p>
              </button>
            ))
          ) : (
            <Card className="py-12 text-center text-sm text-gray-400">
              No conversations yet.
            </Card>
          )}
        </div>

        {selected ? (
          <ChatPanel conversationId={selected} />
        ) : (
          <Card className="flex min-h-[520px] items-center justify-center text-sm text-gray-400">
            Select a conversation.
          </Card>
        )}
      </div>
    </Shell>
  );
}
