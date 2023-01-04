import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SocketProvider } from "../contexts/SocketContext";
import { SingleModeSettings } from "../contexts/SingleModeSettings";
import { ErrorBoundary } from "../components/error-boundry";
import "../styles/globals.css";
import Head from "next/head";

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
  return (
    <div>
      <Head>
        <title>Memory game</title>
        <meta
          name="description"
          content="A fun memory game where players try to match pairs."
        />
      </Head>
      {routerReady ? (
        <ErrorBoundary>
          <SocketProvider>
            <SingleModeSettings>
              <Component {...pageProps} />
            </SingleModeSettings>
          </SocketProvider>
        </ErrorBoundary>
      ) : null}
    </div>
  );
}

export default MyApp;
