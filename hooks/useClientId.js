import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

const store_key = "clientId";

export function useClientId() {
  const [clientId, setClientId] = useState("");

  useEffect(() => {
    let clientId = window.sessionStorage.getItem(store_key);
    if (!clientId) {
      clientId = uuid();
      window.sessionStorage.setItem(store_key, clientId);
    }
    setClientId(clientId);
  }, []);

  return clientId;
}
