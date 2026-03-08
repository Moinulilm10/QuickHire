import { fireEvent, render, screen } from "@testing-library/react";
import Pagination from "../../src/components/ui/Pagination";

describe("Pagination Component", () => {
  it("returns null if totalPages is 1 or less", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders correctly with multiple pages", () => {
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={() => {}} />,
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByLabelText("Previous Page")).toBeInTheDocument();
    expect(screen.getByLabelText("Next Page")).toBeInTheDocument();
  });

  it("highlights the current page", () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />,
    );
    const activePage = screen.getByText("3");
    expect(activePage).toHaveClass("bg-brand-primary text-white");
  });

  it("calls onPageChange when a page number is clicked", () => {
    const handlePageChange = jest.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={handlePageChange}
      />,
    );
    fireEvent.click(screen.getByText("3"));
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange with previous page when back button is clicked", () => {
    const handlePageChange = jest.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={handlePageChange}
      />,
    );
    fireEvent.click(screen.getByLabelText("Previous Page"));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with next page when next button is clicked", () => {
    const handlePageChange = jest.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={handlePageChange}
      />,
    );
    fireEvent.click(screen.getByLabelText("Next Page"));
    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  it("disables previous button on first page", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />,
    );
    expect(screen.getByLabelText("Previous Page")).toBeDisabled();
  });

  it("disables next button on last page", () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />,
    );
    expect(screen.getByLabelText("Next Page")).toBeDisabled();
  });

  it("renders ellipsis when there are many pages", () => {
    render(
      <Pagination currentPage={5} totalPages={10} onPageChange={() => {}} />,
    );
    // With 10 pages and current page 5, visible pages around 5 are 3,4,5,6,7.
    // It should show 1, ..., 3, 4, 5, 6, 7, ..., 10
    expect(screen.getAllByText("...")).toHaveLength(2);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });
});
