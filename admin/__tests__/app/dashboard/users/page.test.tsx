import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import UsersPage from "../../../../src/app/dashboard/users/page";
import { userService } from "../../../../src/services/user.service";
import { alertService } from "../../../../src/utils/alertService";

// Mock services
jest.mock("../../../../src/services/user.service", () => ({
  userService: {
    getUsers: jest.fn(),
    deleteUser: jest.fn(),
  },
}));

jest.mock("../../../../src/utils/alertService", () => ({
  alertService: {
    confirm: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock child component
jest.mock("@/components/users/UsersDataContent", () => ({
  UsersDataContent: ({ onDelete }: any) => (
    <div data-testid="users-content">
      <button onClick={() => onDelete("1", "Alice")}>Delete Alice</button>
    </div>
  ),
  UsersLoadingSkeleton: () => <div>Loading...</div>,
}));

describe("UsersPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (userService.getUsers as jest.Mock).mockReturnValue(
      Promise.resolve({ success: true, users: [] }),
    );
  });

  it("renders and fetches users", async () => {
    render(<UsersPage />);
    expect(userService.getUsers).toHaveBeenCalledWith(1);
    await waitFor(() =>
      expect(screen.getByTestId("users-content")).toBeInTheDocument(),
    );
  });

  it("handles user deletion", async () => {
    (alertService.confirm as jest.Mock).mockResolvedValue({
      isConfirmed: true,
    });
    (userService.deleteUser as jest.Mock).mockResolvedValue({ success: true });

    render(<UsersPage />);
    await waitFor(() => screen.getByText("Delete Alice"));
    fireEvent.click(screen.getByText("Delete Alice"));

    await waitFor(() => {
      expect(userService.deleteUser).toHaveBeenCalledWith("1");
      expect(alertService.success).toHaveBeenCalled();
    });
  });
});
