import { fireEvent, render, screen } from "@testing-library/react";
import SearchInput from "../../src/components/ui/SearchInput";

describe("SearchInput Component", () => {
  it("renders with placeholder and value", () => {
    render(
      <SearchInput
        placeholder="Search jobs..."
        value="Software"
        onChange={() => {}}
      />,
    );
    const input = screen.getByPlaceholderText("Search jobs...");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("Software");
  });

  it("calls onChange when the input value changes", () => {
    const handleChange = jest.fn();
    render(<SearchInput value="" onChange={handleChange} />);
    const input = screen.getByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "developer" } });
    expect(handleChange).toHaveBeenCalledWith("developer");
  });

  it("applies custom className to wrapper", () => {
    const { container } = render(
      <SearchInput value="" onChange={() => {}} className="custom-search" />,
    );
    expect(container.firstChild).toHaveClass("custom-search");
  });
});
