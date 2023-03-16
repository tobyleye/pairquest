import { createContext, useContext, useEffect, useState } from "react";
const AppStateContext = createContext();

function useShowPlug() {
  const [showPlug, setShowPlug] = useState(false);
  useEffect(() => {
    setShowPlug(true);
  }, []);
  return showPlug;
}

export function AppStateProvider({ children }) {
  const showPlug = useShowPlug();

  return (
    <AppStateContext.Provider value={{ showPlug }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppStateContext);
}
