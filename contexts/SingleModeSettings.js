import { createContext, useContext, useState } from "react";

const SingleModeContext = createContext(null);

export function SingleModeSettings({ children }) {
  const [settings, setSettings] = useState(null);

  return (
    <SingleModeContext.Provider
      value={{
        settings,
        setSettings,
      }}
    >
      {children}
    </SingleModeContext.Provider>
  );
}

export function useSingleModeSettings() {
  return useContext(SingleModeContext);
}
