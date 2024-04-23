import { useState, useEffect } from "react";

export const useFocused = (obj) => {
  const [active, setActive] = useState(document.activeElement);

  const handleFocusIn = (e) => {
    if (obj.current === document.activeElement) setActive(true);
    else setActive(false);
  };

  useEffect(() => {
    document.addEventListener("focusin", handleFocusIn);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, []);

  return active;
};

export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);

    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);

      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
