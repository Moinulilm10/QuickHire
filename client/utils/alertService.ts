import Swal, { SweetAlertOptions } from "sweetalert2";

export const alertService = {
  success: (title: string, text?: string) => {
    return Swal.fire({
      icon: "success",
      title,
      text,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      customClass: {
        popup: "rounded-xl shadow-lg border border-surface-border",
        title: "text-text-dark font-bold text-sm",
      },
    });
  },

  error: (title: string, text?: string) => {
    return Swal.fire({
      icon: "error",
      title,
      text,
      confirmButtonColor: "#4640DE",
      customClass: {
        popup: "rounded-2xl shadow-xl",
        confirmButton: "rounded-lg px-6 py-2 font-bold",
      },
    });
  },

  warning: (title: string, text?: string) => {
    return Swal.fire({
      icon: "warning",
      title,
      text,
      confirmButtonColor: "#4640DE",
      customClass: {
        popup: "rounded-2xl shadow-xl",
        confirmButton: "rounded-lg px-6 py-2 font-bold",
      },
    });
  },

  info: (title: string, text?: string) => {
    return Swal.fire({
      icon: "info",
      title,
      text,
      confirmButtonColor: "#4640DE",
      customClass: {
        popup: "rounded-2xl shadow-xl",
        confirmButton: "rounded-lg px-6 py-2 font-bold",
      },
    });
  },

  custom: (options: SweetAlertOptions) => {
    return Swal.fire({
      ...options,
      confirmButtonColor: options.confirmButtonColor || "#4640DE",
      customClass: {
        popup:
          "rounded-2xl shadow-xl border border-surface-border animate-fade-in-up",
        confirmButton: "rounded-lg px-6 py-2 font-bold",
        cancelButton: "rounded-lg px-6 py-2 font-bold",
        ...options.customClass,
      },
    });
  },
  confirm: (
    title: string,
    text: string,
    confirmButtonText = "Yes",
    icon: SweetAlertOptions["icon"] = "warning",
  ) => {
    return Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonColor: icon === "warning" ? "#4640DE" : "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText,
      customClass: {
        popup: "rounded-2xl shadow-xl border border-surface-border",
        confirmButton: "rounded-lg px-6 py-2 font-bold",
        cancelButton: "rounded-lg px-6 py-2 font-bold",
      },
    });
  },
};
