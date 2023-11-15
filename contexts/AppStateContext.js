import { createContext, useContext, useEffect, useState } from "react";
const AppStateContext = createContext();

export function AppStateProvider({ children }) {
  const [showPlug, setShowPlug] = useState(false);
  useEffect(() => {
    setShowPlug(true);
  }, []);

  return (
    <AppStateContext.Provider value={{ showPlug }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppStateContext);
}
