import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const target = document.getElementById(id);

      if (target) {
        target.scrollIntoView();
        return;
      }
    }

    if (navigationType === "POP") return;

    window.scrollTo(0, 0);
  }, [pathname, hash, navigationType]);

  return null;
}
