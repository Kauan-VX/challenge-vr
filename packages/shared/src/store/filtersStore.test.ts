import { useFiltersStore } from "./filtersStore";

beforeEach(() => {
  useFiltersStore.setState({ search: "", category: null });
});

describe("filtersStore", () => {
  it("setSearch atualiza o termo", () => {
    useFiltersStore.getState().setSearch("perfume");
    expect(useFiltersStore.getState().search).toBe("perfume");
  });

  it("setCategory atualiza o slug", () => {
    useFiltersStore.getState().setCategory("beauty");
    expect(useFiltersStore.getState().category).toBe("beauty");
  });

  it("setCategory(null) limpa a categoria", () => {
    useFiltersStore.getState().setCategory("beauty");
    useFiltersStore.getState().setCategory(null);
    expect(useFiltersStore.getState().category).toBeNull();
  });

  it("clearFilters reseta search e category", () => {
    const { setSearch, setCategory, clearFilters } = useFiltersStore.getState();
    setSearch("xyz");
    setCategory("beauty");
    clearFilters();
    expect(useFiltersStore.getState()).toMatchObject({ search: "", category: null });
  });
});
