import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Suspense } from "react";
import { JobsListContent } from "../../../src/components/jobs/JobsListContent";
import { initialJobsState } from "../../../src/reducers/jobs.reducer";

const mockJobsData = {
  success: true,
  jobs: [
    {
      id: 1,
      title: "Backend Dev",
      status: "active",
      location: "Cairo",
      createdAt: "2024-01-01",
      company: { name: "EgyptTech" },
      logoColor: "#ff0000",
    },
  ],
  pagination: { total: 1, totalPages: 1 },
};

const createResolvedPromise = (data: any) => {
  const p = Promise.resolve(data);
  (p as any).status = "fulfilled";
  (p as any).value = data;
  return p;
};

describe("JobsListContent", () => {
  const getProps = (promise = createResolvedPromise(mockJobsData)) => ({
    dataPromise: promise,
    isPending: false,
    state: initialJobsState,
    dispatch: jest.fn(),
    onDelete: jest.fn(),
  });

  it("renders job cards", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <JobsListContent {...getProps()} />
      </Suspense>,
    );

    await waitFor(() => {
      expect(screen.getByText("Backend Dev")).toBeInTheDocument();
      expect(screen.getByText("EgyptTech")).toBeInTheDocument();
    });
  });

  it("calls SELECT_JOB on card click", async () => {
    const props = getProps();
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <JobsListContent {...props} />
      </Suspense>,
    );

    await waitFor(() => screen.getByText("Backend Dev"));
    fireEvent.click(screen.getByText("Backend Dev").closest(".group")!);
    expect(props.dispatch).toHaveBeenCalledWith({
      type: "SELECT_JOB",
      payload: mockJobsData.jobs[0],
    });
  });

  it("calls onDelete on delete button click", async () => {
    const props = getProps();
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <JobsListContent {...props} />
      </Suspense>,
    );

    await waitFor(() => screen.getByText("Backend Dev"));
    fireEvent.click(screen.getByRole("button"));
    expect(props.onDelete).toHaveBeenCalledWith(mockJobsData.jobs[0]);
  });
});
