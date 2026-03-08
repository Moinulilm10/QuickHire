import Swal from "sweetalert2";
import { alertService } from "../../src/utils/alertService";

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

describe("alertService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls success alert with correct options", () => {
    alertService.success("Success Title", "Success Message");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "success",
        title: "Success Title",
        text: "Success Message",
        toast: true,
        position: "top-end",
      }),
    );
  });

  it("calls error alert with correct options", () => {
    alertService.error("Error Title", "Error Message");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "error",
        title: "Error Title",
        text: "Error Message",
        confirmButtonColor: "#4640DE",
      }),
    );
  });

  it("calls warning alert with correct options", () => {
    alertService.warning("Warning Title", "Warning Message");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "warning",
        title: "Warning Title",
        text: "Warning Message",
      }),
    );
  });

  it("calls info alert with correct options", () => {
    alertService.info("Info Title", "Info Message");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "info",
        title: "Info Title",
        text: "Info Message",
      }),
    );
  });

  it("calls confirm alert with correct options", () => {
    alertService.confirm(
      "Are you sure?",
      "You won't be able to revert this!",
      "Delete",
      true,
    );
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonColor: "#EF4444", // Danger color
        confirmButtonText: "Delete",
      }),
    );
  });

  it("calls custom alert with merged options", () => {
    alertService.custom({
      title: "Custom",
      text: "Custom text",
      icon: "question",
    });
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Custom",
        text: "Custom text",
        icon: "question",
        confirmButtonColor: "#4640DE",
      }),
    );
  });
});
