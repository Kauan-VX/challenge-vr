import React from "react";
import { reportError } from "@vr/shared";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    reportError(error, {
      source: "shell.app",
      componentStack: info.componentStack,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-vr-bg p-6"
        role="alert"
        data-testid="app-error"
      >
        <div className="max-w-md w-full bg-vr-surface border border-vr-border rounded-[10px] p-6 text-center shadow-(--shadow-vr-lg)">
          <h1 className="m-0 text-xl font-bold text-vr-danger">Algo deu errado.</h1>
          <p className="mt-2 mb-4 text-vr-text-muted">
            Não foi possível iniciar a aplicação. Tente recarregar a página.
          </p>
          <button
            type="button"
            className="bg-vr-primary text-white border-0 px-4 py-2 rounded-[10px] font-bold hover:bg-vr-primary-hover"
            onClick={this.handleReload}
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }
}

export default AppErrorBoundary;
