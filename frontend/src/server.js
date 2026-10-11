const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

const API_URL = `${BACKEND_URL}/api/v1`;

const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL || "http://localhost:4001";

export { BACKEND_URL, API_URL, SOCKET_URL };
