import { useAuth } from "./useAuth";
import { useEffect } from "react";

export const useDark = () => {
  const { dark, setDark } = useAuth();
  useEffect(() => {
    localStorage.setItem("darkmode", JSON.stringify(dark));
  }, [dark]);

  function insertMode() {
    setDark(!dark);
  }
  return { dark, insertMode };
};
