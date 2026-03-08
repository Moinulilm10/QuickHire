import { fireEvent, render, screen } from "@testing-library/react";
import Card from "../../src/components/ui/Card";

describe("Card Component", () => {
  it("renders children correctly", () => {
    render(
      <Card>
        <div data-testid="child">Card Content</div>
      </Card>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Card Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Card className="custom-card">Content</Card>);
    expect(container.firstChild).toHaveClass("custom-card");
  });

  it("applies hover styles when hover prop is true", () => {
    const { container } = render(<Card hover>Hover Card</Card>);
    expect(container.firstChild).toHaveClass("hover:shadow-lg");
    expect(container.firstChild).toHaveClass("cursor-pointer");
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Card onClick={handleClick}>Clickable Card</Card>);
    fireEvent.click(screen.getByText("Clickable Card"));
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Clickable Card")).toHaveClass("cursor-pointer");
  });
});
