import React, { lazy, Suspense } from "react";
import RemoteFallback from "./components/RemoteFallback";
import RemoteErrorBoundary from "./components/RemoteErrorBoundary";

const RemoteHeader = lazy(() => import("header/Header"));
const RemoteFooter = lazy(() => import("footer/Footer"));
const RemoteCards = lazy(() => import("cards/Cards"));

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-vr-bg">
      <RemoteErrorBoundary name="Header">
        <Suspense fallback={<RemoteFallback name="Header" className="min-h-16" />}>
          <RemoteHeader />
        </Suspense>
      </RemoteErrorBoundary>

      <main className="flex-1 w-full" id="conteudo">
        <RemoteErrorBoundary name="Cards">
          <Suspense fallback={<RemoteFallback name="produtos" className="min-h-80" />}>
            <RemoteCards />
          </Suspense>
        </RemoteErrorBoundary>
      </main>

      <RemoteErrorBoundary name="Footer">
        <Suspense fallback={<RemoteFallback name="Footer" className="min-h-40" />}>
          <RemoteFooter />
        </Suspense>
      </RemoteErrorBoundary>
    </div>
  );
};

export default App;
