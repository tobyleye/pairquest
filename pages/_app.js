import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SocketProvider } from "../contexts/SocketContext";
import { SingleModeSettings } from "../contexts/SingleModeSettings";
import { ErrorBoundary } from "../components/error-boundry";
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
    <ErrorBoundary>
      <SocketProvider>
        <SingleModeSettings>
          <Component {...pageProps} />
        </SingleModeSettings>
      </SocketProvider>
    </ErrorBoundary>
  ) : null;
}

export default MyApp;
