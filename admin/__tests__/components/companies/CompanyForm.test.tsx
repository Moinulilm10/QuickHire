import { fireEvent, render, screen } from "@testing-library/react";
import CompanyForm from "../../../src/components/companies/CompanyForm";

describe("CompanyForm", () => {
  const defaultProps = {
    formData: { name: "OpenAI", location: "SF", logo: null },
    onChange: jest.fn(),
    onSubmit: jest.fn(),
  };

  it("renders inputs with correct values", () => {
    render(<CompanyForm {...defaultProps} />);
    expect(screen.getByLabelText("Company Name *")).toHaveValue("OpenAI");
    expect(screen.getByLabelText("Location *")).toHaveValue("SF");
  });

  it("calls onChange when inputs change", () => {
    render(<CompanyForm {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText("Enter company name"), {
      target: { value: "Anthropic" },
    });
    expect(defaultProps.onChange).toHaveBeenCalledWith("name", "Anthropic");

    fireEvent.change(
      screen.getByPlaceholderText("e.g. New York, Berlin, Remote"),
      {
        target: { value: "Berlin" },
      },
    );
    expect(defaultProps.onChange).toHaveBeenCalledWith("location", "Berlin");
  });

  it("submits the form", () => {
    render(<CompanyForm {...defaultProps} />);
    const form = document.getElementById("company-form") as HTMLFormElement;
    fireEvent.submit(form);
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });
});
