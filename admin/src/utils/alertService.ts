import Swal, { SweetAlertResult } from "sweetalert2";

// Reusable SweetAlert service — use throughout the app to avoid duplication

export const alertService = {
  /** Success toast — auto-closes */
  success(title: string, text?: string) {
    return Swal.fire({
      title,
      text,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  },

  /** Error alert */
  error(title: string, text?: string) {
    return Swal.fire({
      title,
      text,
      icon: "error",
      confirmButtonColor: "#4640DE",
    });
  },

  /** Confirmation dialog — returns true if confirmed */
  async confirm(
    title: string,
    text: string,
    confirmText = "Yes, do it!",
  ): Promise<boolean> {
    const result: SweetAlertResult = await Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: confirmText,
      cancelButtonText: "Cancel",
    });
    return result.isConfirmed;
  },

  /** Delete confirmation — shorthand for common delete pattern */
  async confirmDelete(itemName: string): Promise<boolean> {
    return this.confirm(
      "Delete Job?",
      `Are you sure you want to delete "${itemName}"?`,
      "Yes, delete it!",
    );
  },
};
