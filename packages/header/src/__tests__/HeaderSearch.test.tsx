import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFiltersStore } from "@vr/shared";
import HeaderSearch from "../components/HeaderSearch";
import { AppProviders } from "./testUtils";

beforeEach(() => {
  useFiltersStore.setState({ search: "", category: null });
});

const renderSearch = () =>
  render(
    <AppProviders>
      <HeaderSearch />
    </AppProviders>,
  );

describe("HeaderSearch", () => {
  it("digitar no input atualiza o filtersStore com debounce", async () => {
    const user = userEvent.setup();
    renderSearch();
    await user.type(screen.getByTestId("header-search-input"), "perfume");
    await waitFor(() => expect(useFiltersStore.getState().search).toBe("perfume"), {
      timeout: 1500,
    });
  });

  it("submit do form aplica imediatamente", async () => {
    const user = userEvent.setup();
    renderSearch();
    const input = screen.getByTestId("header-search-input") as HTMLInputElement;
    await user.type(input, "tenis");
    await user.keyboard("{Enter}");
    expect(useFiltersStore.getState().search).toBe("tenis");
  });

  it("botao de limpar zera o termo", async () => {
    const user = userEvent.setup();
    renderSearch();
    await user.type(screen.getByTestId("header-search-input"), "abc");
    await waitFor(() => expect(useFiltersStore.getState().search).toBe("abc"), {
      timeout: 1500,
    });
    await user.click(screen.getByLabelText("Limpar busca"));
    expect(useFiltersStore.getState().search).toBe("");
  });
});
