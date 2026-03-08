import { fireEvent, render, screen } from "@testing-library/react";
import PdfPreviewModal from "../../src/components/ui/PdfPreviewModal";

describe("PdfPreviewModal Component", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    pdfUrl: "/uploads/resume.pdf",
    title: "John Doe Resume",
  };

  it("returns null when isOpen is false", () => {
    const { container } = render(
      <PdfPreviewModal {...defaultProps} isOpen={false} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null when pdfUrl is null", () => {
    const { container } = render(
      <PdfPreviewModal {...defaultProps} pdfUrl={null} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders correctly when open with a pdfUrl", () => {
    render(<PdfPreviewModal {...defaultProps} />);
    expect(screen.getByText("John Doe Resume")).toBeInTheDocument();
    const iframe = screen.getByTitle("PDF Preview");
    expect(iframe).toBeInTheDocument();
    // It should append #toolbar=0 to the URL
    expect(iframe).toHaveAttribute(
      "src",
      expect.stringContaining("/uploads/resume.pdf#toolbar=0"),
    );
  });

  it("resolves the full URL correctly for relative paths", () => {
    const originalUrl = process.env.NEXT_PUBLIC_API_URL;
    process.env.NEXT_PUBLIC_API_URL = "http://api.test.com/api";
    render(<PdfPreviewModal {...defaultProps} />);
    const iframe = screen.getByTitle("PDF Preview");
    expect(iframe).toHaveAttribute(
      "src",
      "http://api.test.com/uploads/resume.pdf#toolbar=0",
    );
    process.env.NEXT_PUBLIC_API_URL = originalUrl;
  });

  it("uses the provided URL directly for absolute paths", () => {
    const absoluteUrl = "https://example.com/file.pdf";
    render(<PdfPreviewModal {...defaultProps} pdfUrl={absoluteUrl} />);
    const iframe = screen.getByTitle("PDF Preview");
    expect(iframe).toHaveAttribute(
      "src",
      "https://example.com/file.pdf#toolbar=0",
    );
  });

  it("calls onClose when the close button is clicked", () => {
    render(<PdfPreviewModal {...defaultProps} />);
    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
