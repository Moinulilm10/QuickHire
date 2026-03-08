import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Suspense } from "react";
import { CompaniesDataContent } from "../../../src/components/companies/CompaniesDataContent";
import { initialCompaniesState } from "../../../src/reducers/companies.reducer";

const mockCompanies = {
  success: true,
  data: [
    {
      id: 101,
      uuid: "uuid-1",
      name: "Innovate Tech",
      location: "San Francisco",
      logo: "/innovate.png",
      jobs: [{}, {}],
    },
    {
      id: 102,
      uuid: "uuid-2",
      name: "Old Corp",
      location: "London",
      logo: null,
      jobs: [],
    },
  ],
  pagination: { total: 2, totalPages: 1 },
};

const createResolvedPromise = (data: any) => {
  const p = Promise.resolve(data);
  (p as any).status = "fulfilled";
  (p as any).value = data;
  return p;
};

describe("CompaniesDataContent", () => {
  const getProps = (promise = createResolvedPromise(mockCompanies)) => ({
    dataPromise: promise,
    isPending: false,
    state: initialCompaniesState,
    dispatch: jest.fn(),
    onDelete: jest.fn(),
  });

  it("renders company table with correct data", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <CompaniesDataContent {...getProps()} />
      </Suspense>,
    );

    await waitFor(() => {
      expect(screen.getByText("Innovate Tech")).toBeInTheDocument();
      expect(screen.getByText("Old Corp")).toBeInTheDocument();
    });
  });

  it("handles logo rendering vs initials", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <CompaniesDataContent {...getProps()} />
      </Suspense>,
    );

    await waitFor(
      () => {
        // Innovate Tech has a logo
        expect(screen.getByAltText("Innovate Tech")).toBeInTheDocument();
        // Old Corp has no logo, should show initials "OC"
        expect(screen.getByText("OC")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it("triggers actions correctly", async () => {
    const props = getProps();
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <CompaniesDataContent {...props} />
      </Suspense>,
    );

    await waitFor(() => screen.getAllByTitle("Edit"));

    // Edit action
    fireEvent.click(screen.getAllByTitle("Edit")[0]);
    expect(props.dispatch).toHaveBeenCalledWith({
      type: "OPEN_MODAL",
      payload: mockCompanies.data[0],
    });

    // Delete action
    fireEvent.click(screen.getAllByTitle("Delete")[0]);
    expect(props.onDelete).toHaveBeenCalledWith(mockCompanies.data[0].id);
  });
});
