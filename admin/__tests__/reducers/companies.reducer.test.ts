import {
  companiesReducer,
  Company,
  initialCompaniesState,
} from "../../src/reducers/companies.reducer";

describe("companiesReducer", () => {
  it("should handle SET_SEARCH and reset page", () => {
    const initialState = { ...initialCompaniesState, currentPage: 5 };
    const action = { type: "SET_SEARCH" as const, payload: "tech" };
    const state = companiesReducer(initialState, action);
    expect(state.search).toBe("tech");
    expect(state.currentPage).toBe(1);
  });

  it("should handle SET_PAGE", () => {
    const action = { type: "SET_PAGE" as const, payload: 3 };
    const state = companiesReducer(initialCompaniesState, action);
    expect(state.currentPage).toBe(3);
  });

  it("should handle OPEN_MODAL without payload", () => {
    const action = { type: "OPEN_MODAL" as const };
    const state = companiesReducer(initialCompaniesState, action);
    expect(state.isModalOpen).toBe(true);
    expect(state.currentCompany).toBeNull();
    expect(state.formData.name).toBe("");
  });

  it("should handle OPEN_MODAL with payload", () => {
    const company: Company = {
      id: 1,
      uuid: "u-1",
      name: "Google",
      location: "Mountain View",
      logo: "google.png",
      jobs: [],
    };
    const action = { type: "OPEN_MODAL" as const, payload: company };
    const state = companiesReducer(initialCompaniesState, action);
    expect(state.isModalOpen).toBe(true);
    expect(state.currentCompany).toEqual(company);
    expect(state.formData).toEqual({
      name: "Google",
      location: "Mountain View",
      logo: "google.png",
    });
  });

  it("should handle CLOSE_MODAL", () => {
    const activeState = {
      ...initialCompaniesState,
      isModalOpen: true,
      currentCompany: { id: 1 } as any,
      formData: { name: "Test", location: "Loc", logo: "" },
    };
    const action = { type: "CLOSE_MODAL" as const };
    const state = companiesReducer(activeState, action);
    expect(state.isModalOpen).toBe(false);
    expect(state.currentCompany).toBeNull();
    expect(state.formData.name).toBe("");
  });

  it("should handle SET_FORM_FIELD", () => {
    const action = {
      type: "SET_FORM_FIELD" as const,
      field: "location" as const,
      value: "San Francisco",
    };
    const state = companiesReducer(initialCompaniesState, action);
    expect(state.formData.location).toBe("San Francisco");
  });
});
