import axios from "axios";

import { API_URL, SOCKET_URL } from "../server";

export { API_URL, SOCKET_URL };

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getError = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong.";
