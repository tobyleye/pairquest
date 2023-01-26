import { ErrorBoundary  } from "react-error-boundary";

export function AppErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={
        <div style={{ height: "100vh", display: "grid", placeItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ marginBottom: 10 }}>
              Oops, an unexpected error occured, these things happens.
            </p>
            <button className="btn btn-primary">go home</button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
