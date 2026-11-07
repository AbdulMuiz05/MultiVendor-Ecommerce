import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import Toaster from "./components/UI/Toaster";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='1000'%3E%3Crect width='800' height='1000' fill='%23f8fafc'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='56' fill='%2364748b' text-anchor='middle'%3EEshop%3C/text%3E%3C/svg%3E";

function App() {
  useEffect(() => {
    const handleImageError = (event) => {
      const image = event.target;

      if (!(image instanceof HTMLImageElement) || image.dataset.fallbackApplied) {
        return;
      }

      image.dataset.fallbackApplied = "true";
      image.src = FALLBACK_IMAGE;
    };

    window.addEventListener("error", handleImageError, true);

    return () => window.removeEventListener("error", handleImageError, true);
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;