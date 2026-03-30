import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const ToastContext = createContext(null);
const DEFAULT_DURATION = 2500;

export function ToastProvider({ children }) {
  const [toast, setToast] = useState("");
  const timeoutRef = useRef(null);

  const clearToast = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setToast("");
  };

  const showToast = (message, duration = DEFAULT_DURATION) => {
    if (!message) {
      return;
    }

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    setToast(message);
    timeoutRef.current = window.setTimeout(() => {
      setToast("");
      timeoutRef.current = null;
    }, duration);
  };

  useEffect(() => clearToast, []);

  const value = useMemo(
    () => ({
      showToast,
      clearToast
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? <div className="toast toast-success">{toast}</div> : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
