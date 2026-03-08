import { fireEvent, render, screen } from "@testing-library/react";
import Button from "../../src/components/ui/Button";

describe("Button Component", () => {
  it("renders with children correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("applies the correct variant style", () => {
    const { rerender } = render(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-danger");

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button")).toHaveClass("border-surface-border");
  });

  it("applies the correct size style", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-3 py-1.5");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-6 py-3");
  });

  it("renders an icon when provided", () => {
    const MockIcon = () => <span data-testid="mock-icon" />;
    render(<Button icon={<MockIcon />}>With Icon</Button>);
    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
  });

  it("renders a loading spinner and disables the button when loading", () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
    expect(
      screen.getByRole("button").querySelector(".animate-spin"),
    ).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when the disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
