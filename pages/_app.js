import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SocketProvider } from "../contexts/SocketContext";
import "../styles/globals.css";

const useRouterReady = () => {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setReady(router.isReady);
  }, [router.isReady]);
  return ready;
};

function MyApp({ Component, pageProps }) {
  const routerReady = useRouterReady();
  return routerReady ? (
    <SocketProvider>
      <Component {...pageProps} />
    </SocketProvider>
  ) : null;
}

export default MyApp;
