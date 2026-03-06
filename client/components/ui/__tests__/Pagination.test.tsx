import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Pagination from "../Pagination";

describe("Pagination Component", () => {
  const onPageChangeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render if totalPages is 1 or less", () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={onPageChangeMock}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders correctly with multiple pages", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChangeMock}
      />,
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByLabelText("Previous Page")).toBeDisabled();
    expect(screen.getByLabelText("Next Page")).not.toBeDisabled();
  });

  it("calls onPageChange when clicking a page number", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChangeMock}
      />,
    );

    fireEvent.click(screen.getByText("3"));
    expect(onPageChangeMock).toHaveBeenCalledWith(3);
  });

  it("navigates to the next and previous pages", () => {
    const { rerender } = render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChangeMock}
      />,
    );

    fireEvent.click(screen.getByLabelText("Previous Page"));
    expect(onPageChangeMock).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByLabelText("Next Page"));
    expect(onPageChangeMock).toHaveBeenCalledWith(3);
  });

  it("renders ellipsis correctly for many pages", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={onPageChangeMock}
      />,
    );

    const ellipses = screen.getAllByText("...");
    expect(ellipses.length).toBe(2);
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });
});
