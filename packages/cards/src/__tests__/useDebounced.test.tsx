import React from "react";
import { renderHook, act } from "@testing-library/react";
import { useDebounced } from "../hooks/useDebounced";

jest.useFakeTimers();

const StrictWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <React.StrictMode>{children}</React.StrictMode>
);

describe("useDebounced", () => {
  it("retorna valor inicial imediatamente", () => {
    const { result } = renderHook(() => useDebounced("a", 200));
    expect(result.current).toBe("a");
  });

  it("atualiza valor apenas apos o delay configurado", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounced(value, 200), {
      initialProps: { value: "a" },
    });
    rerender({ value: "b" });
    expect(result.current).toBe("a");

    act(() => {
      jest.advanceTimersByTime(199);
    });
    expect(result.current).toBe("a");

    act(() => {
      jest.advanceTimersByTime(2);
    });
    expect(result.current).toBe("b");
  });

  it("cancela atualizacoes pendentes em mudancas rapidas", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounced(value, 200), {
      initialProps: { value: "a" },
    });
    rerender({ value: "b" });
    act(() => {
      jest.advanceTimersByTime(150);
    });
    rerender({ value: "c" });
    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(result.current).toBe("a");
    act(() => {
      jest.advanceTimersByTime(60);
    });
    expect(result.current).toBe("c");
  });

  it("funciona sob React.StrictMode (double-invoke nao quebra o subject)", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounced(value, 200), {
      initialProps: { value: "a" },
      wrapper: StrictWrapper,
    });
    expect(result.current).toBe("a");
    rerender({ value: "b" });
    act(() => {
      jest.advanceTimersByTime(201);
    });
    expect(result.current).toBe("b");
  });
});
