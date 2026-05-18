import React from "react";

interface Props {
  name: string;
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  message?: string;
}

class RemoteErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    if (process.env.NODE_ENV !== "production") {
      // log local apenas em dev
      // eslint-disable-next-line no-console
      console.error(`[shell] falha ao carregar remote "${this.props.name}"`, error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="m-5 p-4 border border-dashed border-vr-danger bg-[#fff5f5] text-vr-danger rounded-[10px]"
          role="alert"
        >
          <strong>Nao foi possivel carregar o modulo {this.props.name}.</strong>
          <p className="mt-1 mb-0 text-vr-text-muted">
            Verifique se o micro frontend correspondente esta em execucao.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default RemoteErrorBoundary;
