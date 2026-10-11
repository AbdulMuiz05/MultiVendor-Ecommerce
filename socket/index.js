require("dotenv").config();

const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const PORT = Number(process.env.PORT || process.env.SOCKET_PORT || 4001);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const INTERNAL_SOCKET_SECRET = process.env.INTERNAL_SOCKET_SECRET;

const parseCookies = (header = "") =>
  header.split(";").reduce((cookies, part) => {
    const index = part.indexOf("=");
    if (index === -1) return cookies;
    const key = part.slice(0, index).trim();
    const value = decodeURIComponent(part.slice(index + 1).trim());
    cookies[key] = value;
    return cookies;
  }, {});

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("Eshop Socket.IO server is running");
  }

  if (req.method !== "POST" || req.url !== "/internal/publish-message") {
    res.writeHead(404);
    return res.end("Not found");
  }

  if (!INTERNAL_SOCKET_SECRET || req.headers["x-internal-socket-secret"] !== INTERNAL_SOCKET_SECRET) {
    res.writeHead(401, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ success: false, message: "Unauthorized" }));
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
    if (body.length > 1000000) req.destroy();
  });

  req.on("end", () => {
    try {
      const payload = JSON.parse(body);
      if (!payload.conversationId || !payload.message) {
        throw new Error("Invalid message payload");
      }

      io.to(`conversation:${payload.conversationId}`).emit(
        "new_message",
        payload.message
      );

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: error.message }));
    }
  });

  req.on("error", () => {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false }));
  });
});

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
});

io.use((socket, next) => {
  try {
    if (!process.env.JWT_SECRET_KEY) {
      return next(new Error("Socket authentication is not configured"));
    }

    const cookies = parseCookies(socket.handshake.headers.cookie);
    const token = cookies.token || cookies.seller_token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    socket.actorId = String(decoded.id);
    socket.actorType = cookies.seller_token && !cookies.token ? "seller" : "user";
    next();
  } catch (error) {
    next(new Error("Invalid or expired socket authentication"));
  }
});

io.on("connection", (socket) => {
  socket.join(`${socket.actorType}:${socket.actorId}`);

  socket.on("join_conversation", (conversationId) => {
    if (conversationId) {
      socket.join(`conversation:${conversationId}`);
    }
  });

  socket.on("leave_conversation", (conversationId) => {
    if (conversationId) {
      socket.leave(`conversation:${conversationId}`);
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Eshop socket server is running on port ${PORT}`);
});