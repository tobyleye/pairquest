import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SocketProvider } from "../contexts/SocketContext";
import { AppErrorBoundary } from "../components/error-boundary";
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
        <title>Pair Quest</title>
        <meta
          name="description"
          content="A fun game where players try to match pairs."
        />
      </Head>
      {routerReady ? (
        <AppErrorBoundary>
          <SocketProvider>
            <Component {...pageProps} />
          </SocketProvider>
        </AppErrorBoundary>
      ) : null}
    </div>
  );
}

export default MyApp;
