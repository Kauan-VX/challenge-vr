import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AppErrorBoundary, * as AppErrorBoundaryModule from "../components/AppErrorBoundary";
import { setTelemetrySink } from "@vr/shared";

const Boom: React.FC = () => {
  throw new Error("kaboom");
};

describe("AppErrorBoundary", () => {
  const originalError = console.error;
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    (console.error as jest.Mock).mockRestore?.();
    console.error = originalError;
  });

  it("renderiza filhos quando nao ha erro", () => {
    render(
      <AppErrorBoundary>
        <span>conteudo</span>
      </AppErrorBoundary>,
    );
    expect(screen.getByText("conteudo")).toBeInTheDocument();
  });

  it("captura excecao e mostra fallback com role=alert", () => {
    render(
      <AppErrorBoundary>
        <Boom />
      </AppErrorBoundary>,
    );
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /recarregar/i })).toBeInTheDocument();
  });

  it("encaminha erro para o sink de telemetria com a fonte shell.app", () => {
    const reportError = jest.fn();
    setTelemetrySink({ reportError });
    render(
      <AppErrorBoundary>
        <Boom />
      </AppErrorBoundary>,
    );
    expect(reportError).toHaveBeenCalledTimes(1);
    const [err, ctx] = reportError.mock.calls[0];
    expect(err).toBeInstanceOf(Error);
    expect(ctx).toMatchObject({ source: "shell.app" });
  });

  it("botao recarregar dispara window.location.reload", () => {
    const reloadSpy = jest.spyOn(AppErrorBoundaryModule, "reloadPage").mockImplementation(() => {});
    render(
      <AppErrorBoundary>
        <Boom />
      </AppErrorBoundary>,
    );
    fireEvent.click(screen.getByRole("button", { name: /recarregar/i }));
    expect(reloadSpy).toHaveBeenCalled();
    reloadSpy.mockRestore();
  });
});
