import { fireEvent, render, screen } from "@testing-library/react";
import Input from "../../src/components/ui/Input";

describe("Input Component", () => {
  it("renders with label correctly", () => {
    render(<Input label="Username" placeholder="Enter username" />);
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();
  });

  it("renders with error message correctly", () => {
    render(<Input error="Field is required" />);
    expect(screen.getByText("Field is required")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveClass("border-danger");
  });

  it("renders with an icon", () => {
    const MockIcon = () => <span data-testid="input-icon" />;
    render(<Input icon={<MockIcon />} />);
    expect(screen.getByTestId("input-icon")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveClass("pl-10");
  });

  it("handles change events", () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test value" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("passes through other HTML input attributes", () => {
    render(<Input placeholder="required-field" required />);
    const target = screen.getByPlaceholderText("required-field");
    expect(target).toHaveAttribute("required");
  });
});
