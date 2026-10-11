import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { api, Button, Card, getError, SOCKET_URL } from "../../pages/_pageUtils";

export default function ChatPanel({ conversationId, title = "Conversation" }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (!conversationId) return undefined;

    let active = true;

    const load = async () => {
      try {
        const response = await api.get(`/message/get-all-messages/${conversationId}`);
        if (active) setMessages(Array.isArray(response.data.messages) ? response.data.messages : []);
      } catch (requestError) {
        if (active) setError(getError(requestError));
      }
    };

    load();

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      socket.emit("join_conversation", conversationId);
    });

    socket.on("new_message", (message) => {
      if (String(message.conversationId) !== String(conversationId)) return;
      setMessages((current) => {
        if (current.some((item) => item._id === message._id)) return current;
        return [...current, message];
      });
    });

    socket.on("connect_error", () => {});

    return () => {
      active = false;
      socket.emit("leave_conversation", conversationId);
      socket.disconnect();
    };
  }, [conversationId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (event) => {
    event.preventDefault();
    const value = text.trim();

    if (!value || !conversationId) return;

    setBusy(true);
    setError("");

    try {
      const response = await api.post("/message/create-new-message", {
        conversationId,
        text: value,
      });

      setMessages((current) =>
        current.some((item) => item._id === response.data.message?._id)
          ? current
          : [...current, response.data.message]
      );
      setText("");
    } catch (requestError) {
      setError(getError(requestError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="flex min-h-[520px] flex-col">
      <h2 className="font-poppins text-xl font-bold text-secondary">{title}</h2>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-5 flex-1 space-y-3 overflow-y-auto rounded-2xl bg-gray-50 p-4">
        {!messages.length ? (
          <p className="py-16 text-center text-sm text-gray-400">
            No messages yet. Start the conversation.
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className="rounded-xl bg-white p-3 shadow-sm"
            >
              <p className="text-xs font-semibold text-primary">
                {message.sender}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                {message.text}
              </p>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="mt-4 flex gap-3">
        <input
          className="input-field flex-1"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Write a message..."
          maxLength={5000}
        />
        <Button disabled={busy || !text.trim()}>
          {busy ? "Sending..." : "Send"}
        </Button>
      </form>
    </Card>
  );
}
