import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Suspense } from "react";
import { UsersDataContent } from "../../../src/components/users/UsersDataContent";
import { initialUsersState } from "../../../src/reducers/users.reducer";

const mockUsersData = {
  success: true,
  users: [
    {
      id: "1",
      name: "Alice",
      email: "alice@test.com",
      role: "admin",
      authProvider: "credentials",
      picture: null,
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      name: "Bob",
      email: "bob@google.com",
      role: "user",
      authProvider: "google",
      picture: "/bob.jpg",
      createdAt: "2024-01-02",
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

describe("UsersDataContent", () => {
  const getProps = (promise = createResolvedPromise(mockUsersData)) => ({
    dataPromise: promise,
    isPending: false,
    state: initialUsersState,
    dispatch: jest.fn(),
    onDelete: jest.fn(),
  });

  it("renders user table correctly", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <UsersDataContent {...getProps()} />
      </Suspense>,
    );

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });
  });

  it("shows Google badge for Google provider", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <UsersDataContent {...getProps()} />
      </Suspense>,
    );

    await waitFor(() => {
      expect(screen.getByText("Google")).toBeInTheDocument();
    });
  });

  it("does not show delete button for admin row", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <UsersDataContent {...getProps()} />
      </Suspense>,
    );

    await waitFor(() => {
      const rows = screen.getAllByRole("row");
      const adminRow = rows.find((r) => r.textContent?.includes("Alice"));
      expect(adminRow?.querySelector("button[title='Delete User']")).toBeNull();
    });
  });

  it("calls onDelete for non-admin user", async () => {
    const props = getProps();
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <UsersDataContent {...props} />
      </Suspense>,
    );

    await waitFor(() => screen.getByTitle("Delete User"));
    fireEvent.click(screen.getByTitle("Delete User"));
    expect(props.onDelete).toHaveBeenCalledWith("2", "Bob");
  });
});
