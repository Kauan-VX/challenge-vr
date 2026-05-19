import React from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFiltersStore } from "@vr/shared";
import HeaderSearch from "../components/HeaderSearch";
import { AppProviders } from "./testUtils";

beforeEach(() => {
  jest.useFakeTimers();
  useFiltersStore.setState({ search: "", category: null });
});

afterEach(() => {
  act(() => {
    jest.runOnlyPendingTimers();
  });
  jest.useRealTimers();
});

const setupUser = () => userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

const renderSearch = () =>
  render(
    <AppProviders>
      <HeaderSearch />
    </AppProviders>,
  );

const flushDebounce = () =>
  act(() => {
    jest.advanceTimersByTime(300);
  });

// userEvent v14 + fake timers nao envolve as interacoes em act() automaticamente
// (a integracao `advanceTimers` desliga o auto-wrap). Estes helpers tomam conta disso.
const typeText = (user: ReturnType<typeof setupUser>, el: HTMLElement, text: string) =>
  act(async () => {
    await user.type(el, text);
  });

const clear = (user: ReturnType<typeof setupUser>, el: HTMLElement) =>
  act(async () => {
    await user.clear(el);
  });

const pressEnter = (user: ReturnType<typeof setupUser>) =>
  act(async () => {
    await user.keyboard("{Enter}");
  });

const click = (user: ReturnType<typeof setupUser>, el: HTMLElement) =>
  act(async () => {
    await user.click(el);
  });

describe("HeaderSearch", () => {
  it("digitar no input atualiza o filtersStore depois do debounce de 300ms", async () => {
    const user = setupUser();
    renderSearch();

    await typeText(user, screen.getByTestId("header-search-input"), "perfume");

    // store ainda nao atualizou — o debounce nao expirou
    expect(useFiltersStore.getState().search).toBe("");

    flushDebounce();
    expect(useFiltersStore.getState().search).toBe("perfume");
  });

  it("digita uma sequencia rapida e so a ultima vai pro store", async () => {
    const user = setupUser();
    renderSearch();
    const input = screen.getByTestId("header-search-input");

    await typeText(user, input, "abc");
    act(() => {
      jest.advanceTimersByTime(150);
    });
    await clear(user, input);
    await typeText(user, input, "xyz");

    // sem flush completo nada foi escrito
    expect(useFiltersStore.getState().search).toBe("");

    flushDebounce();
    expect(useFiltersStore.getState().search).toBe("xyz");
  });

  it("submit do form aplica imediatamente, sem esperar o debounce", async () => {
    const user = setupUser();
    renderSearch();

    await typeText(user, screen.getByTestId("header-search-input"), "tenis");
    await pressEnter(user);

    expect(useFiltersStore.getState().search).toBe("tenis");
  });

  it("botao de limpar zera o termo no input e no store", async () => {
    const user = setupUser();
    renderSearch();

    const input = screen.getByTestId("header-search-input") as HTMLInputElement;
    await typeText(user, input, "abc");
    flushDebounce();
    expect(useFiltersStore.getState().search).toBe("abc");

    await click(user, screen.getByLabelText("Limpar busca"));

    expect(useFiltersStore.getState().search).toBe("");
    expect(input.value).toBe("");
  });

  it("reflete mudanca externa no store (clearFilters chamado de outro componente)", () => {
    useFiltersStore.setState({ search: "abc", category: null });
    renderSearch();

    const input = screen.getByTestId("header-search-input") as HTMLInputElement;
    expect(input.value).toBe("abc");

    act(() => {
      useFiltersStore.getState().clearFilters();
    });

    expect(input.value).toBe("");
  });
});
