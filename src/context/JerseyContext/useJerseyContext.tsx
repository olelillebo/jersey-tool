import { useContext } from "react";
import { JerseyColorsContext } from "./jerseyContext";

export function useJerseyColors() {
  const ctx = useContext(JerseyColorsContext);
  if (!ctx)
    throw new Error("useJerseyColors must be used within JerseyColorsProvider");
  return ctx;
}
