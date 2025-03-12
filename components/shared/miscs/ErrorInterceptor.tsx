// app/ErrorInterceptor.tsx
"use client";

import { useEffect } from "react";

export default function ErrorInterceptor() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      // Intercepter les erreurs via addEventListener
      const errorListener = (event: ErrorEvent) => {
        if (
          event.error &&
          event.error.message &&
          event.error.message.includes("React does not recognize the")
        ) {
          event.preventDefault(); // Empêche l'affichage de la popup d'erreur
        }
      };
      window.addEventListener("error", errorListener);

      // Redéfinir window.onerror en fallback
      const originalOnError = window.onerror;
      window.onerror = function (message, source, lineno, colno, error) {
        if (
          error &&
          error.message &&
          error.message.includes("React does not recognize the")
        ) {
          return true; // L'erreur est considérée comme gérée
        }
        if (originalOnError) {
          return originalOnError(message, source, lineno, colno, error);
        }
        return false;
      };

      // Nettoyage lors du démontage du composant
      return () => {
        window.removeEventListener("error", errorListener);
        window.onerror = originalOnError;
      };
    }
  }, []);

  return null;
}
